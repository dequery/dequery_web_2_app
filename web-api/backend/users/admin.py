from django.contrib import admin

from backend.users.models import AlphaCode, AlphaRequest, ResetPasswordCode, User


class AlphaCodeAdmin(admin.ModelAdmin):
    pass


class AlphaRequestAdmin(admin.ModelAdmin):
    pass


class UserAdmin(admin.ModelAdmin):
    pass


class ResetPasswordCodeAdmin(admin.ModelAdmin):
    pass


admin.site.register(AlphaCode, AlphaCodeAdmin)
admin.site.register(AlphaRequest, AlphaRequestAdmin)
admin.site.register(ResetPasswordCode, ResetPasswordCodeAdmin)
admin.site.register(User, UserAdmin)
