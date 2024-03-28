from django.urls import path
from authorization.views import (
    UserRegistrationAPIView,
    UserLoginAPIView,
    UserViewAPI,
    UserLogoutViewAPI,
    UserDeleteViewAPI
)

urlpatterns = [
    path('user/register/', UserRegistrationAPIView.as_view()),
    path('user/login/', UserLoginAPIView.as_view()),
    path('user/', UserViewAPI.as_view()),
    path('user/logout/', UserLogoutViewAPI.as_view()),
    path('user/delete/', UserDeleteViewAPI.as_view()),
]
