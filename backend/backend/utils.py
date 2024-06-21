from django.conf import settings
from django.http import HttpRequest
import jwt


def token_decode(request: HttpRequest) -> dict:
    jwt_token = request.headers.get('Authorization').split(' ')[1]

    try:
        user_id = jwt.decode(jwt_token, settings.SECRET_KEY, algorithms=['HS256'])
    except jwt.ExpiredSignatureError as e:
        raise f"Message: Expired token.\nError -> {e}"
    except jwt.InvalidTokenError as e:
        raise f"Message: Invalid token.\nError -> {e}"
    return user_id
