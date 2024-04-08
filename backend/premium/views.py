from rest_framework.views import APIView
from rest_framework.response import Response
from premium.models import Premium
from rest_framework import status
from django.conf import settings
from django.core.cache import cache
from premium.utils import Encrypt, SetPremium, PremiumModify
import stripe
import jwt

stripe.api_key = settings.STRIPE_SECRET_KEY


class CreateCheckoutSessionView(APIView):
    def __init__(self, **kwargs):
        super().__init__()
        self.modify = PremiumModify()

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

# Comment: For CreatePortalSessionView, the "session_id" must be sent via axios and must be obtained from site's cookies
# like "access_token". CreatePortalSessionView won't redirect, it will use Response like previous class. And after users
# clicks the button in burger menu it will redirect the user to user subscription menu stripe. Or something like that.

class CreatePortalSessionView(APIView):
    def __init__(self, **kwargs):
        super().__init__()
        self.decode = Encrypt()

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
            print(self.response_handler, self.response_status)

        elif event['type'] == 'customer.subscription.created':
            premium_type = event['data']['object']['plan']["metadata"]["subscription_name"]
            customer_id = event['data']['object']['customer']
            price_id = event['data']['object']['items']['data'][0]['plan']['id']

            print('🔔 Subscription created!')

            # +++++++++++++++++++++++++++++++++++++++++
            # Notice: add here try except block like in SetPremium but in except must be RedisError
            # (set Redis main cache). And set Redis decorator for caching request to DB. Set decorator to function that
            # make request to DB.

            self.premium_data = {
                'premium_type': premium_type,
                'price_id': price_id
            }

            cache.set(customer_id, self.premium_data)
            self.response_handler, self.response_status = ({'status': 'success', 'response': 'successfully cached'},
                                                           status.HTTP_200_OK)
            print(self.response_handler, self.response_status)

            # +++++++++++++++++++++++++++++++++++++++++

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
                                                               status.HTTP_200_OK)

        elif event['type'] == 'customer.subscription.deleted':
            print('Subscription canceled: %s' % event['id'])

            # --- Call the class from another "utils.py" file, where the functionality will be implemented: get premium
            # data from the premium table of the DB by customer ID, which will go to the class from here, and after
            # receiving from the DB (check if the data is available. Realise without getting data from DB), delete it
            # from there. ---

            # TEST MESSAGE

        return Response(self.response_handler, status=self.response_status)
