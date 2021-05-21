import datetime
import pdb

from django.utils.timezone import make_aware

from django.test import TestCase
from rest_framework.test import APIClient

from backend.users.factories import UserFactory
from backend.prompts.factories import PromptFactory, TEST_CONTENT
from backend.prompts.models import Prompt
from backend.transactions.factories import DeqTransactionFactory
# from backend.votes.factories import VoteBalanceFactory
from backend.transactions.constants import TRANSACTION_CATEGORY_CHOICES


client = APIClient()


class PromptTests(TestCase):
    def setUp(self):
        self.user = UserFactory()
        self.prompt = PromptFactory(user=self.user)

    def _api_create_answer(self, user, prompt_pk):
        client.force_authenticate(user=user)
        response = client.post('/api/answers/create/', {
            'content': TEST_CONTENT,
            'user': user.pk,
            'prompt': prompt_pk,
        }, format='json')
        return response

    def _api_create_prompt(self, user, bounty):
        client.force_authenticate(user=user)
        response = client.post('/api/prompts/create/', {
            'bounty': bounty,
            'content': TEST_CONTENT,
            'expiration_datetime': (datetime.date.today() + datetime.timedelta(days=1)).strftime("%Y-%m-%d %H:%M:%S"),
            'title': 'test',
            'user': user.pk,
        }, format='json')
        return response

    def _api_create_vote_cast(self, user, amount, answer_pk, prompt_pk):
        client.force_authenticate(user=user)
        vote_balance = user.vote_balances.filter(prompt=prompt_pk).first()
        response = client.post('/api/vote-casts/create/', {
            'amount': amount,
            'answer': answer_pk,
            'vote_balance': vote_balance.pk,
        }, format='json')
        return response

    def _create_prompt_scenario(self, user, bounty, create_answers_data):
        DeqTransactionFactory(user=user, amount=bounty)
        response = self._api_create_prompt(self.user, bounty)
        self.assertEqual(201, response.status_code)
        prompt_pk = response.data['pk']
        for answer_data in create_answers_data:
            response = self._api_create_answer(answer_data['user'], prompt_pk)
            self.assertEqual(201, response.status_code)
            answer_pk = response.data['pk']
            if answer_data['votes'] > 0:
                response = self._api_create_vote_cast(user, answer_data['votes'], answer_pk, prompt_pk)
                self.assertEqual(201, response.status_code)
        return Prompt.objects.get(pk=prompt_pk)

    def test_user_matches(self):
        self.assertEqual(self.user.pk, self.prompt.user.pk)

    def test_distribute(self):
        # test case with 0 answers refunds user
        bounty = 100
        prompt = self._create_prompt_scenario(self.user, bounty, [])
        starting_deq_balance = self.user.deq_balance
        prompt.distribute()
        self.assertEqual(starting_deq_balance + bounty, self.user.deq_balance)

        # test case with 1 answer and 0 votes pays answer maker
        bounty = 100
        user1 = UserFactory(display_name='user1', email='user1@eth.net')
        create_answers_data = [{'user': user1, 'votes': 0}]
        prompt = self._create_prompt_scenario(self.user, bounty, create_answers_data)
        starting_deq_balance = self.user.deq_balance
        prompt.distribute()
        self.assertEqual(starting_deq_balance, self.user.deq_balance)
        self.assertEqual(user1.deq_balance, bounty)

        # test case with 2 answers and 0 votes splits bounty
        bounty = 100
        user2 = UserFactory(display_name='user2', email='user2@eth.net')
        user3 = UserFactory(display_name='user3', email='user3@eth.net')
        create_answers_data = [{'user': user2, 'votes': 0}, {'user': user3, 'votes': 0}]
        prompt = self._create_prompt_scenario(self.user, bounty, create_answers_data)
        starting_deq_balance = self.user.deq_balance
        prompt.distribute()
        self.assertEqual(starting_deq_balance, self.user.deq_balance)
        self.assertEqual(50, user2.deq_balance)
        self.assertEqual(50, user3.deq_balance)

        # test case with 3 answers and votes splits bounty with weights
        bounty = 1000
        user4 = UserFactory(display_name='user4', email='user4@eth.net')
        user5 = UserFactory(display_name='user5', email='user5@eth.net')
        user6 = UserFactory(display_name='user6', email='user6@eth.net')
        create_answers_data = [{'user': user4, 'votes': 600}, {'user': user5, 'votes': 400}, {'user': user6, 'votes': 0}]
        prompt = self._create_prompt_scenario(self.user, bounty, create_answers_data)
        starting_deq_balance = self.user.deq_balance
        prompt.distribute()
        self.assertEqual(starting_deq_balance, self.user.deq_balance)
        self.assertEqual(600, user4.deq_balance)
        self.assertEqual(400, user5.deq_balance)
        self.assertEqual(0, user6.deq_balance)

    def test_req_fact(self):
        client.force_authenticate(user=self.user)
        DeqTransactionFactory(user=self.user, amount=100)
        response = client.post('/api/prompts/create/', {
            'bounty': 50,
            'content': TEST_CONTENT,
            'expiration_datetime': (datetime.date.today() + datetime.timedelta(days=1)).strftime("%Y-%m-%d %H:%M:%S"),
            'title': 'test',
            'user': self.user.pk,
        }, format='json')
        self.assertEqual(201, response.status_code)
