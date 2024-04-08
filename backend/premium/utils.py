import stripe
from Crypto.Cipher import AES
from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import DatabaseError
from premium.models import Premium
from rest_framework import status
from django.core.cache import cache
import jwt
import time


# ____________________________________________________

# Comment: this class encrypts and decrypts data (mainly session_id) using AES cipher. All the necessary things for
# the cipher, such as the key and IV, you can get from the developer (Dwort). IV - are in the settings.py file. But
# be careful! Do not make changes! If you need to use it, just use "settings.IV" in the code. The key to use AES can
# also be obtained like this "settings.ENCRYPT_KEY". A key located in a variable environment, it is not stored in the
# code like IV.

# ____________________________________________________

class Encrypt:
    def __init__(self):
        key = settings.ENCRYPT_KEY.encode('utf-8')
        self.cipher = AES.new(key, AES.MODE_CBC, iv=settings.IV)

    def __pad(self, data):
        pad_length = 16 - len(data) % 16
        padding = bytes([pad_length]) * pad_length

        return data + padding

    def __unpad(self, data):
        pad_length = data[-1]
        return data[:-pad_length]

    def encrypt(self, data_to_encrypt):
        data = data_to_encrypt.encode('utf-8')
        data = self.__pad(data)
        encrypt_key = self.cipher.encrypt(data)

        return encrypt_key

    def decrypt(self, data_to_decrypt):
        data = self.cipher.decrypt(data_to_decrypt)
        decrypt_key = self.__unpad(data)
        decrypt_key = decrypt_key.decode('utf-8')

        return decrypt_key


class GetUserData:
    def __init__(self):
        self.user_model = get_user_model()
        self.key = settings.SECRET_KEY

    def user_data(self, token):
        jwt_data = jwt.decode(token, self.key, algorithms=['HS256'])
        user_data = self.user_model.objects.filter(id=jwt_data['id']).first()

        return user_data


# ____________________________________________________

# Comment: this class create in DB table row with premium current user.

# ____________________________________________________
class SetPremium:
    def __init__(self):
        self.user_model = get_user_model()

    def premium_post(self, user_email, premium_data):
        user = self.user_model.objects.get(email=user_email)
        premium_data.update(cache.get(premium_data['customer_id']))
        premium_data['user'] = user

        cache.delete(premium_data['customer_id'])

        try:
            Premium.objects.create(**premium_data)

            return {'status': 'success', 'response': 'successfully created'}, status.HTTP_201_CREATED
        except DatabaseError:
            return {'status': 'error', 'response': 'creation error'}, status.HTTP_500_INTERNAL_SERVER_ERROR


class PremiumModify:
    def __init__(self):
        self.decode_data = GetUserData()

    def modifying(self, token, price):
        user_id = self.decode_data.user_data(token).id

        probation_date = int(time.time())
        try:
            premium = Premium.objects.get(user_id=user_id)
            premium_price = premium.price_id
            subscription_id = premium.subscription_id

        except Premium.DoesNotExist:
            return None, None

        if premium_price == price:
            return {'message': 'You already have this premium status. '
                               'If you want switch it, choose another!'}, status.HTTP_200_OK

        sub_item = stripe.Subscription.retrieve(subscription_id)

        try:
            stripe.Subscription.modify(
                subscription_id,
                items=[{
                    'id': sub_item['items'].data[0].id,
                    'price': price,
                }],
                proration_date=probation_date,
            )
            return {'message': 'Subscription updated successfully.'}, status.HTTP_200_OK
        except stripe.error.StripeError as e:
            return {'error': str(e)}, status.HTTP_400_BAD_REQUEST

    def data_changing(self, premium_type, price_id, subscription_id):
        try:
            premium = Premium.objects.get(subscription_id=subscription_id)

            premium.premium_type = premium_type
            premium.price_id = price_id

            premium.save()

            return {'status': 'success', 'response': 'New Data saved successfully !'}, status.HTTP_200_OK
        except Premium.DoesNotExist:
            return {'status': 'error', 'response': 'Premium data does not exist! '}, status.HTTP_404_NOT_FOUND
        except DatabaseError:
            return {'status': 'error', 'response': 'DataBase error !'}, status.HTTP_500_INTERNAL_SERVER_ERROR
