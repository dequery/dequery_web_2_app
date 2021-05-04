import os

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.contrib.auth.models import User

User = get_user_model()

class Command(BaseCommand):
    def handle(self, *args, **options):
        email = os.environ.get('ADMIN_EMAIL')
        display_name = os.environ.get('ADMIN_DISPLAY_NAME')
        password = os.environ.get('ADMIN_PASSWORD')
        if not User.objects.filter(display_name=display_name).exists():
            User.objects.create_superuser(email, display_name, password)
            self.stdout.write(self.style.SUCCESS('Successfully created superuser'))
