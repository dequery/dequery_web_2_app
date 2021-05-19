from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated

from backend.votes.models import VoteCast
from backend.votes.serializers import VoteCastCreateSerializer


class VoteCastCreate(generics.CreateAPIView):
    serializer_class = VoteCastCreateSerializer
    permission_classes = [IsAuthenticated]
