import factory

from django.contrib.auth.models import User
from django.contrib.auth import get_user_model


User = get_user_model()


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    display_name = 'satoshi'
    email = 'satoshi@btc.net'
    password = 'test12'
    is_active = True
    is_admin = False
