# Generated by Django 3.1 on 2021-06-30 04:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('notifications', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='notification',
            name='category',
            field=models.CharField(choices=[('out_of_band', 'out_of_band'), ('OUT_OF_BAND', 'OUT_OF_BAND'), ('Out of band', 'Out of band'), ('reset_password', 'reset_password'), ('RESET_PASSWORD', 'RESET_PASSWORD'), ('Reset password', 'Reset password')], max_length=64),
        ),
    ]
