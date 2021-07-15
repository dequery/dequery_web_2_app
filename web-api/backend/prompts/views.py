from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from backend.permissions import IsOwnerOnly
from backend.prompts.models import Prompt, PromptWatch
from backend.prompts.serializers import PromptCreateSerializer, PromptDetailSerializer, PromptListSerializer, PromptWatchCreateSerializer


class DestroyWithPayloadMixin(object):
     def destroy(self, *args, **kwargs):
         serializer = self.get_serializer(self.get_object())
         super().destroy(*args, **kwargs)
         return Response(serializer.data, status=200)


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


class PromptWatchDelete(DestroyWithPayloadMixin, generics.DestroyAPIView):
    queryset = PromptWatch.objects.all()
    serializer_class = PromptWatchCreateSerializer
    permission_classes = [IsAuthenticated, IsOwnerOnly]
