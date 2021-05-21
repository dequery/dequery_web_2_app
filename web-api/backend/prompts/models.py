from django.db import models

from backend.users.models import User
from backend.transactions.constants import TRANSACTION_CATEGORY_CHOICES
from backend.transactions.models import DeqTransaction


class PromptManager(models.Manager):
    pass


class Prompt(models.Model):
    content = models.JSONField()
    created = models.DateTimeField(auto_now_add=True)
    expiration_datetime = models.DateTimeField()
    title = models.CharField(max_length=60)
    user = models.ForeignKey(User, related_name='prompts', on_delete=models.CASCADE)

    objects = PromptManager()

    @property
    def bounty(self):
        bounty = 0
        deq_transactions = DeqTransaction.objects.filter(
            category=TRANSACTION_CATEGORY_CHOICES.TO_PROMPT_BOUNTY,
            other_pk=self.pk)
        for deq_transaction in deq_transactions:
            bounty += deq_transaction.amount
        return bounty
