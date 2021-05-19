from rest_framework import serializers

from backend.answers.models import Answer


class AnswerCreateSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Answer
        fields = '__all__'
        read_only_fields = ['created', 'id', 'user']

    def validate(self, validated_data):
        if validated_data['user'].deq_balance < 1:
            raise serializers.ValidationError('1 DEQ is required to submit an answer')
        return validated_data


class AnswerListRetrieveSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    class Meta:
        model = Answer
        fields = ['content', 'created', 'prompt', 'id', 'user', 'votes']
        read_only_fields = ['content', 'created', 'prompt', 'id', 'user', 'votes']
