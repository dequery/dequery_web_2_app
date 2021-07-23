from rest_framework import serializers

from backend.notifications.models import Notification
from backend.answers.serializers import AnswerListRetrieveSerializer
from backend.users.models import User
from backend.prompts.models import Prompt, PromptWatch
from backend.transactions.constants import TRANSACTION_CATEGORY_CHOICES
from backend.transactions.models import DeqTransaction
from backend.votes.models import VoteBalance


class WatcherSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['display_name']
        read_only_fields = ['display_name']


class PromptWatchSerializer(serializers.ModelSerializer):
    user = WatcherSerializer()

    class Meta:
        model = PromptWatch
        fields = ['created', 'user', 'pk', 'prompt']
        read_only_fields = ['created', 'user', 'pk', 'prompt']


class PromptWatchCreateSerializer(serializers.ModelSerializer):
    request_user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    user = WatcherSerializer(read_only=True)

    class Meta:
        model = PromptWatch
        fields = ['created', 'request_user', 'user', 'pk', 'prompt']
        read_only = ['user']

    def validate(self, data):
        prompt_watches = PromptWatch.objects.filter(prompt=data['prompt'], user=data['request_user']).exists()

        if prompt_watches:
            raise serializers.ValidationError('User is already watching prompt')
        data['user'] = data['request_user']
        del data['request_user']
        return data


class PromptCreateSerializer(serializers.ModelSerializer):
    bounty = serializers.IntegerField()
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Prompt
        fields = ['askers_cut', 'bounty', 'content', 'created', 'expiration_datetime', 'hidden_code', 'pk', 'status', 'title', 'user', 'watchers']
        read_only_fields = ['bounty', 'created', 'pk', 'status', 'user', 'watchers']

    def create(self, validated_data):
        bounty = validated_data.pop('bounty')
        prompt = Prompt.objects.create(**validated_data)
        prompt.save()
        deq_transaction = DeqTransaction.objects.create(
            amount=bounty,
            category=TRANSACTION_CATEGORY_CHOICES.TO_PROMPT_BOUNTY,
            user=validated_data['user'],
            extra_info={'prompt': prompt.pk}
        )
        deq_transaction.save()
        vote_balance = VoteBalance.objects.create(
            amount=bounty,
            prompt=prompt,
            user=validated_data['user'],
        )
        vote_balance.save()
        prompt_watch = PromptWatch.objects.create(user=validated_data['user'], prompt=prompt)
        prompt_watch.save()
        return prompt

    def validate_askers_cut(self, value):
        if value > 1.0 or value < 0.0:
            raise serializers.ValidationError('Askers cut must be between 0 and 1')
        return value

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
    watchers = PromptWatchSerializer(many=True)

    class Meta:
        depth = 1
        model = Prompt
        fields = ['askers_cut', 'answers', 'bounty', 'content', 'created', 'expiration_datetime', 'hidden_code', 'status', 'pk', 'title', 'user', 'watchers']
        read_only_fields = ['answers', 'bounty', 'content', 'created', 'expiration_datetime', 'status', 'pk', 'title', 'user', 'watchers']


class PromptListSerializer(serializers.ModelSerializer):
    bounty = serializers.IntegerField()
    user = serializers.StringRelatedField()
    watchers = PromptWatchSerializer(many=True)

    class Meta:
        model = Prompt
        fields = ['answer_count', 'askers_cut', 'bounty', 'created', 'expiration_datetime', 'hidden_code', 'pk', 'status', 'title', 'user', 'watchers']
        read_only_fields = ['answer_count', 'askers_cut', 'bounty', 'created', 'expiration_datetime', 'pk', 'status', 'title', 'user', 'watchers']
