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

    def _api_refresh_token(self, refresh_token):
        response = client.post('/api/token/refresh/', {
            'refresh': refresh_token,
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
    
    def _api_update(self, user, update_data):
        body = update_data
        client.force_authenticate(user=user)
        response = client.patch(f'/api/users/update/{user.pk}/', body, format='json')
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

        # it fails if password is too short
        display_name_2 = 'user2'
        email_2 = 'user2@hotmail.com'
        short_password = '12a'
        response = self._api_signup(display_name_2, email_2, short_password, signup_code=signup_code)
        self.assertEqual(400, response.status_code)
        self.assertEqual('Password must be at least 6 characters', response.json()['password'][0])

        # it works for a second user
        valid_password = '123456'
        response = self._api_signup(display_name_2, email_2, valid_password, signup_code=signup_code)
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

        # it works without signup code
        display_name_4 = 'user4'
        email_4 = 'user4@hotmail.com'
        response = self._api_signup(display_name_4, email_4, 'testpass123')
        self.assertEqual(201, response.status_code)
        user = User.objects.get(pk=response.json()['pk'])
        self.assertEqual(display_name_4, user.display_name)
        self.assertEqual(email_4, user.email)

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

        # refresh token works
        refresh_token = response.json()['refresh']
        response = self._api_refresh_token(refresh_token)
        self.assertEqual(200, response.status_code)
    
    def test_update(self):
        response = self._api_signup('witcher', 'witcher@wolf.com', 'testpass123')
        self.assertEqual(201, response.status_code)
        user = User.objects.get(pk=response.json()['pk'])

        # it updates display_name
        new_display_name = 'mutated'
        response = self._api_update(user, {'display_name': new_display_name})
        self.assertEqual(200, response.status_code)
        self.assertEqual(new_display_name, response.json()['display_name'])

        # it updates web_link
        new_web_link = 'https://dequery.org/'
        response = self._api_update(user, {'web_link': new_web_link})
        self.assertEqual(200, response.status_code)
        self.assertEqual(new_web_link, response.json()['web_link'])

        # it fails if web_link is invalid
        new_web_link = 'baloney'
        response = self._api_update(user, {'web_link': new_web_link})
        self.assertEqual(400, response.status_code)
        self.assertEqual('Enter a valid URL.', response.json()['web_link'][0])

        # it updates eth_address
        new_eth_address = '0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7'
        response = self._api_update(user, {'eth_address': new_eth_address})
        self.assertEqual(200, response.status_code)
        self.assertEqual(new_eth_address, response.json()['eth_address'])

        # it fails if eth_address is invalid
        new_eth_address = '123'
        response = self._api_update(user, {'eth_address': new_eth_address})
        self.assertEqual(400, response.status_code)
        self.assertEqual('A valid eth address was not provided', response.json()['eth_address'][0])

        # it updates email
        new_email = 'mutated@eth.org'
        response = self._api_update(user, {'email': new_email})
        self.assertEqual(200, response.status_code)
        self.assertEqual(new_email, response.json()['email'])

        # it fails if email is invalid
        new_email = '123'
        response = self._api_update(user, {'email': new_email})
        self.assertEqual(400, response.status_code)
        self.assertEqual('Enter a valid email address.', response.json()['email'][0])

        # it doesn't change read only pk
        new_pk = '42'
        response = self._api_update(user, {'pk': new_pk})
        self.assertEqual(200, response.status_code)
        self.assertEqual(user.pk, response.json()['pk'])

        # it doesn't change read only deq_balance
        new_deq_balance = '420'
        response = self._api_update(user, {'deq_balance': new_deq_balance})
        self.assertEqual(200, response.status_code)
        self.assertEqual(user.deq_balance, response.json()['deq_balance'])
