from django.contrib import admin

from backend.users.models import AlphaRequest, ResetPasswordCode, User, SignupCode


class AlphaRequestAdmin(admin.ModelAdmin):
    pass


class UserAdmin(admin.ModelAdmin):
    pass


class SignupCodeAdmin(admin.ModelAdmin):
    pass


class ResetPasswordCodeAdmin(admin.ModelAdmin):
    pass


admin.site.register(AlphaRequest, AlphaRequestAdmin)
admin.site.register(ResetPasswordCode, ResetPasswordCodeAdmin)
admin.site.register(User, UserAdmin)
admin.site.register(SignupCode, SignupCodeAdmin)
