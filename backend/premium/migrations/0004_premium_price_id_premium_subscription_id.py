# Generated by Django 4.2.6 on 2024-04-02 14:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('premium', '0003_premium_customer_id_alter_premium_session_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='premium',
            name='price_id',
            field=models.CharField(default=0, max_length=30),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='premium',
            name='subscription_id',
            field=models.CharField(default=0, max_length=30),
            preserve_default=False,
        ),
    ]
