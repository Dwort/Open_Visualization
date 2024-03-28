from django.urls import path
from premium.views import (
    # GetPremiumAPIView,
    CreatePortalSessionView,
    CreateCheckoutSessionView,
    WebhookView,
)


urlpatterns = [
    path('premium/buy/', CreateCheckoutSessionView.as_view()),
    # path('premium/info/', GetPremiumAPIView.as_view()),
    path('premium/create-portal-session/', CreatePortalSessionView.as_view()),
    path('premium/webhook', WebhookView.as_view()),
]
