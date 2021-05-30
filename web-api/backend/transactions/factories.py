import factory

from backend.transactions.models import DeqTransaction
from backend.transactions.constants import TRANSACTION_CATEGORY_CHOICES


TEST_ETH_ADDRESS = '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B'


class DeqTransactionFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = DeqTransaction

    amount = 100
    category = TRANSACTION_CATEGORY_CHOICES.FROM_SOURCE
    user = 0
