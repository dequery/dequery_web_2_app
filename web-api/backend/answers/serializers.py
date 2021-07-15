from rest_framework import serializers

from backend.answers.models import Answer
from backend.notifications.models import Notification


class AnswerCreateSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Answer
        fields = ['created', 'content', 'pk', 'prompt', 'user']
        read_only_fields = ['created', 'pk', 'user']

    def create(self, validated_data):
        for watcher in validated_data['prompt'].watchers.all():
            Notification.create_answer_submitted_notification(watcher.user, validated_data['prompt'])
        answer = Answer.objects.create(**validated_data)
        return answer


class AnswerListRetrieveSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    class Meta:
        model = Answer
        fields = ['content', 'created', 'prompt', 'pk', 'user', 'votes']
        read_only_fields = ['content', 'created', 'prompt', 'pk', 'user', 'votes']
