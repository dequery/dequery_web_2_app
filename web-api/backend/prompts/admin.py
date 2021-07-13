from django.contrib import admin

from backend.prompts.models import Prompt, PromptWatch

class PromptAdmin(admin.ModelAdmin):
    pass


class PromptWatcherAdmin(admin.ModelAdmin):
    pass

admin.site.register(Prompt, PromptAdmin)
admin.site.register(PromptWatch, PromptWatcherAdmin)
