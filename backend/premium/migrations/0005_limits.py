# Generated by Django 4.2.6 on 2024-05-03 12:42

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('premium', '0004_premium_price_id_premium_subscription_id'),
    ]

    operations = [
        migrations.CreateModel(
            name='Limits',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('usages', models.IntegerField(default=0)),
                ('first_action', models.DateTimeField(auto_now_add=True)),
                ('last_action', models.DateTimeField(auto_now=True)),
                ('premium', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='premium.premium')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
