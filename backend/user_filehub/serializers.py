from rest_framework import serializers
from user_filehub.models import UserFileData


class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserFileData
        fields = ['user', 'file_name', 'file_type', 's3_file_link', 'file_functions', 'uploading_date']
