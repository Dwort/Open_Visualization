from django.contrib.postgres.fields import ArrayField
from django.db import models
from authorization.models import User


class UserFileData(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='files')
    file_name = models.CharField(max_length=255)
    file_type = models.CharField(max_length=100)
    s3_file_link = models.URLField(max_length=500)
    file_functions = ArrayField(
        models.CharField(max_length=11),
        size=4
        )
    uploading_date = models.DateTimeField(auto_now_add=True)

    def __repr__(self):
        return self.user.email
