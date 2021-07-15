import datetime
from decimal import *

from rest_framework.test import APIClient

from backend.prompts.factories import TEST_CONTENT


client = APIClient()


class TestClient:
    def api_create_answer(self, user, prompt_pk):
        client.force_authenticate(user=user)
        response = client.post('/api/answers/create/', {
            'content': TEST_CONTENT,
            'user': user.pk,
            'prompt': prompt_pk,
        }, format='json')
        return response

    def api_create_prompt(self, user, bounty, hidden_code=None, askers_cut=None, expiration_datetime=None):
        if not expiration_datetime:
            expiration_datetime = (datetime.date.today() + datetime.timedelta(days=1)).strftime("%Y-%m-%d %H:%M:%S")
        client.force_authenticate(user=user)
        body = {
            'bounty': bounty,
            'content': TEST_CONTENT,
            'expiration_datetime': expiration_datetime,
            'title': 'test',
            'user': user.pk,
            }
        if hidden_code:
            body['hidden_code'] = hidden_code
        if askers_cut:
            body['askers_cut'] = askers_cut
        response = client.post('/api/prompts/create/', body, format='json')
        return response

    def api_create_prompt_watch(self, prompt, user):
        client.force_authenticate(user=user)
        response = client.post('/api/prompt-watches/create/', {
            'user': user.pk,
            'prompt': prompt.pk,
        }, format='json')
        return response

    def api_delete_prompt_watch(self, prompt_watch, user):
        client.force_authenticate(user=user)
        response = client.delete(f'/api/prompt-watches/delete/{prompt_watch.pk}/', {}, format='json')
        return response

    def api_create_deq_transaction(self, user, amount, category, extra_info):
        client.force_authenticate(user=user)
        response = client.post('/api/transactions/create/', {
            'amount': amount,
            'category': category,
            'extra_info': extra_info,
            'user': user.pk,
        }, format='json')
        return response

    def api_create_vote_cast(self, user, amount, answer_pk, prompt_pk):
        client.force_authenticate(user=user)
        vote_balance = user.vote_balances.filter(prompt=prompt_pk).first()
        response = client.post('/api/vote-casts/create/', {
            'amount': amount,
            'answer': answer_pk,
            'vote_balance': vote_balance.pk,
        }, format='json')
        return response

    def api_retrieve_prompts(self, hidden_code=None):
        if hidden_code:
            response = client.get(f'/api/prompts/?hidden_code={hidden_code}')
        else:
            response = client.get('/api/prompts/')
        return response

    def api_create_notification(self, email):
        response = client.post('/api/notifications/reset-password/', {
            'email': email,
        }, format='json')
        return response

    def api_create_transaction(self, amount, category, extra_info, user):
        client.force_authenticate(user=user)
        response = client.post('/api/transactions/create/', {
            'amount': amount,
            'category': category,
            'extra_info': extra_info,
            'user': user.pk,
        }, format='json')
        return response

