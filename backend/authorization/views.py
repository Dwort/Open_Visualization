from authorization.serializers import (UserRegistrationSerializer, UserLoginSerializer, DataUserEditSerializer,
                                       UserGetDataSerializer)
from rest_framework.views import APIView
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import authenticate
from django.db import DatabaseError
from django.contrib.auth import get_user_model
from premium.models import Premium, Limits
# from .utils import generate_access_token
from backend.decorators import caching, delete_cache
import stripe
from backend.utils import token_decode
from rest_framework_simplejwt.tokens import RefreshToken


class UserRegistrationAPIView(APIView):
    serializer_class = UserRegistrationSerializer
    # authentication_classes = (TokenAuthentication,)
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid(raise_exception=True):
            new_user = serializer.save()
            if new_user:
                refresh = RefreshToken.for_user(new_user)
                data = {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
                response = Response(data, status=status.HTTP_201_CREATED)
                # response.set_cookie(key='access_token', value=access_token, httponly=True)
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
            # user_access_token = generate_access_token(user_instance)
            # response = Response()
            # response.set_cookie(key='access_token', value=user_access_token, httponly=True)
            # response.data = {
            #     'access_token': user_access_token
            # }
            refresh = RefreshToken.for_user(user_instance)
            response = Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
            return response

        return Response({'message': 'Something went wrong! Try again!'}, status=status.HTTP_400_BAD_REQUEST)


class UserViewAPI(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (AllowAny,)

    def __init__(self, **kwargs):
        super().__init__()
        self.premium = ''
        self.limit = 0

    @caching
    def get(self, request):
        payload = token_decode(request=request)

        try:
            self.premium = Premium.objects.get(user_id=payload['user_id']).premium_type
        except Premium.DoesNotExist:
            self.premium = ''

        try:
            self.limit = Limits.objects.get(user_id=payload['user_id']).usages
        except Limits.DoesNotExist:
            self.limit = 0

        user_data = get_user_model().objects.filter(id=payload['user_id']).first()

        user_serializer = UserGetDataSerializer(user_data)

        response_data = {
            "user_data": user_serializer.data,
            "user_premium": self.premium,
            "user_limit": self.limit,
        }

        return Response(response_data, status=status.HTTP_200_OK)


class UserLogoutViewAPI(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (AllowAny,)

    @delete_cache(key="UserViewAPI")
    def get(self, request):
        user_token = request.headers.get("Authorization").split(' ')[1]
        # user_id = token_decode(request=request)

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

    @delete_cache(key="UserViewAPI")
    def delete(self, request):
        user_data = token_decode(request=request)

        try:
            user = self.user.objects.get(id=user_data['user_id'])

            try:
                premium = Premium.objects.get(user_id=user_data['user_id'])
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

    @delete_cache(key="UserViewAPI")
    def patch(self, request):
        user_data = token_decode(request=request)

        user = self.user.objects.get(id=user_data['user_id'])

        serializer = DataUserEditSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()

            return Response(status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
