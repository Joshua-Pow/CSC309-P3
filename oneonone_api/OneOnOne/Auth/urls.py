from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterUserAPIView, CustomTokenObtainPairView

urlpatterns = [
    path("login/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("register/", RegisterUserAPIView.as_view(), name="register"),
]
