from rest_framework import serializers

from backend.transactions.models import DeqTransaction


class DeqTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeqTransaction
        fields = ['amount', 'created', 'category', 'extra_info', 'pk', 'user']
        read_only_fields = ['created', 'pk']
