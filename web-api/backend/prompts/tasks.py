from celery.decorators import task

from backend.prompts.models import Prompt


@task(name="distribute_bounties")
def async_distribute_bounties():
    Prompt.distribute_bounties()
