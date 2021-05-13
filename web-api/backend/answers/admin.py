from django.contrib import admin

from backend.answers.models import Answer

class AnswerAdmin(admin.ModelAdmin):
    pass

admin.site.register(Answer, AnswerAdmin)
