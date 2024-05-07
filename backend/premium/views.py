from rest_framework.views import APIView
from rest_framework.response import Response
from premium.models import Premium, Limits
from rest_framework import status
from redis.exceptions import RedisError
from django.conf import settings
from django.core.cache import cache
from premium.utils import Encrypt, SetPremium, PremiumModify
from django.contrib.auth import get_user_model
import stripe
import jwt

stripe.api_key = settings.STRIPE_SECRET_KEY


class CreateCheckoutSessionView(APIView):
    modify = PremiumModify()

    def post(self, request):

        price = request.data.get('price', None)
        token = request.headers.get('Authorization').split(' ')[1]

        response_message, status_code = self.modify.modifying(token, price)

        if not response_message:
            try:
                checkout_session = stripe.checkout.Session.create(
                    line_items=[
                        {
                            'price': price,
                            'quantity': 1,
                        },
                    ],
                    payment_method_types=['card', ],
                    mode='subscription',
                    success_url=settings.SITE_URL + '?success=true',
                    cancel_url=settings.SITE_URL + '?canceled=true',
                )

                response_message, status_code = {"redirect_url": checkout_session.url}, status.HTTP_201_CREATED
            except stripe.error.StripeError as e:
                response_message, status_code = {'error': str(e)}, status.HTTP_500_INTERNAL_SERVER_ERROR

        return Response(response_message, status=status_code)


# ____________________________________________________

class CreatePortalSessionView(APIView):
    decode = Encrypt()

    def post(self, request):

        jwt_token = request.headers.get('Authorization').split(' ')[1]
        user_id = jwt.decode(jwt_token, settings.SECRET_KEY, algorithms=['HS256'])

        try:
            premium = Premium.objects.get(user_id=user_id['id'])
        except Premium.DoesNotExist as e:
            return Response({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)

        decode_session_id = self.decode.decrypt(premium.session_id)

        try:
            checkout_session = stripe.checkout.Session.retrieve(decode_session_id)
            customer = checkout_session.customer
            return_url = settings.SITE_URL

            portal_session = stripe.billing_portal.Session.create(
                customer=customer,
                return_url=return_url,
            )

            return Response({"redirect_url": portal_session.url})
        except stripe.error.StripeError as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class WebhookView(APIView):
    def __init__(self, **kwargs):
        super().__init__()
        self.encrypt = Encrypt()
        self.post_to_premium = SetPremium()
        self.data_updating = PremiumModify()
        self.premium_data = {}
        self.response_handler = {}
        self.response_status = None

    def post(self, request, *args, **kwargs):

        webhook_secret = settings.WEBHOOK_SECRET_KEY

        try:
            payload = request.body.decode('utf-8')
            sig_header = request.headers.get('Stripe-Signature')
            event = stripe.Webhook.construct_event(
                payload, sig_header, webhook_secret
            )
        except ValueError as e:
            return Response({'error - Invalid payload': e}, status=status.HTTP_400_BAD_REQUEST)
        except stripe.error.SignatureVerificationError as e:
            return Response({'error - Invalid signature': e}, status=status.HTTP_400_BAD_REQUEST)

        # Handle the event
        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']['id']
            user_email = event['data']['object']['customer_details']['email']
            customer_id = event['data']['object']['customer']
            subscription_id = event['data']['object']['subscription']

            print(f'🔔 Payment succeeded! For - {user_email} !')

            self.premium_data = {
                'session_id': self.encrypt.encrypt(session),
                'customer_id': customer_id,
                'subscription_id': subscription_id
            }

            self.response_handler, self.response_status = self.post_to_premium.premium_post(user_email,
                                                                                            self.premium_data)

        elif event['type'] == 'customer.subscription.created':
            premium_type = event['data']['object']['plan']["metadata"]["subscription_name"]
            customer_id = event['data']['object']['customer']
            price_id = event['data']['object']['items']['data'][0]['plan']['id']

            print('🔔 Subscription created!')

            self.premium_data = {
                'premium_type': premium_type,
                'price_id': price_id
            }

            try:

                cache.set(customer_id, self.premium_data)
                self.response_handler, self.response_status = ({'status': 'success', 'response': 'successfully cached'},
                                                               status.HTTP_200_OK)

            except RedisError as re:
                self.response_handler, self.response_status = ({'status': 'error', 'response': str(re)},
                                                               status.HTTP_500_INTERNAL_SERVER_ERROR)

        elif event['type'] == 'customer.subscription.updated':
            if 'status' not in event['data']['previous_attributes']:

                new_price_id = event['data']['object']['plan']['id']
                new_premium_type = event['data']['object']['plan']['metadata']['subscription_name']
                subscription_id = event['data']['object']['id']

                self.response_handler, self.response_status = self.data_updating.data_changing(new_premium_type,
                                                                                               new_price_id,
                                                                                               subscription_id)
            else:
                print('Data updated %s' % event['id'])

                self.response_handler, self.response_status = ({'status': 'success',
                                                                'response': 'Data updated successfully!'},
                                                               status.HTTP_204_NO_CONTENT)

        elif event['type'] == 'customer.subscription.deleted':
            customer_id = event['data']['object']['customer']

            try:
                premium = Premium.objects.get(customer_id=customer_id)
                premium.delete()
                self.response_handler, self.response_status = ({'status': 'success',
                                                                'response': 'Subscription delete successfully!'},
                                                               status.HTTP_204_NO_CONTENT)
            except Premium.DoesNotExist:
                self.response_handler, self.response_status = ({'status': 'error',
                                                                'response': 'There is no subscription'},
                                                               status.HTTP_404_NOT_FOUND)

            print('Subscription canceled: %s' % event['id'])

        elif event['type'] == 'customer.deleted':
            self.response_handler, self.response_status = ({'status': 'success',
                                                            'response': 'Customer deleted successful'},
                                                           status.HTTP_200_OK)

        return Response(self.response_handler, status=self.response_status)


# Class with checking how many usages users made.
# Class (APIView) get request from useEffect from React.
# Here is must get an object from Limits (according to token) and check.
# If a user doesn't have an object, return HTTP_200_OK. If a user has an object, check how much usage he has.
# Get also premium_type from limit.premium_type and if count of usages not more, according to limit, return HTTP_200_OK.
# The last one: if a user's 'usages' == limit, return status 429.

# ________________________________________

# Class of adding counts to usage user limit. If a user doesn't have an object in Limits table, then create it and
# add their user data from user table and add one usage. If a user already has an object, add 1 to usage and
# return HTTP_200_OK
#   premium = Premium.objects.get(user_id=user_id['id'])

class LimitChecking(APIView):
    premium_type = ''
    user_counts = 0
    premium_models = {
        'freemium': 10,
        'Junior': 50,
        'Middle': 100,
    }

    def get(self, request):
        jwt_token = request.headers.get('Authorization').split(' ')[1]
        user_id = jwt.decode(jwt_token, settings.SECRET_KEY, algorithms=['HS256'])['id']

        try:
            limit = Limits.objects.get(user_id=user_id)

            self.premium_type = limit.premium_type
            self.user_counts = limit.usages

        except Limits.DoesNotExist:
            return Response(status=status.HTTP_200_OK)

        else:
            response = Response()

            if self.premium_type == 'Senior':
                response.status_code = status.HTTP_200_OK
                return response

            models_count = self.premium_models.get(self.premium_type)

            if self.user_counts < models_count:
                response.status_code = status.HTTP_200_OK
            else:
                response.status_code = status.HTTP_429_TOO_MANY_REQUESTS

            return response


class LimitChanging(APIView):
    def post(self, request):
        jwt_token = request.headers.get('Authorization').split(' ')[1]
        user_id = jwt.decode(jwt_token, settings.SECRET_KEY, algorithms=['HS256'])['id']
        user_model = get_user_model()

        user = user_model.objects.get(id=user_id)

        try:
            premium = Premium.objects.get(user_id=user_id)
        except Premium.DoesNotExist:
            premium = None

        limit, created = Limits.objects.get_or_create(user=user, premium=premium)

        print(f'Here is limit: {limit} and here is created {created} !!')

        if created:
            limit.usages += 1

        limit.usages += 1
        limit.save()

        response = Response()
        response.status_code = status.HTTP_200_OK

        return response
