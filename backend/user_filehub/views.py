from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from storages.backends.s3boto3 import S3Boto3Storage
from botocore.exceptions import ClientError
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth import get_user_model
from .serializers import FileSerializer
from backend.utils import token_decode
import json


class AddUserFile(APIView):
    serializer_class = FileSerializer

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.file_url = None
        self.user = get_user_model()

    def post(self, request):
        user_id = token_decode(request=request)

        file = request.FILES.get('file')
        file_type = request.POST.get('fileType')
        file_func = request.POST.get('fileFunctions')

        try:
            file_func = json.loads(file_func)
        except json.JSONDecodeError as e:
            return Response(e, status=status.HTTP_400_BAD_REQUEST)

        s3_storage = S3Boto3Storage()
        folder_path = 'Users-Files'

        file_name_storage = f'{folder_path}/{file.name}'

        try:
            file_path = s3_storage.save(file_name_storage, file)
            self.file_url = s3_storage.url(file_path)

        except ClientError as e:
            return Response(e, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        user = self.user.objects.get(id=user_id['id'])

        data = {
            'user': user.id,
            'file_name': file.name,
            'file_type': file_type,
            's3_file_link': self.file_url,
            'file_functions': file_func,
        }

        serializer = self.serializer_class(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)

        else:
            return Response(serializer.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserFiles(APIView):
    serializer_class = FileSerializer
    user = get_user_model()

    def get(self, request):
        user_id = token_decode(request=request)

        user = self.user.objects.get(id=user_id['id'])

        try:
            files = user.files.all()

        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        files_group = []

        for file in files:
            files_group.append({
                'file_name': file.file_name,
                'file_type': file.file_type,
                's3_file_link': file.s3_file_link,
                'file_functions': file.file_functions,
                'uploading_date': file.uploading_date
            })

        return Response(files_group, status=status.HTTP_200_OK)
