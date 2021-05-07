from django.db import models

from backend.users.models import User


class PromptManager(models.Manager):
    pass


class Prompt(models.Model):
    content = models.JSONField()
    created = models.DateTimeField(auto_now_add=True)
    expiration_datetime = models.DateTimeField()
    title = models.CharField(max_length=60)
    user = models.ForeignKey(User, related_name='prompts', on_delete=models.CASCADE)

    objects = PromptManager()
