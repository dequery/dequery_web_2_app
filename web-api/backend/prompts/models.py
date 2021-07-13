from django.db import models
from django.utils import timezone

from backend.users.models import User
from backend.transactions.constants import TRANSACTION_CATEGORY_CHOICES
from backend.prompts.constants import PROMPT_STATUS_CHOICES
from backend.transactions.models import DeqTransaction


class PromptManager(models.Manager):
    pass


class Prompt(models.Model):
    askers_cut = models.FloatField(default=0.0)
    content = models.JSONField()
    created = models.DateTimeField(auto_now_add=True)
    expiration_datetime = models.DateTimeField()
    hidden_code = models.CharField(blank=True, max_length=32, default='')
    title = models.CharField(max_length=210)
    user = models.ForeignKey(User, related_name='prompts', on_delete=models.CASCADE)
    status = models.CharField(max_length=64, choices=PROMPT_STATUS_CHOICES, default=PROMPT_STATUS_CHOICES.ACTIVE)

    objects = PromptManager()

    @classmethod
    def distribute_bounties(cls):
        cls.objects.filter(status=PROMPT_STATUS_CHOICES.ACTIVE, expiration_datetime__lte=timezone.now()).update(status=PROMPT_STATUS_CHOICES.CLOSING)
        prompts = cls.objects.filter(status=PROMPT_STATUS_CHOICES.CLOSING)
        for prompt in prompts:
            prompt.distribute()

    @property
    def askers_bounty(self):
        bounty = 0
        added_transactions = DeqTransaction.objects.filter(
            category__in=[TRANSACTION_CATEGORY_CHOICES.INCREASE_PROMPT_BOUNTY],
            extra_info__prompt=self.pk)
        for deq_transaction in added_transactions:
            if not deq_transaction.user.pk == self.user.pk:
                bounty += deq_transaction.amount
        return float(bounty) * self.askers_cut

    @property
    def bounty(self):
        bounty = 0
        deq_transactions = DeqTransaction.objects.filter(
            category__in=[TRANSACTION_CATEGORY_CHOICES.TO_PROMPT_BOUNTY, TRANSACTION_CATEGORY_CHOICES.INCREASE_PROMPT_BOUNTY],
            extra_info__prompt=self.pk)
        for deq_transaction in deq_transactions:
            bounty += deq_transaction.amount
        return bounty

    def distribute(self):
        self.refresh_from_db()
        if self.status != PROMPT_STATUS_CHOICES.CLOSING:
            return self

        answers = self.answers.all()
        answer_count = len(answers)
        answer_vote_total = 0
        for answer in answers:
            answer_vote_total += answer.votes
        if answer_count == 0:
            bounty_transactions = DeqTransaction.objects.filter(
                category__in=[TRANSACTION_CATEGORY_CHOICES.TO_PROMPT_BOUNTY, TRANSACTION_CATEGORY_CHOICES.INCREASE_PROMPT_BOUNTY],
                extra_info__prompt=self.pk)

            # refund bounties
            for bounty_transaction in bounty_transactions:
                deq_transaction = DeqTransaction.objects.create(
                    amount=bounty_transaction.amount,
                    category=TRANSACTION_CATEGORY_CHOICES.FROM_EXPIRED_PROMPT,
                    user=bounty_transaction.user,
                    extra_info={'prompt': self.pk}
                )
                deq_transaction.save()
        elif answer_vote_total == 0:
            # evenly distribute among answers minus askers cut
            askers_bounty = self.askers_bounty
            if askers_bounty > 0:
                deq_transaction = DeqTransaction.objects.create(
                    amount=askers_bounty,
                    category=TRANSACTION_CATEGORY_CHOICES.FROM_ASKERS_CUT,
                    user=self.user,
                    extra_info={'prompt': self.pk}
                    )
                deq_transaction.save()
            answerers_bounty = float(self.bounty) - askers_bounty
            answerers_deq_payment = round(answerers_bounty / answer_count, 18)
            for answer in answers:
                deq_transaction = DeqTransaction.objects.create(
                    amount=answerers_deq_payment,
                    category=TRANSACTION_CATEGORY_CHOICES.FROM_ANSWER,
                    user=answer.user,
                    extra_info={'answer': answer.pk}
                    )
                deq_transaction.save()
        else:
            askers_bounty = self.askers_bounty
            if askers_bounty > 0:
                deq_transaction = DeqTransaction.objects.create(
                    amount=askers_bounty,
                    category=TRANSACTION_CATEGORY_CHOICES.FROM_ASKERS_CUT,
                    user=self.user,
                    extra_info={'prompt': self.pk}
                    )
                deq_transaction.save()
            answerers_bounty = float(self.bounty) - askers_bounty
            for answer in answers:
                deq_payment = round((answer.votes / answer_vote_total) * float(answerers_bounty), 18)
                deq_transaction = DeqTransaction.objects.create(
                    amount=deq_payment,
                    category=TRANSACTION_CATEGORY_CHOICES.FROM_ANSWER,
                    user=answer.user,
                    extra_info={'answer': answer.pk}
                    )
                deq_transaction.save()
        self.status = PROMPT_STATUS_CHOICES.CLOSED
        self.save(update_fields=['status'])
        return self


class PromptWatchManager(models.Manager):
    pass


class PromptWatch(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, related_name='watching', on_delete=models.PROTECT)
    prompt = models.ForeignKey(Prompt, related_name='watchers', on_delete=models.PROTECT)
