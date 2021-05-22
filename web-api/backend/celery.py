import os
import dotenv

from celery import Celery
from celery.schedules import crontab


dotenv.read_dotenv()

# set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

app = Celery('backend')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django app configs.
app.autodiscover_tasks()


@app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    #sender.add_periodic_task(30.0, heartbeat.s('world'), expires=20, name='heartbeat')
    sender.add_periodic_task(60.0, 'backed.prompts.tasks.async_distribute_bounties', expires=50, name='distribute_bounties')


@app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}')


@app.task
def heartbeat(arg):
    print(arg)
