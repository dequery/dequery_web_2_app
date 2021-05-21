from rest_framework import serializers

from backend.answers.models import Answer


class AnswerCreateSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Answer
        fields = ['created', 'content', 'pk', 'prompt', 'user']
        read_only_fields = ['created', 'pk', 'user']


class AnswerListRetrieveSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    class Meta:
        model = Answer
        fields = ['content', 'created', 'prompt', 'pk', 'user', 'votes']
        read_only_fields = ['content', 'created', 'prompt', 'pk', 'user', 'votes']
