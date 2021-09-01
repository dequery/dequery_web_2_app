from django.urls import include, path
from django.contrib import admin
from rest_framework import routers
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


from backend.answers.views import AnswerCreate, AnswerDetail, AnswerList
from backend.notifications.views import RequestResetPassword
from backend.prompts.views import PromptCreate, PromptDetail, PromptList, PromptWatchCreate, PromptWatchDelete
from backend.transactions.views import DeqTransactionCreate, DeqTransacionList
from backend.users.views import AlphaRequestCreate, UserCreate, UserUpdate, UserDetail, RetrieveUserFromToken, ResetPassword
from backend.votes.views import VoteBalanceDetail, VoteBalanceList, VoteCastCreate


router = routers.DefaultRouter()


urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('api/alpharequests/', AlphaRequestCreate.as_view(), name='alpha_request_create'),
    path('api/answers/', AnswerList.as_view(), name='answer_list'),
    path('api/answers/<int:pk>/', AnswerDetail.as_view(), name='answer_detail'),
    path('api/answers/create/', AnswerCreate.as_view(), name='answer_create'),
    path('api/notifications/reset-password/', RequestResetPassword.as_view(), name='request_reset_password'),
    path('api/prompts/', PromptList.as_view(), name='prompt_list'),
    path('api/prompts/<int:pk>/', PromptDetail.as_view(), name='prompt_detail'),
    path('api/prompts/create/', PromptCreate.as_view(), name='prompt_create'),
    path('api/prompt-watches/create/', PromptWatchCreate.as_view(), name='prompt_watch_create'),
    path('api/prompt-watches/delete/<int:pk>/', PromptWatchDelete.as_view(), name='prompt_watch_delete'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/transactions/', DeqTransacionList.as_view(), name='transaction_list'),
    path('api/transactions/create/', DeqTransactionCreate.as_view(), name='transaction_create'),
    path('api/users/create/', UserCreate.as_view(), name='user_create'),
    path('api/users/retrieve/', RetrieveUserFromToken.as_view(), name='user_retrieve_from_token'),
    path('api/users/update/<int:pk>/', UserUpdate.as_view(), name='user_update'),
    path('api/users/reset-password/', ResetPassword.as_view(), name='user_reset_password'),
    path('api/users/<int:pk>/', UserDetail.as_view(), name='user_detail'),
    path('api/vote-casts/create/', VoteCastCreate.as_view(), name='vote_cast_create'),
    path('api/vote-balances/', VoteBalanceList.as_view(), name='vote_balance_list'),
    path('api/vote-balances/<int:pk>/', VoteBalanceDetail.as_view(), name='vote_balance_detail'),
    path('bridge/', admin.site.urls),
]
