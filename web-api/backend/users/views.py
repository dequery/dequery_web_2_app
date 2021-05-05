from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from rest_framework import generics, mixins, permissions, viewsets
from rest_framework.response import Response
from backend.users.serializers import UserSerializer


User = get_user_model()


class UserCreateRetrieve(mixins.RetrieveModelMixin,
                  mixins.CreateModelMixin,
                  generics.GenericAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        if request.data.get('alpha_passcode') != '42':
            return  Response({'detail': 'Incorrect Alpha Passcode'}, status=401) 
        return self.create(request, *args, **kwargs)
