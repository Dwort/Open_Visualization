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
