# Generated by Django 3.1 on 2021-05-11 19:43

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('prompts', '0003_prompt_bounty'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Answer',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.JSONField()),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('votes', models.IntegerField(default=0)),
                ('prompt', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='answers', to='prompts.prompt')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='answers', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]