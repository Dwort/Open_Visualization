from rest_framework import status
from rest_framework.response import Response
from functools import wraps
from .utils import token_decode
from django.core.cache import cache


def caching(func):
    @wraps(func)
    def wrapper(self, request, *args, **kwargs):
        if not request.headers.get("Authorization"):
            return Response({"message": "Authorization header missing."}, status=status.HTTP_400_BAD_REQUEST)

        user_data = token_decode(request=request)

        cache_key = f"{self.__class__.__name__}_{func.__name__}_{user_data['id']}"

        cached_data = cache.get(cache_key)

        if cached_data:
            return Response(cached_data, status=status.HTTP_200_OK)

        response = func(self, request, *args, **kwargs)  # Call inner function and store the response

        if response.status_code == status.HTTP_200_OK:
            cache.set(cache_key, response.data, timeout=60 * 2)

        return response

    return wrapper


def delete_cache(key):
    def decorator(func):
        @wraps(func)
        def wrapper(self, request, *args, **kwargs):
            if not request.headers.get("Authorization"):
                return Response({"message": "Authorization header missing."}, status=status.HTTP_400_BAD_REQUEST)

            user_data = token_decode(request=request)
            cache_key = f"{key}_get_{user_data['id']}"

            cache.delete(cache_key)
            return func(self, request, *args, **kwargs)
        return wrapper
    return decorator
