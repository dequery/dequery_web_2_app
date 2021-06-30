from django.db import models

from backend.users.models import User
from backend.transactions.constants import DEQ_TO_ETH_CONVERSION_RATIO, ETH_TO_DEQ_CONVERSION_RATIO, TRANSACTION_CATEGORY_CHOICES, TRANSACTION_STATUS_CHOICES


class DeqTransactionManager(models.Manager):
    pass


class DeqTransaction(models.Model):
    amount = models.DecimalField(default=0.000000000000000000, max_digits=29, decimal_places=18)
    created = models.DateTimeField(auto_now_add=True)
    category = models.CharField(max_length=64, choices=TRANSACTION_CATEGORY_CHOICES)
    extra_info = models.JSONField(default=dict)
    user = models.ForeignKey(User, related_name='deq_transactions', on_delete=models.PROTECT)
    status = models.CharField(max_length=64, choices=TRANSACTION_STATUS_CHOICES, default=TRANSACTION_STATUS_CHOICES.FULFILLED)

    objects = DeqTransactionManager()

    @classmethod
    def eth_to_deq(cls, eth_amount):
        return eth_amount * DEQ_TO_ETH_CONVERSION_RATIO

    @classmethod
    def deq_to_eth(cls, deq_amount):
        return deq_amount * ETH_TO_DEQ_CONVERSION_RATIO
