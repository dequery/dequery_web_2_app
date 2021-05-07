from rest_framework import serializers

from backend.prompts.models import Prompt


class PromptCreateSerializer(serializers.HyperlinkedModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Prompt
        fields = ['content', 'created', 'expiration_datetime', 'pk', 'user', 'title']
        read_only_fields = ['created', 'pk', 'user']
