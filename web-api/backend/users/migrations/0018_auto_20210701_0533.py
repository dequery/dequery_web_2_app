# Generated by Django 3.1 on 2021-07-01 05:33

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0017_auto_20210701_0530'),
    ]

    operations = [
        migrations.AlterField(
            model_name='resetpasswordcode',
            name='expiration_datetime',
            field=models.DateTimeField(default=datetime.datetime(2021, 7, 2, 5, 33, 39, 420338, tzinfo=utc)),
        ),
    ]
