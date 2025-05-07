"""
URL configuration for catbot_django project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from core import views


schema_view = get_schema_view(openapi.Info(
      title="Lynx CatBot API",
      default_version='v1',
      description="API documentation for Lynx CatBot",
      contact=openapi.Contact(email="epueb1@outlook.com"),
   ),
   public=True,
   permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    path('', views.home.as_view(), name='home'),
    path('admin/', admin.site.urls),
    path('fixed-content/', views.FixedContentList.as_view(), name='fixedcontent-list'),
    path('fixed-content/<int:pk>/', views.FixedContentDetail.as_view(), name='fixed-content-detail'), 
    path('suggestions/', views.GetSuggestionsView.as_view(), name="get_suggestions"),
    path("suggestion-usage/", views.TrackSuggestionUsageView.as_view(),name="track_suggestion_usage"),
    path('gemini-response/', views.GeminiResponseView.as_view(), name='gemini_response'),
    re_path(r'^swagger/$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    re_path(r'^redoc/$', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]

