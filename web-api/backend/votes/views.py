from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated

from backend.votes.models import VoteBalance, VoteCast
from backend.votes.serializers import VoteBalanceDetailSerializer, VoteCastCreateSerializer


class VoteBalanceDetail(generics.RetrieveAPIView):
    serializer_class = VoteBalanceDetailSerializer
    permission_classes = [AllowAny]
    query_set = VoteBalance.objects.all()


class VoteBalanceList(generics.ListAPIView):
    serializer_class = VoteBalanceDetailSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        prompt = self.request.query_params.get('prompt')
        user = self.request.user
        if prompt and user:
            return VoteBalance.objects.filter(user=user, prompt=prompt)
        return VoteBalance.objects.filter(user=user)


class VoteCastCreate(generics.CreateAPIView):
    serializer_class = VoteCastCreateSerializer
    permission_classes = [IsAuthenticated]
    queryset = VoteCast.objects.all()
