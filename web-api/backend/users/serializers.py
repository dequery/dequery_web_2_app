from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from rest_framework import serializers

from backend.users.models import AlphaCode, AlphaRequest
from backend.transactions.models import DeqTransaction
from backend.transactions.constants import TRANSACTION_CATEGORY_CHOICES


User = get_user_model()


class AlphaRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlphaRequest
        fields = ['created', 'text', 'pk', 'email']
        read_only_fields = ['created', 'pk']


class UserCreateSerializer(serializers.ModelSerializer):
    alpha_passcode = serializers.CharField(max_length=12, write_only=True)

    class Meta:
        model = User
        fields = ['alpha_passcode', 'display_name', 'email', 'pk', 'password']
        read_only_fields = ['created', 'pk', 'deq_balance']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def _validate_alpha_passcode(self, validated_data):
        try:
            alpha_code = AlphaCode.objects.get(code=validated_data['alpha_passcode'])
        except:
            raise serializers.ValidationError('Not a valid passcode')

        if alpha_code.use_count - alpha_code.used - 1 < 0:
            raise serializers.ValidationError('Passcode already used')
        return alpha_code

    def validate(self, validated_data):
        alpha_code = self._validate_alpha_passcode(validated_data)
        validated_data['alpha_passcode'] = alpha_code
        return validated_data

    def create(self, validated_data):
        user = User.objects.create_user(
            validated_data['display_name'],
            validated_data['email'],
            validated_data['password']
            )
        alpha_code = validated_data['alpha_passcode']
        alpha_code.used += 1
        alpha_code.save(update_fields=['used'])

        if alpha_code.endowment > 0:
            deq_transaction = DeqTransaction.objects.create(
                amount=alpha_code.endowment,
                category=TRANSACTION_CATEGORY_CHOICES.FROM_SOURCE,
                user=user,
            )
            deq_transaction.save()
        return user


class UserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['display_name', 'pk', 'deq_balance', 'email']
        extra_kwargs = {
            'password': {'write_only': True}
        }
