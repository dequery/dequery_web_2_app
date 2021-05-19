from rest_framework import serializers

from backend.votes.models import VoteCast


class VoteCastCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = VoteCast
        fields = '__all__'
        read_only_fields = ['created', 'id']

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError('Amount must be greater than 0')
        return value

    def validate(self, validated_data):
        remaining_votes = validated_data['vote_balance'].remaining_amount - validated_data['amount']
        if remaining_votes < 0:
            raise serializers.ValidationError('Not enough Votes')

        prompt = validated_data['vote_balance'].prompt
        if not prompt.answers.all(id=validated_data['answer'].id).exists():
            raise serializers.ValidationError('Answer and vote token do not match')
        return validated_data
