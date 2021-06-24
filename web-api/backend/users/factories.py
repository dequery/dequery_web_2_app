import factory

from django.contrib.auth.models import User
from django.contrib.auth import get_user_model

from backend.users.models import SignupCode


User = get_user_model()


class SignupCodeFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = SignupCode

    code = 'l33tmode'
    endowment = 100


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    display_name = 'satoshi'
    email = 'satoshi@btc.net'
    password = 'test12'
    is_active = True
    is_admin = False
