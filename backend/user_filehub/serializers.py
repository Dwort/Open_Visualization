from rest_framework import serializers
from user_filehub.models import UserFileData


class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserFileData
        fields = ['user', 'file_name', 'file_type', 's3_file_link', 'file_functions', 'uploading_date']


class FileGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserFileData
        fields = ['id', 'file_name', 'file_type', 'file_functions', 'uploading_date']


class EditFileNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserFileData
        fields = ['file_name']

    def update(self, instance, validated_data):
        instance.file_name = validated_data.get('file_name', instance.file_name)
        instance.save()
        return instance


class EditFileFunctionSerializer(serializers.ModelSerializer):
    file_functions = serializers.ListField(
        child=serializers.CharField(max_length=11)
    )

    class Meta:
        model = UserFileData
        fields = ['file_functions']
