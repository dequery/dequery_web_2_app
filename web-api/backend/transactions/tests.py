import datetime
from decimal import *

from django.test import TestCase
from rest_framework.test import APIClient

from backend.users.factories import UserFactory
from backend.transactions.factories import DeqTransactionFactory, TEST_ETH_ADDRESS
from backend.transactions.models import DeqTransaction
from backend.transactions.constants import ETH_GAS_FEE, TRANSACTION_CATEGORY_CHOICES, SPENDING_CATEGORIES, RECEIVING_CATEGORIES

client = APIClient()


class DeqTransactionTests(TestCase):
    def setUp(self):
        self.user = UserFactory()

    def _api_create_transaction(self, amount, category, extra_info, user):
        client.force_authenticate(user=user)
        response = client.post('/api/transactions/create/', {
            'amount': amount,
            'category': category,
            'extra_info': extra_info,
            'user': user.pk,
        }, format='json')
        return response

    def test_no_undefined_categories(self):
        self.assertEqual(len(TRANSACTION_CATEGORY_CHOICES), len(SPENDING_CATEGORIES) + len(RECEIVING_CATEGORIES))

    def test_transaction_valid_category_create(self):
        response = self._api_create_transaction(100, TRANSACTION_CATEGORY_CHOICES.FROM_SOURCE, {}, self.user)
        self.assertEqual(400, response.status_code)
        self.assertEqual('Not a valid transaction category', response.json()['category'][0])

    def test_create_to_eth_transaction(self):
        user = UserFactory(display_name='cashout_cow', email='cashout_cow@paperhands.com')

        # it fails if eth_address is missing
        response = self._api_create_transaction(200, TRANSACTION_CATEGORY_CHOICES.TO_ETH, {}, user)
        self.assertEqual(400, response.status_code)
        self.assertEqual('A valid eth address was not provided', response.json()['non_field_errors'][0])

        # it fails if eth_address is not valid
        response = self._api_create_transaction(200, TRANSACTION_CATEGORY_CHOICES.TO_ETH, {'eth_address': '1234'}, user)
        self.assertEqual(400, response.status_code)
        self.assertEqual('A valid eth address was not provided', response.json()['non_field_errors'][0])

        # it fails if user does not have enough DEQ
        response = self._api_create_transaction(200, TRANSACTION_CATEGORY_CHOICES.TO_ETH, {'eth_address': TEST_ETH_ADDRESS}, user)
        self.assertEqual(400, response.status_code)
        self.assertEqual('Not enough DEQ to make transaction', response.json()['non_field_errors'][0])

        # it fails if user can not cover gas fee
        DeqTransactionFactory(amount=200, user=user)
        response = self._api_create_transaction(200, TRANSACTION_CATEGORY_CHOICES.TO_ETH, {'eth_address': TEST_ETH_ADDRESS}, user)
        self.assertEqual(400, response.status_code)
        self.assertEqual('Not enough DEQ to make transaction', response.json()['non_field_errors'][0])

        # it works when user has enough DEQ and a valid ETH adress
        gas_amount = DeqTransaction.eth_to_deq(ETH_GAS_FEE)
        DeqTransactionFactory(amount=gas_amount * 2, user=user)
        response = self._api_create_transaction(200, TRANSACTION_CATEGORY_CHOICES.TO_ETH, {'eth_address': TEST_ETH_ADDRESS}, user)
        self.assertEqual(201, response.status_code)
        self.assertAlmostEqual(gas_amount, float(user.deq_balance), 8)
