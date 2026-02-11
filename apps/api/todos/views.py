from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import F
from django_filters.rest_framework import DjangoFilterBackend
from .models import Todo, Label, Comment
from .serializers import TodoSerializer, LabelSerializer, CommentSerializer

class LabelViewSet(viewsets.ModelViewSet):
    queryset = Label.objects.all()
    serializer_class = LabelSerializer

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all().order_by('-created_at')
    serializer_class = CommentSerializer
    filterset_fields = ['todo']

from django.db.models import F, Count

# ...

class TodoViewSet(viewsets.ModelViewSet):
    queryset = Todo.objects.all().annotate(comments_count=Count('comments')).order_by('order', '-priority', 'due_date', '-created_at')
    serializer_class = TodoSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_completed', 'status', 'priority', 'labels']
    search_fields = ['title', 'description']
    ordering_fields = ['priority', 'due_date', 'created_at', 'order']

    @action(detail=True, methods=['patch'])
    def reorder(self, request, pk=None):
        todo = self.get_object()
        new_status = request.data.get('status', todo.status)
        new_order = request.data.get('order', todo.order)

        # Shift items if moving to a new position in the same or different list
        if new_status != todo.status or new_order != todo.order:
            # Shift items in the new list down to make space
            Todo.objects.filter(
                status=new_status,
                order__gte=new_order
            ).update(order=F('order') + 1)
            
            todo.status = new_status
            todo.order = new_order
            todo.save()

        return Response(TodoSerializer(todo).data)
