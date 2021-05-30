from decimal import *

from django.test import TestCase
from rest_framework.test import APIClient

from backend.users.factories import UserFactory, AlphaCodeFactory
from backend.users.models import User


client = APIClient()


class DeqTransactionTests(TestCase):
    def setUp(self):
        self.user = UserFactory()

    def _api_login(self, display_name, password):
        response = client.post('/api/token/', {
            'display_name': display_name,
            'password': password,
        }, format='json')
        return response

    def _api_signup(self, alpha_passcode, display_name, email, password):
        response = client.post('/api/users/create/', {
            'alpha_passcode': alpha_passcode,
            'display_name': display_name,
            'email': email,
            'password': password,
        }, format='json')
        return response

    def test_signup(self):
        # it fails if passcode does not exists
        response = self._api_signup('tisrandom', 'user1', 'user1@hotmail.com', 'testpass123')
        self.assertEqual(400, response.status_code)
        self.assertEqual('Not a valid passcode', response.json()['non_field_errors'][0])

        # it works with valid passcode
        alpha_passcode = 'letmein123'
        display_name_1 = 'user1'
        email_1 = 'user1@hotmail.com'
        endowment = 33
        AlphaCodeFactory(code=alpha_passcode, use_count=2, endowment=endowment)
        response = self._api_signup(alpha_passcode, display_name_1, email_1, 'testpass123')
        self.assertEqual(201, response.status_code)
        user = User.objects.get(pk=response.json()['pk'])
        self.assertEqual(display_name_1, user.display_name)
        self.assertEqual(email_1, user.email)
        self.assertEqual(endowment, user.deq_balance)

        # it works for a second user
        display_name_2 = 'user2'
        email_2 = 'user2@hotmail.com'
        response = self._api_signup(alpha_passcode, display_name_2, email_2, 'testpass123')
        self.assertEqual(201, response.status_code)
        user = User.objects.get(pk=response.json()['pk'])
        self.assertEqual(display_name_2, user.display_name)
        self.assertEqual(email_2, user.email)
        self.assertEqual(endowment, user.deq_balance)

        # it fails for third user when used count is too high
        display_name_3 = 'user3'
        email_3 = 'user3@hotmail.com'
        response = self._api_signup(alpha_passcode, display_name_3, email_3, 'testpass123')
        self.assertEqual(400, response.status_code)
        self.assertEqual('Passcode already used', response.json()['non_field_errors'][0])

    def test_login(self):
        alpha_passcode='openpls'
        display_name = 'vitalik'
        email = 'vitalik@eth.org'
        password = 'testpass321'
        AlphaCodeFactory(code=alpha_passcode)
        response = self._api_signup(alpha_passcode, display_name, email, password)
        self.assertEqual(201, response.status_code)

        response = self._api_login(display_name, password)
        self.assertEqual(200, response.status_code)
        self.assertTrue(response.json()['refresh'])
        self.assertTrue(response.json()['access'])
