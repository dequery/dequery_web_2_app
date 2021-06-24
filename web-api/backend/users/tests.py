from decimal import *

from django.test import TestCase
from rest_framework.test import APIClient

from backend.users.factories import UserFactory, SignupCodeFactory
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

    def _api_signup(self, display_name, email, password, signup_code=None):
        body = {
            'display_name': display_name,
            'email': email,
            'password': password,
        }
        if signup_code:
            body['signup_code'] = signup_code
        response = client.post('/api/users/create/', body, format='json')
        return response

    def test_signup(self):
        # it works with valid signup code
        signup_code = 'letmein123'
        display_name_1 = 'user1'
        email_1 = 'user1@hotmail.com'
        endowment = 33
        SignupCodeFactory(code=signup_code, use_count=2, endowment=endowment)
        response = self._api_signup(display_name_1, email_1, 'testpass123', signup_code=signup_code)
        self.assertEqual(201, response.status_code)
        user = User.objects.get(pk=response.json()['pk'])
        self.assertEqual(display_name_1, user.display_name)
        self.assertEqual(email_1, user.email)
        self.assertEqual(endowment, user.deq_balance)

        # it works for a second user
        display_name_2 = 'user2'
        email_2 = 'user2@hotmail.com'
        response = self._api_signup(display_name_2, email_2, 'testpass123', signup_code=signup_code)
        self.assertEqual(201, response.status_code)
        user = User.objects.get(pk=response.json()['pk'])
        self.assertEqual(display_name_2, user.display_name)
        self.assertEqual(email_2, user.email)
        self.assertEqual(endowment, user.deq_balance)

        # it fails for third user when used count is too high
        display_name_3 = 'user3'
        email_3 = 'user3@hotmail.com'
        response = self._api_signup(display_name_3, email_3, 'testpass123', signup_code=signup_code)
        self.assertEqual(400, response.status_code)
        self.assertEqual('Code already used', response.json()['non_field_errors'][0])

        # it fails with invalid signup code
        display_name_3 = 'user3'
        email_3 = 'user3@hotmail.com'
        response = self._api_signup(display_name_3, email_3, 'testpass123', signup_code='invalid_code')
        self.assertEqual(400, response.status_code)
        self.assertEqual('Not a valid code', response.json()['non_field_errors'][0])

    def test_login(self):
        display_name = 'vitalik'
        email = 'vitalik@eth.org'
        password = 'testpass321'
        response = self._api_signup(display_name, email, password)
        self.assertEqual(201, response.status_code)

        response = self._api_login(display_name, password)
        self.assertEqual(200, response.status_code)
        self.assertTrue(response.json()['refresh'])
        self.assertTrue(response.json()['access'])
