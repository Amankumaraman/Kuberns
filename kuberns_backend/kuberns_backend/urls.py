from django.contrib import admin
from django.urls import path
from webapps.views import (
    WebAppListCreateView,
    WebAppDetailView,
    DeployAppView,
    DeploymentLogsView
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/webapps/', WebAppListCreateView.as_view(), name='webapp-list'),
    path('api/webapps/<int:pk>/', WebAppDetailView.as_view(), name='webapp-detail'),
    path('api/deployments/', DeployAppView.as_view(), name='deploy-app'),
    path('api/deployments/<int:instance_id>/logs/', DeploymentLogsView.as_view(), name='deployment-logs'),
]