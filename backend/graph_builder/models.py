from django.db import models


class Country(models.Model):
    country_id = models.AutoField(primary_key=True)
    country_name = models.CharField(max_length=100)
    alpha_code = models.CharField(max_length=3)

    def __str__(self):
        return self.country_name
