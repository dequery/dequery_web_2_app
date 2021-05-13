from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated

from backend.answers.models import Answer
from backend.answers.serializers import AnswerCreateSerializer, AnswerListRetrieveSerializer


class AnswerCreate(generics.CreateAPIView):
    serializer_class = AnswerCreateSerializer
    permission_classes = [IsAuthenticated]


class AnswerDetail(generics.RetrieveAPIView):
    queryset = Answer.objects.all()
    serializer_class = AnswerListRetrieveSerializer
    permission_classes = [AllowAny]


class AnswerList(generics.ListAPIView):
    queryset = Answer.objects.all()
    serializer_class = AnswerListRetrieveSerializer
    permission_classes = [AllowAny]
