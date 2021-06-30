from celery.decorators import task

from backend.notifications.models import Notification


@task(name="send_all_new_notifications")
def async_send_all_new_notifications():
    Notification().send_all_new_notifications()
