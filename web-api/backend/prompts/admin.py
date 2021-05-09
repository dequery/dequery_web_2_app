from django.contrib import admin

from backend.prompts.models import Prompt

class PromptAdmin(admin.ModelAdmin):
    pass

admin.site.register(Prompt, PromptAdmin)
