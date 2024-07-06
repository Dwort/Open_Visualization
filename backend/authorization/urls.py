from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from authorization.views import (
    UserRegistrationAPIView,
    UserLoginAPIView,
    UserViewAPI,
    UserLogoutViewAPI,
    UserDeleteViewAPI,
    EditUserData,
)

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('user/register/', UserRegistrationAPIView.as_view()),
    path('user/login/', UserLoginAPIView.as_view()),
    path('user/', UserViewAPI.as_view()),
    path('user/logout/', UserLogoutViewAPI.as_view()),
    path('user/delete/', UserDeleteViewAPI.as_view()),
    path('user/data-edit/', EditUserData.as_view()),
]
