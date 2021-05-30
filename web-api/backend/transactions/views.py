from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from backend.transactions.models import DeqTransaction
from backend.transactions.serializers import DeqTransactionCreateSerializer, DeqTransactionDetailSerializer


class DeqTransactionCreate(generics.CreateAPIView):
    serializer_class = DeqTransactionCreateSerializer
    permission_classes = [IsAuthenticated]


class DeqTransacionList(generics.ListAPIView):
    serializer_class = DeqTransactionDetailSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return DeqTransaction.objects.filter(user=self.request.user).order_by('-created')
