from rest_framework import serializers

from backend.transactions.models import DeqTransaction


class DeqTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeqTransaction
        fields = ['amount', 'created', 'category', 'pk', 'user', 'other_pk']
        read_only_fields = ['created', 'pk']
