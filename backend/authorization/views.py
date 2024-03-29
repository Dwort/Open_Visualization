from authorization.serializers import UserRegistrationSerializer, UserLoginSerializer
from rest_framework.views import APIView
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import authenticate
from django.core.exceptions import ObjectDoesNotExist
from django.conf import settings
from django.contrib.auth import get_user_model
from premium.models import Premium
from django.core.cache import cache
from .utils import generate_access_token
import jwt


class UserRegistrationAPIView(APIView):
    serializer_class = UserRegistrationSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (AllowAny,)

    def get(self, request):
        content = {'message': 'Hello'}
        return Response(content)

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid(raise_exception=True):
            new_user = serializer.save()
            if new_user:
                access_token = generate_access_token(new_user)
                data = {'access_token': access_token}
                response = Response(data, status=status.HTTP_201_CREATED)
                response.set_cookie(key='access_token', value=access_token, httponly=False)
                return response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLoginAPIView(APIView):
    serializer_class = UserLoginSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (AllowAny,)

    def post(self, request):
        email = request.data.get('email', None)
        user_password = request.data.get('password', None)

        print(self.authentication_classes)

        if not user_password:
            raise AuthenticationFailed('The password is needed')

        if not email:
            raise AuthenticationFailed('The email is needed')

        user_instance = authenticate(username=email, password=user_password)

        if not user_instance:
            raise AuthenticationFailed('User not found. Try Register!')

        if user_instance.is_active:
            user_access_token = generate_access_token(user_instance)
            response = Response()
            response.set_cookie(key='access_token', value=user_access_token, httponly=False)
            response.data = {
                'access_token': user_access_token
            }
            return response

        return Response({
            'message': 'Something went wrong! Try again!'
        })


class UserViewAPI(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (AllowAny,)

    def get(self, request):
        user_token = request.headers.get('Authorization').split(' ')[1]
        cookie_token = request.COOKIES.get("access_token")
        print(user_token)
        print('_____-')
        print(cookie_token)
        if not user_token:
            raise AuthenticationFailed('Unauthenticated user!')

        payload = jwt.decode(user_token, settings.SECRET_KEY, algorithms=['HS256'])

        try:
            premium = Premium.objects.get(user_id=payload['id']).premium_type
        except Premium.DoesNotExist:
            premium = ''

        user_model = get_user_model()
        user = user_model.objects.filter(id=payload['id']).first()

        user_serializer = UserRegistrationSerializer(user)

        response_data = {
            'user_data': user_serializer.data,
            'user_premium': premium
        }

        return Response(response_data)


class UserLogoutViewAPI(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (AllowAny,)

    def post(self, request):
        user_token = request.COOKIES.get('access_token', None)
        print(user_token)
        if user_token:
            response = Response()
            response.delete_cookie('access_token')
            response.data = {
                'message': 'Logged out successfully!'
            }
            print('Loop')
            return response
        response = Response()
        response.data = {
            'message': 'User is already logged out!'
        }
        print('NO loop')
        return response


class UserDeleteViewAPI(APIView):

    def get(self, request):
        context = {"message": "function of user deleting"}
        return Response(context)

    def post(self, request):
        data = request.data
        user_id = data.get('id')

        user_model = get_user_model()

        try:
            user = user_model.objects.get(id=user_id)
        except ObjectDoesNotExist:
            return Response({"error": f"USER with id - {user_id} not found!"}, status=status.HTTP_404_NOT_FOUND)

        deleted, _ = user.delete()

        if deleted > 0:
            return Response({"message": f"USER with id - {user_id} successfully deleted"}, status=status.
                            HTTP_204_NO_CONTENT)
        else:
            return Response({"error": "FAILED to delete USER!"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
