import factory

from backend.transactions.models import DeqTransaction
from backend.transactions.constants import TRANSACTION_CATEGORY_CHOICES


class DeqTransactionFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = DeqTransaction

    amount = 100
    category = TRANSACTION_CATEGORY_CHOICES.FROM_SOURCE
    user = 0
