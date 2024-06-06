from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from storages.backends.s3boto3 import S3Boto3Storage
from botocore.exceptions import ClientError
from django.contrib.auth import get_user_model
import jwt


class AddUserFile(APIView):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.file_url = None
        self.user = get_user_model()

    def post(self, request):
        jwt_token = request.headers.get('Authorization').split(' ')[1]
        user_id = jwt.decode(jwt_token, settings.SECRET_KEY, algorithms=['HS256'])

        file = request.FILES.get('file')
        file_type = request.POST.get('fileType')
        file_func = request.POST.get('fileFunctions')

        s3_storage = S3Boto3Storage()
        folder_path = 'Users-Files'

        file_name = f'{folder_path}/{file.name}'

        try:
            file_path = s3_storage.save(file_name, file)

            self.file_url = s3_storage.url(file_path)

            print(f'User id: {user_id}')

            print(f'Here is data: {file}, {file.name}, {file_type}, {file_func}')

            # print(f'Here is url of file in S3 -> {file_url}')

        except ClientError:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        print(f'From try block url -> {self.file_url}')

        user = self.user.objects.get(id=user_id['id'])

        # Add here code where add this data to DB with serializers. Write serializer.

        return Response(status=status.HTTP_200_OK)
