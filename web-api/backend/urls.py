from django.urls import include, path
from django.contrib import admin
from rest_framework import routers
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


from backend.answers.views import AnswerCreate, AnswerDetail, AnswerList
from backend.prompts.views import PromptCreate, PromptDetail, PromptList
from backend.users.views import AlphaRequestCreate, UserCreate, UserDetail

router = routers.DefaultRouter()

urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('api/alpharequests/', AlphaRequestCreate.as_view(), name='alpha_request_create'),
    path('api/answers/', AnswerList.as_view(), name='answer_list'),
    path('api/answers/<int:pk>/', AnswerList.as_view(), name='answer_detail'),
    path('api/answers/create/', AnswerCreate.as_view(), name='answer_create'),
    path('api/prompts/', PromptList.as_view(), name='prompt_list'),
    path('api/prompts/<int:pk>/', PromptDetail.as_view(), name='prompt_detail'),
    path('api/prompts/create/', PromptCreate.as_view(), name='prompt_create'),
    path('api/users/create/', UserCreate.as_view(), name='user_create'),
    path('api/users/<int:pk>/', UserDetail.as_view(), name='user_detail'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('bridge/', admin.site.urls),
]
