#!/bin/sh
source /var/app/venv/*/bin/activate
cd /var/app/current/
celery -A backend worker -l info --detach
