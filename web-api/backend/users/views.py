from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from django.db.models.fields import PositiveIntegerRelDbTypeMixin
from rest_framework import generics, mixins, permissions, views
from rest_framework.response import Response

from backend.users.serializers import AlphaRequestSerializer, UserCreateSerializer, UserDetailSerializer
from backend.users.models import AlphaRequest


User = get_user_model()


class AlphaRequestCreate(generics.CreateAPIView):
    queryset = AlphaRequest.objects.all()
    serializer_class = AlphaRequestSerializer
    permission_classes = [permissions.AllowAny]


class UserCreate(mixins.CreateModelMixin, generics.GenericAPIView):
    queryset = User.objects.all()
    serializer_class = UserCreateSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        if request.data.get('alpha_passcode') != '42':
            return Response({'detail': 'Incorrect Alpha Passcode'}, status=401) 
        return self.create(request, *args, **kwargs)


class UserDetail(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserDetailSerializer
    permission_classes = [permissions.IsAuthenticated]


class RetrieveUserFromToken(views.APIView):
    def get(self, request):
        user_serializer = UserDetailSerializer(request.user)
        return Response(user_serializer.data)
