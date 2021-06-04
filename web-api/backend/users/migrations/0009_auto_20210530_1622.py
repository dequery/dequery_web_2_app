# Generated by Django 3.1 on 2021-05-30 16:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0008_resetpasswordcode'),
    ]

    operations = [
        migrations.AddField(
            model_name='alphacode',
            name='endowment',
            field=models.DecimalField(decimal_places=18, default=0.0, max_digits=29),
        ),
        migrations.AddField(
            model_name='alphacode',
            name='use_count',
            field=models.IntegerField(default=1),
        ),
        migrations.AlterField(
            model_name='alphacode',
            name='used',
            field=models.IntegerField(default=0),
        ),
    ]