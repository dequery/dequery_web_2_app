from django.core import mail
from django.test import TestCase
from rest_framework.test import APIClient

from backend.users.factories import UserFactory
from backend.notifications.constants import NOTIFICATION_CATEGORY_CHOICES, NOTIFICATION_DELIVERY_METHODS, NOTIFICATION_STATUS_CHOICES
from backend.notifications.factories import NotificationFactory
from backend.notifications.models import Notification


client = APIClient()


class NotificationTests(TestCase):
    def setUp(self):
        self.user = UserFactory()

    def _api_create_notification(self, email):
        response = client.post('/api/notifications/reset-password/', {
            'email': email,
        }, format='json')
        return response

    def test_notification_create(self):
        # it secretely fails for invalid email
        response = self._api_create_notification('invalid@email.org')
        self.assertEqual(201, response.status_code)
        notifications = Notification.objects.all()
        self.assertEqual(0, len(list(notifications)))

        # it creates a notification for a valid email
        email = 'ping_me@sub.com'
        user = UserFactory(display_name='ping_me', email=email)
        response = self._api_create_notification(email)
        self.assertEqual(201, response.status_code)
        notification = Notification.objects.filter(user=user).first()
        self.assertEqual('Reset Password Request', notification.content['subject'])
        self.assertTrue(notification.content['message'].startswith('Hi ping_me, please use this link to reset your password: http://localhost:3000/reset-password/'))

    def test_send_notification(self):
        user = UserFactory(display_name='ping_me_2', email='ping_me_2@sub.com')

        # it fails if content is empty
        notification = NotificationFactory(
            user=user,
            content={},
            category=NOTIFICATION_CATEGORY_CHOICES.RESET_PASSWORD,
            delivery_method=NOTIFICATION_DELIVERY_METHODS.EMAIL,
            status=NOTIFICATION_STATUS_CHOICES.PROCESSING,
            )
        did_send = notification.send()
        self.assertFalse(did_send)
        self.assertEqual(notification.status, NOTIFICATION_STATUS_CHOICES.FAILED)

        # it works if content is valid
        notification = NotificationFactory(
            user=user,
            content={'subject': 'Test Email', 'message': 'howdy'},
            category=NOTIFICATION_CATEGORY_CHOICES.RESET_PASSWORD,
            delivery_method=NOTIFICATION_DELIVERY_METHODS.EMAIL,
            status=NOTIFICATION_STATUS_CHOICES.PROCESSING,
            )
        did_send = notification.send()
        self.assertTrue(did_send)
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].subject, 'Test Email')
        self.assertEqual(notification.status, NOTIFICATION_STATUS_CHOICES.SENT)

    def test_send_all_new_notifications(self):
        user = UserFactory(display_name='ping_me_3', email='ping_me_3@sub.com')
        start_mail_len = len(mail.outbox)

        notification_1 = NotificationFactory(
            user=user,
            content={'subject': 'Test Email 1', 'message': 'howdy'},
            category=NOTIFICATION_CATEGORY_CHOICES.RESET_PASSWORD,
            delivery_method=NOTIFICATION_DELIVERY_METHODS.EMAIL,
            )

        notification_2 = NotificationFactory(
            user=user,
            content={'subject': 'Test Email 2', 'message': 'howdy'},
            category=NOTIFICATION_CATEGORY_CHOICES.RESET_PASSWORD,
            delivery_method=NOTIFICATION_DELIVERY_METHODS.EMAIL,
            )

        already_sent_notification = NotificationFactory(
            user=user,
            content={'subject': 'Already Sent', 'message': 'howdy'},
            category=NOTIFICATION_CATEGORY_CHOICES.RESET_PASSWORD,
            delivery_method=NOTIFICATION_DELIVERY_METHODS.EMAIL,
            status=NOTIFICATION_STATUS_CHOICES.SENT
            )

        already_failed_notification = NotificationFactory(
            user=user,
            content={'subject': 'Already Failed', 'message': 'howdy'},
            category=NOTIFICATION_CATEGORY_CHOICES.RESET_PASSWORD,
            delivery_method=NOTIFICATION_DELIVERY_METHODS.EMAIL,
            status=NOTIFICATION_STATUS_CHOICES.FAILED
            )

        already_processing_notification = NotificationFactory(
            user=user,
            content={'subject': 'Already Processing', 'message': 'howdy'},
            category=NOTIFICATION_CATEGORY_CHOICES.RESET_PASSWORD,
            delivery_method=NOTIFICATION_DELIVERY_METHODS.EMAIL,
            status=NOTIFICATION_STATUS_CHOICES.PROCESSING
            )

        Notification().send_all_new_notifications()

        self.assertEqual(start_mail_len + 2, len(mail.outbox))
        notification_1.refresh_from_db()
        self.assertEqual(notification_1.status, NOTIFICATION_STATUS_CHOICES.SENT)
        notification_2.refresh_from_db()
        self.assertEqual(notification_2.status, NOTIFICATION_STATUS_CHOICES.SENT)
        already_sent_notification.refresh_from_db()
        self.assertEqual(already_sent_notification.status, NOTIFICATION_STATUS_CHOICES.SENT)
        already_failed_notification.refresh_from_db()
        self.assertEqual(already_failed_notification.status, NOTIFICATION_STATUS_CHOICES.FAILED)
        already_processing_notification.refresh_from_db()
        self.assertEqual(already_processing_notification.status, NOTIFICATION_STATUS_CHOICES.PROCESSING)
