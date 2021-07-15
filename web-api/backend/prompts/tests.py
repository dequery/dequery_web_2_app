import datetime
from decimal import *

from django.utils import timezone
from django.test import TestCase
from rest_framework.test import APIClient

from backend.test_client import TestClient
from backend.answers.models import Answer
from backend.prompts.constants import PROMPT_STATUS_CHOICES
from backend.prompts.factories import PromptFactory, TEST_CONTENT
from backend.prompts.models import Prompt, PromptWatch
from backend.transactions.constants import TRANSACTION_CATEGORY_CHOICES
from backend.transactions.factories import DeqTransactionFactory
from backend.transactions.models import DeqTransaction
from backend.users.factories import UserFactory
from backend.votes.models import VoteBalance


client = TestClient()


class PromptTests(TestCase):
    def setUp(self):
        self.user = UserFactory()
        self.prompt = PromptFactory(user=self.user)

    def _create_prompt_scenario(self, user, bounty, create_answers_data, askers_cut=None):
        DeqTransactionFactory(user=user, amount=bounty)
        response = client.api_create_prompt(self.user, bounty, askers_cut=askers_cut)
        self.assertEqual(201, response.status_code)
        prompt_pk = response.data['pk']
        answers = []
        for answer_data in create_answers_data:
            response = client.api_create_answer(answer_data['user'], prompt_pk)
            self.assertEqual(201, response.status_code)
            answer_pk = response.data['pk']
            answer = Answer.objects.get(pk=answer_pk)
            if answer_data['votes'] > 0:
                response = client.api_create_vote_cast(user, answer_data['votes'], answer_pk, prompt_pk)
                self.assertEqual(201, response.status_code)
            answers.append(answer)
        prompt = Prompt.objects.get(pk=prompt_pk)
        prompt.status = PROMPT_STATUS_CHOICES.CLOSING
        prompt.save(update_fields=['status'])
        return prompt, answers

    def test_user_matches(self):
        self.assertEqual(self.user.pk, self.prompt.user.pk)

    def test_distribute(self):
        # test case with 0 answers refunds user
        bounty = 100
        prompt, answers = self._create_prompt_scenario(self.user, bounty, [])
        starting_deq_balance = self.user.deq_balance
        prompt.distribute()
        self.assertEqual(starting_deq_balance + bounty, self.user.deq_balance)
        prompt.refresh_from_db()
        self.assertEqual(PROMPT_STATUS_CHOICES.CLOSED, prompt.status)

        # test case with 1 answer and 0 votes pays answer maker
        bounty = 100
        user1 = UserFactory(display_name='user1', email='user1@eth.net')
        create_answers_data = [{'user': user1, 'votes': 0}]
        prompt, answers = self._create_prompt_scenario(self.user, bounty, create_answers_data)
        starting_deq_balance = self.user.deq_balance
        prompt.distribute()
        self.assertEqual(starting_deq_balance, self.user.deq_balance)
        self.assertEqual(user1.deq_balance, bounty)
        prompt.refresh_from_db()
        self.assertEqual(PROMPT_STATUS_CHOICES.CLOSED, prompt.status)

        # test case with 2 answers and 0 votes splits bounty
        bounty = 100
        user2 = UserFactory(display_name='user2', email='user2@eth.net')
        user3 = UserFactory(display_name='user3', email='user3@eth.net')
        create_answers_data = [{'user': user2, 'votes': 0}, {'user': user3, 'votes': 0}]
        prompt, answers = self._create_prompt_scenario(self.user, bounty, create_answers_data)
        starting_deq_balance = self.user.deq_balance
        prompt.distribute()
        self.assertEqual(starting_deq_balance, self.user.deq_balance)
        self.assertEqual(50, user2.deq_balance)
        self.assertEqual(50, user3.deq_balance)
        prompt.refresh_from_db()
        self.assertEqual(PROMPT_STATUS_CHOICES.CLOSED, prompt.status)

        # test case with 3 answers and votes splits bounty with weights
        bounty = 1000
        user4 = UserFactory(display_name='user4', email='user4@eth.net')
        user5 = UserFactory(display_name='user5', email='user5@eth.net')
        user6 = UserFactory(display_name='user6', email='user6@eth.net')
        create_answers_data = [{'user': user4, 'votes': 600}, {'user': user5, 'votes': 400}, {'user': user6, 'votes': 0}]
        prompt, answers = self._create_prompt_scenario(self.user, bounty, create_answers_data)
        starting_deq_balance = self.user.deq_balance
        prompt.distribute()
        self.assertEqual(starting_deq_balance, self.user.deq_balance)
        self.assertEqual(600, user4.deq_balance)
        self.assertEqual(400, user5.deq_balance)
        self.assertEqual(0, user6.deq_balance)
        prompt.refresh_from_db()
        self.assertEqual(PROMPT_STATUS_CHOICES.CLOSED, prompt.status)

        # test case with 0 answers and bounty increase
        prompt, answers = self._create_prompt_scenario(self.user, bounty, [])
        starting_deq_balance = self.user.deq_balance
        increase_amount = 200
        user7 = UserFactory(display_name='user7', email='user7@eth.net')
        DeqTransactionFactory(user=user7, amount=increase_amount)
        response = client.api_create_deq_transaction(user7, increase_amount, TRANSACTION_CATEGORY_CHOICES.INCREASE_PROMPT_BOUNTY, { 'prompt': prompt.pk })
        self.assertEqual(201, response.status_code)
        prompt.distribute()
        self.assertEqual(starting_deq_balance + bounty, self.user.deq_balance)
        self.assertEqual(increase_amount, user7.deq_balance)
        prompt.refresh_from_db()
        self.assertEqual(PROMPT_STATUS_CHOICES.CLOSED, prompt.status)

        # test case with 2 answers and bounty increase
        bounty = 700
        user8 = UserFactory(display_name='user8', email='user8@eth.net')
        user9 = UserFactory(display_name='user9', email='user9@eth.net')
        create_answers_data = [{'user': user8, 'votes': 200}, {'user': user9, 'votes': 500}]
        prompt, answers = self._create_prompt_scenario(self.user, bounty, create_answers_data)
        starting_deq_balance = self.user.deq_balance
        user10 = UserFactory(display_name='user10', email='user10@eth.net')
        increase_amount = 300
        DeqTransactionFactory(user=user10, amount=increase_amount)
        response = client.api_create_deq_transaction(user10, increase_amount, TRANSACTION_CATEGORY_CHOICES.INCREASE_PROMPT_BOUNTY, { 'prompt': prompt.pk })
        self.assertEqual(increase_amount, float(user10.vote_balances.filter(prompt=prompt.pk).first().remaining_amount))
        self.assertEqual(201, response.status_code)
        response = client.api_create_vote_cast(user10, 200, answers[0].pk, prompt.pk)
        self.assertEqual(201, response.status_code)
        response = client.api_create_vote_cast(user10, 100, answers[1].pk, prompt.pk)
        self.assertEqual(201, response.status_code)
        self.assertEqual(0.0, float(user10.vote_balances.filter(prompt=prompt.pk).first().remaining_amount))
        prompt.distribute()
        self.assertEqual(starting_deq_balance, self.user.deq_balance)
        self.assertEqual(400, user8.deq_balance)
        self.assertEqual(600, user9.deq_balance)
        self.assertEqual(0, user10.deq_balance)
        prompt.refresh_from_db()
        self.assertEqual(PROMPT_STATUS_CHOICES.CLOSED, prompt.status)

        # test case with 2 answers, 2 bounty increase, and 10% asker's cut
        bounty = 700
        user11 = UserFactory(display_name='user11', email='user11@eth.net')
        user12 = UserFactory(display_name='user12', email='user12@eth.net')
        create_answers_data = [{'user': user11, 'votes': 200}, {'user': user12, 'votes': 500}]
        askers_cut = 0.10
        prompt, answers = self._create_prompt_scenario(self.user, bounty, create_answers_data, askers_cut=askers_cut)
        starting_deq_balance = self.user.deq_balance
        user13 = UserFactory(display_name='user13', email='user13@eth.net')
        increase_amount = 300
        DeqTransactionFactory(user=user13, amount=increase_amount)
        response = client.api_create_deq_transaction(user13, increase_amount, TRANSACTION_CATEGORY_CHOICES.INCREASE_PROMPT_BOUNTY, { 'prompt': prompt.pk })
        self.assertEqual(increase_amount, float(user13.vote_balances.filter(prompt=prompt.pk).first().remaining_amount))
        self.assertEqual(201, response.status_code)
        response = client.api_create_vote_cast(user13, 200, answers[0].pk, prompt.pk)
        self.assertEqual(201, response.status_code)
        response = client.api_create_vote_cast(user13, 100, answers[1].pk, prompt.pk)
        self.assertEqual(201, response.status_code)
        self.assertEqual(0.0, float(user13.vote_balances.filter(prompt=prompt.pk).first().remaining_amount))
        prompt.distribute()
        self.assertEqual(float(starting_deq_balance) + askers_cut * increase_amount, float(self.user.deq_balance))
        self.assertEqual(388, user11.deq_balance)
        self.assertEqual(582, user12.deq_balance)
        self.assertEqual(0, user13.deq_balance)
        prompt.refresh_from_db()
        self.assertEqual(PROMPT_STATUS_CHOICES.CLOSED, prompt.status)

    def test_distribute_bounties(self):
        user = UserFactory(display_name='pirate', email='pirate@bay.com')
        DeqTransactionFactory(user=user, amount=400)
        expired_time_1 = (timezone.now() + timezone.timedelta(days=-1)).strftime("%Y-%m-%d %H:%M:%S")
        prompt1_pk = client.api_create_prompt(user, 100, expiration_datetime=expired_time_1).data['pk']
        expired_time_2 = (timezone.now() + timezone.timedelta(minutes=-1)).strftime("%Y-%m-%d %H:%M:%S")
        prompt2_pk = client.api_create_prompt(user, 100, expiration_datetime=expired_time_2).data['pk']
        nonexpired_time_1 = (timezone.now() + timezone.timedelta(days=1)).strftime("%Y-%m-%d %H:%M:%S")
        prompt3_pk = client.api_create_prompt(user, 100, expiration_datetime=nonexpired_time_1).data['pk']
        nonexpired_time_2 = (timezone.now() + timezone.timedelta(minutes=1)).strftime("%Y-%m-%d %H:%M:%S")
        prompt4_pk = client.api_create_prompt(user, 100, expiration_datetime=nonexpired_time_2).data['pk']
        promt5_pk = PromptFactory(user=self.user, status='closing')
        Prompt.distribute_bounties()
        active_prompts = Prompt.objects.filter(status=PROMPT_STATUS_CHOICES.ACTIVE)
        expected_active_prompt_pks = [prompt3_pk, prompt4_pk]
        expected_closed_prompt_pks = [prompt1_pk, prompt2_pk, promt5_pk]
        for prompt in active_prompts:
            self.assertTrue(prompt.pk not in expected_closed_prompt_pks)
        closed_prompts = Prompt.objects.filter(status=PROMPT_STATUS_CHOICES.CLOSED)
        for prompt in closed_prompts:
            self.assertTrue(prompt.pk not in expected_active_prompt_pks)

    def test_prompt_create(self):
        # it failes if the user does not have enough DEQ
        user = UserFactory(display_name='maker', email='maker@maker.eth')
        response = client.api_create_prompt(user, 500)
        self.assertEqual(400, response.status_code)
        self.assertEqual('Not enough DEQ to pay for bounty', response.json()['non_field_errors'][0])

        # it works when user has enough bounty
        DeqTransactionFactory(user=user, amount=500)
        response = client.api_create_prompt(user, 500)
        self.assertEqual(201, response.status_code)
        resp_data = response.json()
        self.assertEqual(resp_data['bounty'], 500)
        prompt = Prompt.objects.get(pk=resp_data['pk'])
        self.assertEqual(Decimal('500.000000000000000000'), prompt.bounty)
        self.assertEqual(user.pk, prompt.user.pk)
        vote_balances = list(prompt.user.vote_balances.filter(prompt=prompt.pk))
        self.assertEqual(1, len(vote_balances))
        vote_balance = vote_balances[0]
        self.assertEqual(500, vote_balance.amount)
        self.assertEqual(user.pk, vote_balance.user.pk)
        self.assertEqual(0, self.user.deq_balance)
        deq_transactions = list(DeqTransaction.objects.filter(category=TRANSACTION_CATEGORY_CHOICES.TO_PROMPT_BOUNTY, user=user))
        self.assertEqual(1, len(deq_transactions))
        deq_transaction = deq_transactions[0]
        self.assertEqual(prompt.pk, deq_transaction.extra_info['prompt'])

        # it fails when askers cut is too high
        DeqTransactionFactory(user=user, amount=500)
        response = client.api_create_prompt(user, 500, askers_cut=1.1)
        self.assertEqual(400, response.status_code)
        self.assertEqual('Askers cut must be between 0 and 1', response.json()['askers_cut'][0])

    def test_add_answer_to_prompt(self):
        asker = UserFactory(display_name='asker', email='asker@oracle.eth')
        DeqTransactionFactory(user=asker, amount=500)
        response = client.api_create_prompt(asker, 500)
        self.assertEqual(201, response.status_code)
        resp_data = response.json()
        prompt = Prompt.objects.get(pk=resp_data['pk'])
        answerer = UserFactory(display_name='answerer', email='answerer@oracle.eth')
        response = client.api_create_answer(answerer, prompt.pk)
        self.assertEqual(201, response.status_code)
        answer = Answer.objects.get(pk=response.json()['pk'])
        answers = list(prompt.answers.all())
        self.assertEqual(1, len(answers))
        self.assertEqual(answer.pk, answers[0].pk)
        self.assertEqual(0, answer.votes)
        response = client.api_create_vote_cast(asker, 300, answer.pk, prompt.pk)
        self.assertEqual(201, response.status_code)
        answer.refresh_from_db()
        self.assertEqual(300, answer.votes)

    def test_increase_prompt_bounty(self):
        asker = UserFactory(display_name='og_asker', email='og_asker@oracle.eth')
        initial_bounty = 500
        DeqTransactionFactory(user=asker, amount=initial_bounty)
        response = client.api_create_prompt(asker, initial_bounty)
        self.assertEqual(201, response.status_code)
        resp_data = response.json()
        prompt = Prompt.objects.get(pk=resp_data['pk'])
        increaser = UserFactory(display_name='increaser', email='increaser@oracle.eth')

        # it fails if prompt does not exist
        amount = 200
        response = client.api_create_deq_transaction(increaser, amount, TRANSACTION_CATEGORY_CHOICES.INCREASE_PROMPT_BOUNTY, { 'prompt': 50000 })
        self.assertEqual(400, response.status_code)
        self.assertEqual('A valid prompt was not provided', response.json()['non_field_errors'][0])

        # it fails if increaser does not have enough DEQ
        response = client.api_create_deq_transaction(increaser, amount, TRANSACTION_CATEGORY_CHOICES.INCREASE_PROMPT_BOUNTY, { 'prompt': prompt.pk })
        self.assertEqual(400, response.status_code)
        self.assertEqual('Not enough DEQ to make transaction', response.json()['non_field_errors'][0])

        # it succeeds with valid prompt, DEQ balance, and vote valance 
        DeqTransactionFactory(user=increaser, amount=200)
        response = client.api_create_deq_transaction(increaser, amount, TRANSACTION_CATEGORY_CHOICES.INCREASE_PROMPT_BOUNTY, { 'prompt': prompt.pk })
        self.assertEqual(201, response.status_code)
        self.assertEqual(float(prompt.bounty), float(initial_bounty + amount))
        self.assertEqual(0.0, increaser.deq_balance)
        self.assertEqual(200, float(increaser.vote_balances.filter(prompt=prompt.pk).first().amount))

        # multiple iterations increase the same vote balance
        increaser2 = UserFactory(display_name='increaser2', email='increaser2@oracle.eth')
        DeqTransactionFactory(user=increaser2, amount=500)
        response = client.api_create_deq_transaction(increaser2, 200, TRANSACTION_CATEGORY_CHOICES.INCREASE_PROMPT_BOUNTY, { 'prompt': prompt.pk })
        self.assertEqual(201, response.status_code)
        vote_balance = VoteBalance.objects.filter(user=increaser2, prompt=prompt.pk).first()
        self.assertEqual(200, vote_balance.amount)
        response = client.api_create_deq_transaction(increaser2, 300, TRANSACTION_CATEGORY_CHOICES.INCREASE_PROMPT_BOUNTY, { 'prompt': prompt.pk })
        self.assertEqual(201, response.status_code)
        vote_balance.refresh_from_db()
        self.assertEqual(500, vote_balance.amount)

    def test_retrieve_prompts(self):
        amount = 300
        DeqTransactionFactory(user=self.user, amount=amount)
        response = client.api_create_prompt(self.user, amount)
        self.assertEqual(201, response.status_code)
        DeqTransactionFactory(user=self.user, amount=amount)
        hidden_code = 'Caesar'
        response = client.api_create_prompt(self.user, amount, hidden_code=hidden_code)
        self.assertEqual(201, response.status_code)

        # it retrieves prompts without hidden code by default
        response = client.api_retrieve_prompts()
        self.assertEqual(200, response.status_code)
        self.assertGreaterEqual(len(response.json()['results']), 1)
        for prompt in response.json()['results']:
            self.assertTrue('' == prompt['hidden_code'])

        # it only retrieves prompt with hidden code when provided
        response = client.api_retrieve_prompts(hidden_code=hidden_code)
        self.assertEqual(200, response.status_code)
        self.assertEqual(1, len(response.json()['results']))
        for prompt in response.json()['results']:
            self.assertTrue(hidden_code, prompt['hidden_code'])

        # it retrieves all prompts with matching hidden code
        DeqTransactionFactory(user=self.user, amount=amount)
        response = client.api_create_prompt(self.user, amount, hidden_code=hidden_code)
        response = client.api_retrieve_prompts(hidden_code=hidden_code)
        self.assertEqual(200, response.status_code)
        self.assertEqual(2, len(response.json()['results']))
        for prompt in response.json()['results']:
            self.assertTrue(hidden_code, prompt['hidden_code'])

        # it doesn't retrieve prompts with a non-matching hidden code
        DeqTransactionFactory(user=self.user, amount=amount)
        hidden_code_2 = 'Shugborough'
        response = client.api_create_prompt(self.user, amount, hidden_code=hidden_code_2)
        response = client.api_retrieve_prompts(hidden_code=hidden_code)
        self.assertEqual(200, response.status_code)
        self.assertEqual(2, len(response.json()['results']))
        for prompt in response.json()['results']:
            self.assertTrue(hidden_code, prompt['hidden_code'])

    def test_prompt_watch(self):
        # it adds prompt creator as a watcher
        user = UserFactory(display_name='joer_mormont', email='joer_mormont@nightswatch.wall')
        DeqTransactionFactory(user=user, amount=300)
        response = client.api_create_prompt(user, 200)
        self.assertEqual(response.status_code, 201)
        prompt = Prompt.objects.get(pk=response.json()['pk'])
        self.assertEqual(len(prompt.watchers.all()), 1)
        self.assertEqual(prompt.watchers.all()[0].user.display_name, user.display_name)

        # a user can become a watcher
        user_2 = UserFactory(display_name='john_snow', email='john_snow@nightswatch.wall')
        response = client.api_create_prompt_watch(prompt, user_2)
        self.assertEqual(response.status_code, 201)
        prompt_watch = PromptWatch.objects.get(pk=response.json()['pk'])
        prompt.refresh_from_db()
        self.assertEqual(len(prompt.watchers.all()), 2)
        self.assertEqual(prompt_watch.user.display_name, user_2.display_name)

        # a user can not create two watches on the same prompt
        response = client.api_create_prompt_watch(prompt, user_2)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['non_field_errors'][0], 'User is already watching prompt')

        # a user can not delete another user's watch
        response = client.api_delete_prompt_watch(prompt_watch, user)
        self.assertEqual(response.status_code, 403)

        # a user can stop being a watcher
        response = client.api_delete_prompt_watch(prompt_watch, user_2)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['pk'], prompt_watch.pk)
        prompt.refresh_from_db()
        self.assertEqual(len(prompt.watchers.all()), 1)
