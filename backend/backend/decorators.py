from django.conf import settings
from rest_framework.response import Response
from functools import wraps
import jwt


def usage_counter(inner_func):
    @wraps(inner_func)
    def wrapper(request, *args, **kwargs):
        # user_token = request.headers.get("Authorization").split(' ')[1]
        # user_data = jwt.decode(user_token, settings.SECRET_KEY, algorithms=['HS256'])
        #
        # result = inner_func(request, *args, **kwargs)
        #
        # print(f"User ID - {user_data.id} ! And function name where is decorator - {inner_func.__name__} !")
        user_token = request.headers.get("Authorization")

        if not user_token:
            return Response({"message": "Authorization header missing."}, status=400)

        user_token = user_token.split(' ')[1]  # Extract the token

        try:
            user_data = jwt.decode(user_token, settings.SECRET_KEY, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            return Response({"message": "Expired token."}, status=401)
        except jwt.InvalidTokenError:
            return Response({"message": "Invalid token."}, status=401)

        result = inner_func(request, *args, **kwargs)  # Call inner function and store the result

        print(f"User ID - {user_data.get('id')}! And function name where the decorator is applied - {inner_func.__name__}!")

        return result

    return wrapper
