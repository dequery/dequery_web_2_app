from django.contrib import admin

from backend.users.models import AlphaRequest, User


class AlphaRequestAdmin(admin.ModelAdmin):
    pass


class UserAdmin(admin.ModelAdmin):
    pass


admin.site.register(AlphaRequest, AlphaRequestAdmin)
admin.site.register(User, UserAdmin)
