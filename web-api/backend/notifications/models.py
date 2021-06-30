from django.core.mail import send_mail
from django.db import models
from django.conf import settings

from backend.notifications.constants import NOTIFICATION_CATEGORY_CHOICES, NOTIFICATION_DELIVERY_METHODS, NOTIFICATION_STATUS_CHOICES
from backend.users.models import User


class NotificationManager(models.Manager):
    pass


class Notification(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    content = models.JSONField(default=dict)
    category = models.CharField(max_length=64, choices=NOTIFICATION_CATEGORY_CHOICES)
    delivery_method = models.CharField(max_length=64, choices=NOTIFICATION_DELIVERY_METHODS)
    error_message = models.CharField(max_length=255, blank=True, default='')
    status = models.CharField(max_length=64, choices=NOTIFICATION_STATUS_CHOICES, default=NOTIFICATION_STATUS_CHOICES.NEW)
    user = models.ForeignKey(User, related_name='notifications', on_delete=models.PROTECT)

    objects = NotificationManager()

    @classmethod
    def send_all_new_notifications(cls):
        notifications = cls.objects.filter(status=NOTIFICATION_STATUS_CHOICES.NEW)
        for notification in notifications:
            notification.status = NOTIFICATION_STATUS_CHOICES.PROCESSING
            notification.save(update_fields=['status'])
            notification.send()

    def save_as_failed(self, error_message):
        self.error_message = error_message
        self.status = NOTIFICATION_STATUS_CHOICES.FAILED
        self.save(update_fields=['error_message', 'status'])

    def save_as_sent(self):
        self.status = NOTIFICATION_STATUS_CHOICES.SENT
        self.save(update_fields=['status'])

    def send(self):
        if self.status != NOTIFICATION_STATUS_CHOICES.PROCESSING:
            return False

        if self.delivery_method == NOTIFICATION_DELIVERY_METHODS.EMAIL:
            try:
                send_mail(self.content['subject'], self.content['message'], settings.EMAIL_HOST_USER, [self.user.email])
            except:
                self.save_as_failed('Email errored when trying to send')
                return False
            self.save_as_sent()
            return True
        self.save_as_failed(f'{self.delivery_method} delivery method is not supported')
        return False
