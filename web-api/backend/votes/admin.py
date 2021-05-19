from django.contrib import admin

from backend.votes.models import VoteBalance, VoteCast


class VoteBalanceAdmin(admin.ModelAdmin):
    pass


class VoteCastAdmin(admin.ModelAdmin):
    pass


admin.site.register(VoteBalance, VoteBalanceAdmin)
admin.site.register(VoteCast, VoteCastAdmin)
