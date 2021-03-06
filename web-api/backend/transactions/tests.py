import datetime
from decimal import *

from django.test import TestCase

from backend.users.factories import UserFactory
from backend.test_client import TestClient
from backend.transactions.factories import DeqTransactionFactory, TEST_ETH_ADDRESS
from backend.transactions.models import DeqTransaction
from backend.transactions.constants import ETH_GAS_FEE, TRANSACTION_CATEGORY_CHOICES, TRANSACTION_STATUS_CHOICES, SPENDING_CATEGORIES, RECEIVING_CATEGORIES


client = TestClient()


class DeqTransactionTests(TestCase):
    def setUp(self):
        self.user = UserFactory()

    def test_no_undefined_categories(self):
        self.assertEqual(len(TRANSACTION_CATEGORY_CHOICES), len(SPENDING_CATEGORIES) + len(RECEIVING_CATEGORIES))

    def test_transaction_valid_category_create(self):
        response = client.api_create_transaction(100, TRANSACTION_CATEGORY_CHOICES.FROM_SOURCE, {}, self.user)
        self.assertEqual(400, response.status_code)
        self.assertEqual('Not a valid transaction category', response.json()['category'][0])

    def test_create_to_eth_transaction(self):
        user = UserFactory(display_name='cashout_eth', email='cashout_eth@eth.org')

        # it fails if eth_address is missing
        response = client.api_create_transaction(200, TRANSACTION_CATEGORY_CHOICES.TO_ETH, {}, user)
        self.assertEqual(400, response.status_code)
        self.assertEqual('A valid eth address was not provided', response.json()['non_field_errors'][0])

        # it fails if eth_address is not valid
        response = client.api_create_transaction(200, TRANSACTION_CATEGORY_CHOICES.TO_ETH, {'eth_address': '1234'}, user)
        self.assertEqual(400, response.status_code)
        self.assertEqual('A valid eth address was not provided', response.json()['non_field_errors'][0])

        # it fails if user does not have enough DEQ
        response = client.api_create_transaction(200, TRANSACTION_CATEGORY_CHOICES.TO_ETH, {'ethereum_address': TEST_ETH_ADDRESS}, user)
        self.assertEqual(400, response.status_code)
        self.assertEqual('Not enough DEQ to make transaction', response.json()['non_field_errors'][0])

        # it fails if user can not cover gas fee
        DeqTransactionFactory(amount=200, user=user)
        response = client.api_create_transaction(200, TRANSACTION_CATEGORY_CHOICES.TO_ETH, {'ethereum_address': TEST_ETH_ADDRESS}, user)
        self.assertEqual(400, response.status_code)
        self.assertEqual('Not enough DEQ to make transaction', response.json()['non_field_errors'][0])

        # it works when user has enough DEQ and a valid ETH adress
        gas_amount = DeqTransaction.eth_to_deq(ETH_GAS_FEE)
        DeqTransactionFactory(amount=gas_amount * 2, user=user)
        response = client.api_create_transaction(200, TRANSACTION_CATEGORY_CHOICES.TO_ETH, {'ethereum_address': TEST_ETH_ADDRESS}, user)
        self.assertEqual(201, response.status_code)
        self.assertAlmostEqual(gas_amount, float(user.deq_balance), 8)
        self.assertEqual(TRANSACTION_STATUS_CHOICES.PROCCESSING, response.json()['status'])

    def test_create_to_dai_transaction(self):
        user = UserFactory(display_name='cashout_dai', email='cashout_dai@paperhands.com')

        # it fails if eth_address is missing
        response = client.api_create_transaction(200, TRANSACTION_CATEGORY_CHOICES.TO_DAI, {}, user)
        self.assertEqual(400, response.status_code)
        self.assertEqual('A valid eth address was not provided', response.json()['non_field_errors'][0])

        # it fails if eth_address is not valid
        response = client.api_create_transaction(200, TRANSACTION_CATEGORY_CHOICES.TO_DAI, {'eth_address': '1234'}, user)
        self.assertEqual(400, response.status_code)
        self.assertEqual('A valid eth address was not provided', response.json()['non_field_errors'][0])

        # it fails if user does not have enough DEQ
        response = client.api_create_transaction(200, TRANSACTION_CATEGORY_CHOICES.TO_DAI, {'ethereum_address': TEST_ETH_ADDRESS}, user)
        self.assertEqual(400, response.status_code)
        self.assertEqual('Not enough DEQ to make transaction', response.json()['non_field_errors'][0])

        # it works when user has enough DEQ and a valid ETH adress
        DeqTransactionFactory(amount=200, user=user)
        response = client.api_create_transaction(200, TRANSACTION_CATEGORY_CHOICES.TO_DAI, {'ethereum_address': TEST_ETH_ADDRESS}, user)
        self.assertEqual(201, response.status_code)
        self.assertEqual(float(user.deq_balance), 0)
        self.assertEqual(TRANSACTION_STATUS_CHOICES.PROCCESSING, response.json()['status'])

    def test_create_to_dai_transaction(self):
        user = UserFactory(display_name='cashout_usd', email='cashout_usd@paperhands.com')

        # it fails if email_address is missing
        response = client.api_create_transaction(200, TRANSACTION_CATEGORY_CHOICES.TO_USD, {}, user)
        self.assertEqual(400, response.status_code)
        self.assertEqual('A valid email was not provided', response.json()['non_field_errors'][0])

        # it fails if email_address is not valid
        response = client.api_create_transaction(200, TRANSACTION_CATEGORY_CHOICES.TO_USD, {'paypal_email': '1234'}, user)
        self.assertEqual(400, response.status_code)
        self.assertEqual('A valid email was not provided', response.json()['non_field_errors'][0])

        # it fails if user does not have enough DEQ
        response = client.api_create_transaction(200, TRANSACTION_CATEGORY_CHOICES.TO_USD, {'paypal_email': 'paypal@mafia.com'}, user)
        self.assertEqual(400, response.status_code)
        self.assertEqual('Not enough DEQ to make transaction', response.json()['non_field_errors'][0])

        # it works when user has enough DEQ and a valid ETH adress
        DeqTransactionFactory(amount=200, user=user)
        response = client.api_create_transaction(200, TRANSACTION_CATEGORY_CHOICES.TO_USD, {'paypal_email': 'paypal@mafia.com'}, user)
        self.assertEqual(201, response.status_code)
        self.assertEqual(float(user.deq_balance), 0)
        self.assertEqual(TRANSACTION_STATUS_CHOICES.PROCCESSING, response.json()['status'])
