from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from rest_framework import serializers

from backend.users.models import AlphaRequest, SignupCode
from backend.transactions.models import DeqTransaction
from backend.transactions.constants import TRANSACTION_CATEGORY_CHOICES


User = get_user_model()


class AlphaRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlphaRequest
        fields = ['created', 'text', 'pk', 'email']
        read_only_fields = ['created', 'pk']


class UserCreateSerializer(serializers.ModelSerializer):
    signup_code = serializers.CharField(allow_blank=True, required=False, max_length=16, write_only=True)

    class Meta:
        model = User
        fields = ['display_name', 'email', 'pk', 'password', 'signup_code']
        read_only_fields = ['created', 'pk', 'deq_balance']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def _validate_signup_code(self, validated_data):
        try:
            signup_code = SignupCode.objects.get(code=validated_data['signup_code'])
        except:
            raise serializers.ValidationError('Not a valid code')

        if signup_code.use_count - signup_code.used - 1 < 0:
            raise serializers.ValidationError('Code already used')
        return signup_code

    def validate(self, validated_data):
        if validated_data.get('signup_code'):
            signup_code = self._validate_signup_code(validated_data)
        else:
            signup_code = None
        validated_data['signup_code'] = signup_code
        return validated_data

    def validate_password(self, value):
        if len(value) < 6:
            raise serializers.ValidationError('Password must be at least 6 characters')
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            validated_data['display_name'],
            validated_data['email'],
            validated_data['password']
            )

        signup_code = validated_data['signup_code']
        if signup_code:
            signup_code.used += 1
            signup_code.save(update_fields=['used'])
            deq_transaction = DeqTransaction.objects.create(
                amount=signup_code.endowment,
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
