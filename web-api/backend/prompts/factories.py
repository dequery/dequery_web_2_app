import factory
import datetime

from backend.prompts.models import Prompt


TEST_CONTENT = {"blocks": [{"key": "9ts68", "data": {}, "text": "tert", "type": "unstyled", "depth": 0, "entityRanges": [], "inlineStyleRanges": []}], "entityMap": {}}

class PromptFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Prompt

    content = TEST_CONTENT
    expiration_datetime = datetime.date.today() + datetime.timedelta(days=1)
    title = 'Test'
    user = 0
