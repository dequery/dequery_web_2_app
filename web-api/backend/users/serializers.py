from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from rest_framework import serializers

from backend.users.models import AlphaRequest
from backend.transactions.models import DeqTransaction
from backend.transactions.constants import TRANSACTION_CATEGORY_CHOICES


User = get_user_model()


class AlphaRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlphaRequest
        fields = ['created', 'text', 'pk', 'email']
        read_only_fields = ['created', 'pk']


class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['display_name', 'email', 'pk', 'password']
        read_only_fields = ['created', 'pk', 'deq_balance']

    def create(self, validated_data):
        user = User.objects.create_user(
            validated_data['display_name'],
            validated_data['email'],
            validated_data['password']
            )
        initial_deq_amount = 1000
        deq_transaction = DeqTransaction.objects.create(
            amount=initial_deq_amount,
            category=TRANSACTION_CATEGORY_CHOICES.FROM_SOURCE,
            user=user,
            other_pk=0
        )
        deq_transaction.save()
        return user


class UserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['display_name', 'pk', 'deq_balance', 'email']
