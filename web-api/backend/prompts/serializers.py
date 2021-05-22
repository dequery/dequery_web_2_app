from rest_framework import serializers

from backend.answers.serializers import AnswerListRetrieveSerializer
from backend.prompts.models import Prompt
from backend.transactions.constants import TRANSACTION_CATEGORY_CHOICES
from backend.transactions.models import DeqTransaction
from backend.votes.models import VoteBalance


class PromptCreateSerializer(serializers.ModelSerializer):
    bounty = serializers.IntegerField()
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Prompt
        fields = ['bounty', 'content', 'created', 'expiration_datetime', 'pk', 'status', 'title', 'user']
        read_only_fields = ['bounty', 'created', 'pk', 'status', 'user']

    def create(self, validated_data):
        bounty = validated_data.pop('bounty')
        prompt = Prompt.objects.create(**validated_data)
        prompt.save()
        deq_transaction = DeqTransaction.objects.create(
            amount=bounty,
            category=TRANSACTION_CATEGORY_CHOICES.TO_PROMPT_BOUNTY,
            user=validated_data['user'],
            other_pk=prompt.pk,
        )
        deq_transaction.save()
        vote_balance = VoteBalance.objects.create(
            amount=bounty,
            prompt=prompt,
            user=validated_data['user'],
        )
        vote_balance.save()
        return prompt

    def validate_bounty(self, value):
        min_bounty = 10
        if value < min_bounty:
            raise serializers.ValidationError('Min Bounty is 10 DEQ')
        return value

    def validate(self, validated_data):
        remaining_balance = validated_data['user'].deq_balance - validated_data['bounty']
        if remaining_balance < 0:
            raise serializers.ValidationError('Not enough DEQ to pay for bounty')
        return validated_data


class PromptDetailSerializer(serializers.ModelSerializer):
    bounty = serializers.IntegerField()
    answers = AnswerListRetrieveSerializer(many=True)
    user = serializers.StringRelatedField()

    class Meta:
        model = Prompt
        fields = ['answers', 'bounty', 'content', 'created', 'expiration_datetime', 'status', 'pk', 'title', 'user']
        read_only_fields = ['answers', 'bounty', 'content', 'created', 'expiration_datetime', 'status', 'pk', 'title', 'user']


class PromptListSerializer(serializers.ModelSerializer):
    bounty = serializers.IntegerField()
    user = serializers.StringRelatedField()

    class Meta:
        model = Prompt
        fields = ['bounty', 'created', 'expiration_datetime', 'pk', 'status', 'title', 'user']
        read_only_fields = ['bounty', 'created', 'expiration_datetime', 'pk', 'status', 'title', 'user']
