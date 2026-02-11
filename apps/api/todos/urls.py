from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TodoViewSet, LabelViewSet, CommentViewSet

router = DefaultRouter()
router.register(r'todos', TodoViewSet)
router.register(r'labels', LabelViewSet, basename='label')
router.register(r'comments', CommentViewSet, basename='comment')

urlpatterns = [
    path('', include(router.urls)),
]
