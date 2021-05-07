from django.urls import include, path
from django.contrib import admin
from rest_framework import routers
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


from backend.users.views import UserCreateRetrieve
from backend.prompts.views import PromptCreate

router = routers.DefaultRouter()

urlpatterns = [
    path('', include(router.urls)),
    path('api/users/', UserCreateRetrieve.as_view(), name='users'),
    path('api/prompts/create/', PromptCreate.as_view(), name='prompts'),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('bridge/', admin.site.urls),
]
