from cryptoaddress import EthereumAddress
from rest_framework import serializers

from backend.transactions.models import DeqTransaction
from backend.transactions.constants import ETH_GAS_FEE, TRANSACTION_CATEGORY_CHOICES, VALID_API_CATEGORIES


class DeqTransactionDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeqTransaction
        fields = ['amount', 'created', 'category', 'extra_info', 'pk', 'user']
        read_only_fields = ['created', 'pk']


class DeqTransactionCreateSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = DeqTransaction
        fields = ['amount', 'created', 'category', 'extra_info', 'pk', 'user']
        read_only_fields = ['created', 'pk']

    def validate_category(self, value):
        if value not in VALID_API_CATEGORIES:
            raise serializers.ValidationError('Not a valid transaction category')
        return value

    def _validate_extra_info(self, validated_data):
        if validated_data['category'] == TRANSACTION_CATEGORY_CHOICES.TO_ETH:
            try:
                eth_address = validated_data['extra_info']['eth_address']
                EthereumAddress(eth_address)
            except:
                raise serializers.ValidationError('A valid eth address was not provided')

    def validate(self, validated_data):
        self._validate_extra_info(validated_data)
        if validated_data['category'] == TRANSACTION_CATEGORY_CHOICES.TO_ETH:
            gas_fee_deq = DeqTransaction.eth_to_deq(ETH_GAS_FEE)
            remaining_balance = float(validated_data['user'].deq_balance) - float(validated_data['amount']) - gas_fee_deq
            if remaining_balance < 0:
                raise serializers.ValidationError('Not enough DEQ to make transaction')
        return validated_data
