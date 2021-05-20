#!/bin/sh
source /var/app/venv/*/bin/activate
cd /var/app/current/
celery -A backend beat -l info --detach
