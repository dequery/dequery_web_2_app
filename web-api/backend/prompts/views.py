from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from backend.prompts.models import Prompt
from backend.prompts.serializers import PromptCreateSerializer


class PromptCreate(generics.CreateAPIView):
    serializer_class = PromptCreateSerializer
    permission_classes = [IsAuthenticated]