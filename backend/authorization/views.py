from authorization.serializers import UserRegistrationSerializer, UserLoginSerializer, DataUserEditSerializer
from rest_framework.views import APIView
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import authenticate
from django.db import DatabaseError
from django.conf import settings
from django.contrib.auth import get_user_model
from django.utils.decorators import method_decorator
from backend.decorators import usage_counter
from premium.models import Premium
from .utils import generate_access_token
from django.core.cache import cache
import stripe
import jwt


class UserRegistrationAPIView(APIView):
    serializer_class = UserRegistrationSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid(raise_exception=True):
            new_user = serializer.save()
            if new_user:
                access_token = generate_access_token(new_user)
                data = {'access_token': access_token}
                response = Response(data, status=status.HTTP_201_CREATED)
                response.set_cookie(key='access_token', value=access_token, httponly=True)
                return response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLoginAPIView(APIView):
    serializer_class = UserLoginSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (AllowAny,)

    def post(self, request):
        email = request.data.get('email', None)
        user_password = request.data.get('password', None)

        if user_password is None:
            raise AuthenticationFailed('The password is needed')

        if email is None:
            raise AuthenticationFailed('The email is needed')

        user_instance = authenticate(username=email, password=user_password)

        if not user_instance:
            raise AuthenticationFailed('User not found. Try Register!')

        if user_instance.is_active:
            user_access_token = generate_access_token(user_instance)
            response = Response()
            response.set_cookie(key='access_token', value=user_access_token, httponly=True)
            response.data = {
                'access_token': user_access_token
            }
            return response

        return Response({
            'message': 'Something went wrong! Try again!'
        }, status=status.HTTP_400_BAD_REQUEST)


class UserViewAPI(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (AllowAny,)

    @method_decorator(usage_counter)
    def get(self, request):
        user_token = request.headers.get("Authorization").split(' ')[1]

        if not user_token:
            raise AuthenticationFailed('Unauthenticated user!')

        payload = jwt.decode(user_token, settings.SECRET_KEY, algorithms=['HS256'])

        cached_user_data = cache.get(f"cached_user_data_{payload['id']}")

        if cached_user_data:
            return Response(cached_user_data, status=status.HTTP_200_OK)

        try:
            premium = Premium.objects.get(user_id=payload['id']).premium_type
        except Premium.DoesNotExist:
            premium = ''

        user_data = get_user_model().objects.filter(id=payload['id']).first()

        user_serializer = UserRegistrationSerializer(user_data)

        response_data = {
            "user_data": user_serializer.data,
            "user_premium": premium
        }

        cache.set(f"cached_user_data_{payload['id']}", response_data, timeout=60)

        return Response(response_data, status=status.HTTP_200_OK)


class UserLogoutViewAPI(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (AllowAny,)

    def get(self, request):
        user_token = request.headers.get("Authorization").split(' ')[1]

        if user_token:
            response = Response()
            response.delete_cookie("access_token")
            response.data = {
                'message': 'Logged out successfully!'
            }
            response.status_code = status.HTTP_200_OK

            return response

        return Response({'message': 'User is already logged out or unauthorized!'}, status=status.HTTP_401_UNAUTHORIZED)


class UserDeleteViewAPI(APIView):
    user = get_user_model()

    def post(self, request):
        user_token = request.headers.get("Authorization").split(' ')[1]
        user_data = jwt.decode(user_token, settings.SECRET_KEY, algorithms=['HS256'])

        try:
            user = self.user.objects.get(id=user_data['id'])

            try:
                premium = Premium.objects.get(user_id=user_data['id'])
            except Premium.DoesNotExist:
                premium = None

            if premium:
                stripe.Customer.delete(premium.customer_id)

            user.delete()

            response = Response()
            response.status_code = status.HTTP_200_OK

            return response

        except self.user.DoesNotExist:
            return Response({"error": "USER not found!"}, status=status.HTTP_404_NOT_FOUND)

        except DatabaseError as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class EditUserData(APIView):
    user = get_user_model()

    def patch(self, request):
        user_token = request.headers.get("Authorization").split(' ')[1]
        user_data = jwt.decode(user_token, settings.SECRET_KEY, algorithms=['HS256'])

        user = self.user.objects.get(id=user_data['id'])

        serializer = DataUserEditSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
