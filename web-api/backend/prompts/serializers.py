from rest_framework import serializers

from backend.prompts.models import Prompt


class PromptCreateSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Prompt
        fields = ['content', 'created', 'expiration_datetime', 'pk', 'user', 'title']
        read_only_fields = ['created', 'pk', 'user']


class PromptDetailSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    class Meta:
        model = Prompt
        fields = ['content', 'created', 'expiration_datetime', 'pk', 'user', 'title']
        read_only_fields = ['content', 'created', 'expiration_datetime', 'pk', 'user', 'title']


class PromptListSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    class Meta:
        model = Prompt
        fields = ['created', 'expiration_datetime', 'pk', 'user', 'title']
        read_only_fields = ['created', 'expiration_datetime', 'pk', 'user', 'title']
