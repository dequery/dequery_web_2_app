
from django.contrib.auth import get_user_model
from django.conf import settings

from rest_framework import serializers

from backend.notifications.models import Notification
from backend.notifications.constants import NOTIFICATION_CATEGORY_CHOICES, NOTIFICATION_DELIVERY_METHODS
from backend.users.models import ResetPasswordCode


User = get_user_model()


class NotificationCreateSerializer(serializers.ModelSerializer):
    email = serializers.CharField(max_length=255, write_only=True)

    class Meta:
        model = Notification
        fields = ['created', 'content', 'category', 'delivery_method', 'email']
        read_only_fields = ['created', 'pk']
        extra_kwargs = {
            'content': {'write_only': True},
            'category': {'write_only': True},
            'delivery_method': {'write_only': True},
        }
