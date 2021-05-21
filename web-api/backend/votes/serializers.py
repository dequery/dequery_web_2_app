from rest_framework import serializers

from backend.votes.models import VoteBalance, VoteCast


class VoteBalanceDetailSerializer(serializers.ModelSerializer):
    remaining_amount = serializers.IntegerField()

    class Meta:
        model = VoteBalance
        fields = ['amount', 'created', 'pk', 'prompt', 'remaining_amount', 'user']
        read_only_fields = ['amount', 'created', 'pk', 'prompt', 'remaining_amount', 'user']


class VoteCastCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = VoteCast
        fields = ['amount', 'answer', 'pk', 'vote_balance']
        read_only_fields = ['created', 'pk']

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError('Amount must be greater than 0')
        return value

    def validate(self, validated_data):
        remaining_votes = validated_data['vote_balance'].remaining_amount - validated_data['amount']
        if remaining_votes < 0:
            raise serializers.ValidationError('Not enough Votes')

        prompt = validated_data['vote_balance'].prompt
        if not prompt.answers.filter(pk=validated_data['answer'].pk).exists():
            raise serializers.ValidationError('Answer and vote token do not match')

        user = validated_data['vote_balance'].user
        if user.pk != self.context['request'].user.pk:
            raise serializers.ValidationError('User permission error')
        return validated_data
