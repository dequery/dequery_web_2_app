from django.contrib import admin

from backend.transactions.models import DeqTransaction


class DeqTransactionAdmin(admin.ModelAdmin):
    list_display = ('id', 'status', 'amount', 'created')
    list_filter = ('status',)


admin.site.register(DeqTransaction, DeqTransactionAdmin)
