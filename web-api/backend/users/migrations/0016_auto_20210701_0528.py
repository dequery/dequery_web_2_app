# Generated by Django 3.1 on 2021-07-01 05:28

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0015_auto_20210630_0544'),
    ]

    operations = [
        migrations.AlterField(
            model_name='resetpasswordcode',
            name='expiration_datetime',
            field=models.DateTimeField(default=datetime.datetime(2021, 7, 2, 5, 27, 59, 919054, tzinfo=utc)),
        ),
    ]