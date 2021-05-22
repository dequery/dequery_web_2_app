from django.db import models
from django.utils import timezone

from backend.users.models import User
from backend.transactions.constants import TRANSACTION_CATEGORY_CHOICES
from backend.prompts.constants import PROMPT_STATUS_CHOICES
from backend.transactions.models import DeqTransaction


class PromptManager(models.Manager):
    pass


class Prompt(models.Model):
    content = models.JSONField()
    created = models.DateTimeField(auto_now_add=True)
    expiration_datetime = models.DateTimeField()
    title = models.CharField(max_length=60)
    user = models.ForeignKey(User, related_name='prompts', on_delete=models.CASCADE)
    status = models.CharField(max_length=64, choices=PROMPT_STATUS_CHOICES, default=PROMPT_STATUS_CHOICES.ACTIVE)

    objects = PromptManager()

    @classmethod
    def distribute_bounties(cls):
        cls.objects.filter(status=PROMPT_STATUS_CHOICES.ACTIVE, expiration_datetime__lte=timezone.now()).update(status=PROMPT_STATUS_CHOICES.CLOSING)
        prompts = cls.objects.filter(status=PROMPT_STATUS_CHOICES.CLOSING)
        for prompt in prompts:
            prompt.distribute()
            prompt.status = PROMPT_STATUS_CHOICES.CLOSED
            prompt.save(update_fields=['status'])

    @property
    def bounty(self):
        bounty = 0
        deq_transactions = DeqTransaction.objects.filter(
            category=TRANSACTION_CATEGORY_CHOICES.TO_PROMPT_BOUNTY,
            other_pk=self.pk)
        for deq_transaction in deq_transactions:
            bounty += deq_transaction.amount
        return bounty

    def distribute(self):
        self.status = PROMPT_STATUS_CHOICES.CLOSING
        self.save(update_fields=['status'])

        answers = self.answers.all()
        answer_count = len(answers)
        answer_vote_total = 0
        for answer in answers:
            answer_vote_total += answer.votes
        if answer_count == 0:
            # refund prompt creator
            deq_transaction = DeqTransaction.objects.create(
                amount=self.bounty,
                category=TRANSACTION_CATEGORY_CHOICES.FROM_EXPIRED_PROMPT,
                user=self.user,
                other_pk=self.pk,
                )
            deq_transaction.save()
        elif answer_vote_total == 0:
            # evenly distribute among answers
            deq_payment = round(self.bounty / answer_count, 18)
            for answer in answers:
                deq_transaction = DeqTransaction.objects.create(
                    amount=deq_payment,
                    category=TRANSACTION_CATEGORY_CHOICES.FROM_ANSWER,
                    user=answer.user,
                    other_pk=answer.pk,
                    )
                deq_transaction.save()
        else:
            for answer in answers:
                deq_payment = round((answer.votes / answer_vote_total) * float(self.bounty), 18)
                deq_transaction = DeqTransaction.objects.create(
                    amount=deq_payment,
                    category=TRANSACTION_CATEGORY_CHOICES.FROM_ANSWER,
                    user=answer.user,
                    other_pk=answer.pk,
                    )
                deq_transaction.save()
        self.status = PROMPT_STATUS_CHOICES.CLOSED
        self.save(update_fields=['status'])
        return self
