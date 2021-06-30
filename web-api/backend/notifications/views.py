import random
import string

from django.contrib.auth import get_user_model
from django.conf import settings

from rest_framework import permissions, views
from rest_framework.response import Response

from backend.notifications.models import Notification
from backend.notifications.constants import NOTIFICATION_CATEGORY_CHOICES, NOTIFICATION_DELIVERY_METHODS
from backend.users.models import ResetPasswordCode


User = get_user_model()


class RequestResetPassword(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'detail': 'Missing email field'}, status=401)

        try:
            user = User.objects.get(email=email)
        except:
            # we purposefully obscure that the email provided doesn't have an existing account for security
            return Response({'detail': 'Reset password link sent if an account exists with provided email'}, status=201)

        code = ''.join(random.choice(string.ascii_letters) for _ in range(12))
        reset_password_code = ResetPasswordCode.objects.create(code=code, user=user)
        reset_password_code.save()
        reset_link = f'{settings.FRONTEND_BASE_URL}/reset-password/{code}'
        content = {
            'subject': 'Reset Password Request',
            'message': f'Hi {user.display_name}, please use this link to reset your password: {reset_link}',
        }
        notification = Notification.objects.create(
            user=user,
            category=NOTIFICATION_CATEGORY_CHOICES.RESET_PASSWORD,
            delivery_method=NOTIFICATION_DELIVERY_METHODS.EMAIL,
            content=content,
        )
        notification.save()

        return Response({'detail': 'Reset password link sent if an account exists with provided email'}, status=201)
