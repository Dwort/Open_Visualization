from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from storages.backends.s3boto3 import S3Boto3Storage
from botocore.exceptions import ClientError
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth import get_user_model
from .serializers import FileSerializer, FileGroupSerializer, EditFileNameSerializer, EditFileFunctionSerializer
from backend.decorators import caching, delete_cache
from backend.utils import token_decode
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
                'file_name': file.file_name,
                'file_type': file.file_type,
                's3_file_link': file.s3_file_link,
                'file_functions': file.file_functions,
                'uploading_date': file.uploading_date
            })

        serializer = self.serializer_class(files_group, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


class DeleteFileAPI(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    user = get_user_model()

    @delete_cache(key="UserFilesAPI")
    def delete(self, request):
        user_id = token_decode(request=request)
        file_name = request.data.get('fileName')

        try:
            user = self.user.objects.get(id=user_id['id'])
            file = user.files.get(file_name=file_name)
            # file = self.user.files.get(user_id=user_id['id'], file_name=file_name)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        file_path = f'Users-Files/{file_name}'

        try:
            s3_storage = S3Boto3Storage()
            s3_storage.delete(file_path)
        except ClientError as e:
            return Response(e, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        file.delete()

        return Response(status=status.HTTP_200_OK)


class EditFileNameAPI(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    user = get_user_model()

    @delete_cache(key="UserFilesAPI")
    def patch(self, request):
        user_id = token_decode(request=request)
        old_file_name = request.data.get('oldFileName')
        new_file_name = request.data.get('newFileName')

        if not old_file_name or not new_file_name:
            return Response({"error": "Both oldFileName and newFileName must be provided."},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            user = self.user.objects.get(id=user_id['id'])
            file = user.files.get(file_name=old_file_name)
        except ObjectDoesNotExist:
            return Response({"error": "Object not found."}, status=status.HTTP_404_NOT_FOUND)

        old_file_path = f'Users-Files/{old_file_name}'
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

        serializer = EditFileNameSerializer(file, data={'file_name': new_file_name,
                                                        's3_file_link': s3_storage.url(new_file_path)}, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class EditFileFunctionsAPI(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    user = get_user_model()

    @delete_cache(key="UserFilesAPI")
    def patch(self, request):
        user_id = token_decode(request=request)
        file_name = request.data.get('fileName')
        edited_functions = request.data.get('functions')

        if not file_name or not isinstance(edited_functions, list):
            return Response({"error": "Invalid data provided."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            file = self.user.files.get(user_id=user_id['id'], file_name=file_name)
        except ObjectDoesNotExist:
            return Response({"error": "Object not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = EditFileFunctionSerializer(file, data={"file_function": edited_functions}, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
