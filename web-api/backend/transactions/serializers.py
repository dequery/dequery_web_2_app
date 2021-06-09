from cryptoaddress import EthereumAddress
from rest_framework import serializers

from backend.prompts.models import Prompt
from backend.transactions.constants import ETH_GAS_FEE, TRANSACTION_CATEGORY_CHOICES, TRANSACTION_STATUS_CHOICES, VALID_API_CATEGORIES
from backend.transactions.models import DeqTransaction
from backend.votes.models import VoteBalance


class DeqTransactionDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeqTransaction
        fields = ['amount', 'created', 'category', 'extra_info', 'pk', 'status', 'user']
        read_only_fields = ['created', 'pk']


class DeqTransactionCreateSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = DeqTransaction
        fields = ['amount', 'created', 'category', 'extra_info', 'pk', 'status', 'user']
        read_only_fields = ['created', 'pk']

    def validate_category(self, value):
        if value not in VALID_API_CATEGORIES:
            raise serializers.ValidationError('Not a valid transaction category')
        return value

    def _validate_extra_info(self, validated_data):
        category = validated_data['category']
        if category == TRANSACTION_CATEGORY_CHOICES.TO_ETH:
            try:
                eth_address = validated_data['extra_info']['ethereum_address']
                EthereumAddress(eth_address)
            except:
                raise serializers.ValidationError('A valid eth address was not provided')
        elif category == TRANSACTION_CATEGORY_CHOICES.INCREASE_PROMPT_BOUNTY:
            try:
                prompt = Prompt.objects.get(pk=validated_data['extra_info']['prompt'])
                validated_data['extra_info']['prompt'] = prompt
            except:
                raise serializers.ValidationError('A valid prompt was not provided')
        return validated_data

    def validate(self, validated_data):
        validated_data = self._validate_extra_info(validated_data)
        category = validated_data['category']
        if category == TRANSACTION_CATEGORY_CHOICES.TO_ETH:
            gas_fee_deq = DeqTransaction.eth_to_deq(ETH_GAS_FEE)
            remaining_balance = float(validated_data['user'].deq_balance) - float(validated_data['amount']) - gas_fee_deq
            if remaining_balance < 0:
                raise serializers.ValidationError('Not enough DEQ to make transaction')
        elif category == TRANSACTION_CATEGORY_CHOICES.INCREASE_PROMPT_BOUNTY:
            remaining_balance = float(validated_data['user'].deq_balance) - float(validated_data['amount'])
            if remaining_balance < 0:
                raise serializers.ValidationError('Not enough DEQ to make transaction')
        return validated_data

    def create(self, validated_data):
        category = validated_data['category']
        if category == TRANSACTION_CATEGORY_CHOICES.TO_ETH:
            validated_data['status'] = TRANSACTION_STATUS_CHOICES.PROCCESSING
        elif category == TRANSACTION_CATEGORY_CHOICES.INCREASE_PROMPT_BOUNTY:
            try:  # add to existing vote balance for this user and prompt
                vote_balance = VoteBalance.objects.filter(
                    user=validated_data['user'],
                    prompt=validated_data['extra_info']['prompt'],
                    ).first()
                vote_balance.amount += validated_data['amount']
                vote_balance.save(update_fields=['amount'])
            except:  # first vote balance for this user and prompt
                vote_balance = VoteBalance.objects.create(
                    amount=validated_data['amount'],
                    prompt=validated_data['extra_info']['prompt'],
                    user=validated_data['user'],
                )
                vote_balance.save()
            validated_data['extra_info']['prompt'] = validated_data['extra_info']['prompt'].pk
        deq_transaction = DeqTransaction.objects.create(**validated_data)
        deq_transaction.save()
        return deq_transaction
