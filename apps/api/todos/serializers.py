from rest_framework import serializers
from .models import Todo, Label, Comment

class LabelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Label
        fields = '__all__'

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'

class TodoSerializer(serializers.ModelSerializer):
    labels = LabelSerializer(many=True, read_only=True)
    label_ids = serializers.PrimaryKeyRelatedField(
        many=True, write_only=True, queryset=Label.objects.all(), source='labels', required=False
    )
    latest_comments = serializers.SerializerMethodField()

    def get_latest_comments(self, obj):
        comments = obj.comments.all().order_by('-created_at')[:3]
        return CommentSerializer(comments, many=True).data
    # comments = CommentSerializer(many=True, read_only=True) # Optional: Include comments in Todo detail if needed

    comments_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Todo
        fields = '__all__'
