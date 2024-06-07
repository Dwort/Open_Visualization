from django.urls import path

from user_filehub.views import (
    AddUserFile,
    UserFiles,
)

urlpatterns = [
    path('files/', UserFiles.as_view()),
    path('files/add/', AddUserFile.as_view()),
]