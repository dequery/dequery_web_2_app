from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated

from backend.prompts.models import Prompt
from backend.prompts.serializers import PromptCreateSerializer, PromptDetailSerializer, PromptListSerializer


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
