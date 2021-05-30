from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from rest_framework import generics, mixins, permissions, views
from rest_framework.response import Response

from backend.users.serializers import AlphaRequestSerializer, UserCreateSerializer, UserDetailSerializer
from backend.users.models import AlphaCode, AlphaRequest, ResetPasswordCode


User = get_user_model()


class AlphaRequestCreate(generics.CreateAPIView):
    queryset = AlphaRequest.objects.all()
    serializer_class = AlphaRequestSerializer
    permission_classes = [permissions.AllowAny]


class UserCreate(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserCreateSerializer
    permission_classes = [permissions.AllowAny]


class UserDetail(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserDetailSerializer
    permission_classes = [permissions.IsAuthenticated]


class RetrieveUserFromToken(views.APIView):
    def get(self, request):
        user_serializer = UserDetailSerializer(request.user)
        return Response(user_serializer.data)


class ResetPassword(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        reset_password_code = request.data.get('reset_password_code')
        if not reset_password_code:
            return Response({'detail': 'Missing reset password code'}, status=401)

        try:
            reset_password_code = ResetPasswordCode.objects.get(code=reset_password_code)
        except:
            return Response({'detail': 'Invalid reset password code'}, status=401)

        if reset_password_code.used:
            return Response({'detail': 'Reset password code already used'}, status=401)

        new_password = request.data.get('new_password')
        if not new_password:
            return Response({'detail': 'New password is requireed'}, status=401)
        try:
            reset_password_code.user.reset_password(new_password)
        except:
            return Response({'detail': 'Error resetting password'})
        reset_password_code.used = True
        reset_password_code.save(update_fields=['used'])
        return Response({'detail': 'Password reset'}, status=200)
