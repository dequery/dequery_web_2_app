# Generated by Django 3.1 on 2021-05-13 19:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='deq_balance',
            field=models.IntegerField(default=0),
        ),
    ]
