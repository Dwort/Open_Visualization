from django.urls import path
from premium.views import (
    CreatePortalSessionView,
    CreateCheckoutSessionView,
    WebhookView,
    LimitChecking,
    LimitChanging,
)


urlpatterns = [
    path('premium/buy/', CreateCheckoutSessionView.as_view()),
    path('premium/create-portal-session/', CreatePortalSessionView.as_view()),
    path('premium/webhook', WebhookView.as_view()),
    path('premium/limit-checking/', LimitChecking.as_view()),
    path('premium/limit-changing/', LimitChanging.as_view()),
]
