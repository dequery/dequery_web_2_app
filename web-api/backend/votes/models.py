from django.db import models

from backend.answers.models import Answer
from backend.users.models import User
from backend.prompts.models import Prompt


class VoteBalanceManager(models.Manager):
    pass


class VoteBalance(models.Model):
    amount = models.IntegerField()
    created = models.DateTimeField(auto_now_add=True)
    prompt = models.ForeignKey(Prompt, related_name='vote_balances', on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name='vote_balances', on_delete=models.CASCADE)

    objects = VoteBalanceManager()

    @property
    def remaining_amount(self):
        amount = self.amount
        for vote_cast in self.vote_casts.all():
            amount -= vote_cast.amount
        return amount


class VoteCastManager(models.Manager):
    pass


class VoteCast(models.Model):
    amount = models.IntegerField()
    answer = models.ForeignKey(Answer, related_name='vote_casts', on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)
    vote_balance = models.ForeignKey(VoteBalance, related_name='vote_casts', on_delete=models.CASCADE)

    objects = VoteCastManager()
