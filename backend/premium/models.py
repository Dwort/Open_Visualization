from django.db import models
from authorization.models import User


class Premium(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    premium_type = models.CharField(max_length=10)
    session_id = models.BinaryField()
    customer_id = models.CharField(max_length=20)
    subscription_id = models.CharField(max_length=30)
    price_id = models.CharField(max_length=30)
    buying_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.email


class Limits(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    premium = models.OneToOneField(Premium, on_delete=models.CASCADE, null=True, blank=True)
    usages = models.IntegerField(default=0)
    first_action = models.DateTimeField(auto_now_add=True)
    last_action = models.DateTimeField(auto_now=True)

    def __repr__(self):
        return self.user.email

    @property
    def premium_type(self):
        if self.premium:
            return self.premium.premium_type
        else:
            return 'freemium'
