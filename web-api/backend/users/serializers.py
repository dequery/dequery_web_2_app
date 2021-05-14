from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()

class UserCreateSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['display_name', 'email', 'password']

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
