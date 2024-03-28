from Crypto.Cipher import AES
from django.conf import settings
from django.contrib.auth import get_user_model
from authorization.models import User
from premium.models import Premium
from rest_framework import status
from rest_framework.response import Response
from django.core.cache import cache
import jwt


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
        print(jwt_data)
        user_data = self.user_model.objects.filter(id=jwt_data['id']).first()
        print(user_data)
        return user_data


# ____________________________________________________

# Comment: this class create in DB table row with premium current user.

# ____________________________________________________
class SetPremium:
    def premium_post(self, user_email, premium_data):
        user = User.objects.get(email=user_email)
        premium_data['premium_type'] = cache.get(premium_data['customer_id'])
        premium_data['user'] = user

        cache.delete(premium_data['customer_id'])

        try:
            Premium.objects.create(**premium_data)
            return Response({'request': True, 'status': 'successfully created'}, status=status.HTTP_201_CREATED)
        except (User.DoesNotExist, Premium.DoesNotExist,):
            return Response({'request': False, 'status': 'creation error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
