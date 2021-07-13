from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated

from backend.permissions import IsOwnerOnly
from backend.prompts.models import Prompt, PromptWatch
from backend.prompts.serializers import PromptCreateSerializer, PromptDetailSerializer, PromptListSerializer, PromptWatchCreateSerializer


class PromptCreate(generics.CreateAPIView):
    serializer_class = PromptCreateSerializer
    permission_classes = [IsAuthenticated]


class PromptDetail(generics.RetrieveAPIView):
    queryset = Prompt.objects.all()
    serializer_class = PromptDetailSerializer
    permission_classes = [AllowAny]


class PromptList(generics.ListAPIView):
    serializer_class = PromptListSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        hidden_code = self.request.query_params.get('hidden_code', '')
        return Prompt.objects.filter(hidden_code=hidden_code).order_by('status', 'expiration_datetime')


class PromptWatchCreate(generics.CreateAPIView):
    serializer_class = PromptWatchCreateSerializer
    permission_classes = [IsAuthenticated]


class PromptWatchDelete(generics.DestroyAPIView):
    queryset = PromptWatch.objects.all()
    serializer_class = PromptWatchCreateSerializer
    permission_classes = [IsAuthenticated, IsOwnerOnly]
