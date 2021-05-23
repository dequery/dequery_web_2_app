# Generated by Django 3.1 on 2021-05-23 04:31

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0007_auto_20210522_0747'),
    ]

    operations = [
        migrations.CreateModel(
            name='ResetPasswordCode',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('code', models.CharField(db_index=True, max_length=12, unique=True)),
                ('expiration_datetime', models.DateTimeField()),
                ('used', models.BooleanField(default=False)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reset_password_codes', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
