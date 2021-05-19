from django.contrib import admin

from backend.transactions.models import DeqTransaction

class DeqTransactionAdmin(admin.ModelAdmin):
    pass

admin.site.register(DeqTransaction, DeqTransactionAdmin)
