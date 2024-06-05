from django.urls import path

from user_filehub.views import (
    AddUserFile,
)

urlpatterns = [
    path('files/add/', AddUserFile.as_view()),
]