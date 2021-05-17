from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from rest_framework import serializers

from backend.users.models import AlphaRequest


User = get_user_model()


class AlphaRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlphaRequest
        fields = '__all__'
        read_only_fields = ['created']


class UserCreateSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['display_name', 'email', 'password']
        read_only_fields = ['created']

    def create(self, validated_data):
        user = User.objects.create_user(
            validated_data['display_name'],
            validated_data['email'],
            validated_data['password']
            )
        return user


class UserDetailSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['display_name', 'deq_balance', 'email']
