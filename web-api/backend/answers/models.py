from django.db import models

from backend.users.models import User
from backend.prompts.models import Prompt


class AnswerManager(models.Manager):
    pass


class Answer(models.Model):
    content = models.JSONField()
    created = models.DateTimeField(auto_now_add=True)
    prompt = models.ForeignKey(Prompt, related_name='answers', on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name='answers', on_delete=models.CASCADE)
    votes = models.IntegerField(default=0)

    objects = AnswerManager()
