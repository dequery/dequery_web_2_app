from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from backend.transactions.models import DeqTransaction
from backend.transactions.serializers import DeqTransactionSerializer


class DeqTransacionList(generics.ListAPIView):
    serializer_class = DeqTransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return DeqTransaction.objects.filter(user=self.request.user).order_by('-created')
