from rest_framework import serializers

from backend.answers.serializers import AnswerListRetrieveSerializer
from backend.prompts.models import Prompt


class PromptCreateSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Prompt
        fields = ['bounty', 'content', 'created', 'expiration_datetime', 'pk', 'user', 'title']
        read_only_fields = ['created', 'pk', 'user']


class PromptDetailSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    answers = AnswerListRetrieveSerializer(many=True)

    class Meta:
        model = Prompt
        fields = ['answers', 'bounty', 'content', 'created', 'expiration_datetime', 'pk', 'user', 'title']
        read_only_fields = ['bounty', 'content', 'created', 'expiration_datetime', 'pk', 'user', 'title']


class PromptListSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    class Meta:
        model = Prompt
        fields = ['bounty', 'created', 'expiration_datetime', 'pk', 'user', 'title']
        read_only_fields = ['bounty', 'created', 'expiration_datetime', 'pk', 'user', 'title']
