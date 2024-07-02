from django.urls import path

from user_filehub.views import (
    AddUserFileAPI,
    UserFilesAPI,
    DeleteFileAPI,
    EditFileNameAPI,
    EditFileFunctionsAPI,
    DownloadUserFileAPI,
)

urlpatterns = [
    path('files/', UserFilesAPI.as_view()),
    path('files/add/', AddUserFileAPI.as_view()),
    path('files/delete/', DeleteFileAPI.as_view()),
    path('files/edit-name/', EditFileNameAPI.as_view()),
    path('files/edit-functions/', EditFileFunctionsAPI.as_view()),
    path('files/download/', DownloadUserFileAPI.as_view()),
]
