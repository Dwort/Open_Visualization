from django.conf import settings
from django.http import HttpRequest
import jwt


def token_decode(request: HttpRequest) -> dict:
    jwt_token = request.headers.get('Authorization').split(' ')[1]
    user_id = jwt.decode(jwt_token, settings.SECRET_KEY, algorithms=['HS256'])

    return user_id
