from rest_framework.views import APIView
from rest_framework.response import Response
from django.conf import settings
from rest_framework import status
from storages.backends.s3boto3 import S3Boto3Storage
from botocore.exceptions import ClientError
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth import get_user_model
from user_filehub.models import UserFileData
from botocore.exceptions import NoCredentialsError, PartialCredentialsError
from .serializers import FileSerializer, FileGroupSerializer, EditFileNameSerializer, EditFileFunctionSerializer
from backend.decorators import caching, delete_cache
from backend.utils import token_decode
import boto3
import json


class AddUserFileAPI(APIView):
    serializer_class = FileSerializer

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.file_url = None
        self.user = get_user_model()

    @delete_cache(key="UserFilesAPI")
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


class UserFilesAPI(APIView):
    serializer_class = FileGroupSerializer
    user = get_user_model()

    @caching
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
                'id': file.id,
                'file_name': file.file_name,
                'file_type': file.file_type,
                'file_functions': file.file_functions,
                'uploading_date': file.uploading_date
            })

        serializer = self.serializer_class(files_group, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


class DeleteFileAPI(APIView):

    @delete_cache(key="UserFilesAPI")
    def delete(self, request):
        file_id = request.query_params.get('file_id')

        try:
            file = UserFileData.objects.get(id=file_id)
        except UserFileData.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        file_path = f'Users-Files/{file.file_name}'

        try:
            s3_storage = S3Boto3Storage()
            s3_storage.delete(file_path)
        except ClientError as e:
            return Response(e, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        file.delete()

        return Response(status=status.HTTP_200_OK)


class EditFileNameAPI(APIView):
    serializer = EditFileNameSerializer

    @delete_cache(key="UserFilesAPI")
    def patch(self, request):
        file_id = request.query_params.get('file_id')
        new_file_name = request.data.get('newFileName')

        if not new_file_name:
            return Response({"error": "File name must be provided."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            file = UserFileData.objects.get(id=file_id)
        except UserFileData.DoesNotExist:
            return Response({"error": "File not found."}, status=status.HTTP_404_NOT_FOUND)

        old_file_path = f'Users-Files/{file.file_name}'
        new_file_path = f'Users-Files/{new_file_name}'

        try:
            s3_storage = S3Boto3Storage()
            s3_storage.connection.meta.client.copy(
                {
                    'Bucket': s3_storage.bucket.name,
                    'Key': old_file_path
                },
                s3_storage.bucket.name,
                new_file_path
            )
            s3_storage.delete(old_file_path)
        except ClientError as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        serializer = self.serializer(file, data={'file_name': new_file_name}, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_200_OK)
        return Response({"error": "Validation error."}, status=status.HTTP_400_BAD_REQUEST)


class EditFileFunctionsAPI(APIView):
    serializer = EditFileFunctionSerializer

    @delete_cache(key="UserFilesAPI")
    def patch(self, request):
        file_id = request.query_params.get('file_id')
        edited_functions = request.data.get('functions')

        if not file_id or not isinstance(edited_functions, list):
            return Response({"error": "Invalid data provided."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            file = UserFileData.objects.get(id=file_id)
        except UserFileData.DoesNotExist:
            return Response({"error": "File not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.serializer(file, data={"file_functions": edited_functions}, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DownloadUserFileAPI(APIView):

    def get(self, request):
        file_id = request.query_params.get('file_id')

        if not file_id:
            return Response({'error': 'File id is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            file = UserFileData.objects.get(id=file_id)
        except UserFileData.DoesNotExist:
            return Response({'error': 'File does not exist!'}, status=status.HTTP_400_BAD_REQUEST)

        s3_client = boto3.client(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_S3_REGION_NAME,
        )

        file_name = f'Users-Files/{file.file_name}'

        try:
            url = s3_client.generate_presigned_url(
                'get_object',
                Params={'Bucket': settings.AWS_STORAGE_BUCKET_NAME, 'Key': file_name},
                ExpiresIn=3600
            )
            return Response({'url': url})
        except (NoCredentialsError, PartialCredentialsError) as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
