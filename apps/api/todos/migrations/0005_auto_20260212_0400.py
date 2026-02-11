from django.db import migrations

def populate_status(apps, schema_editor):
    Todo = apps.get_model('todos', 'Todo')
    for todo in Todo.objects.all():
        if todo.is_completed:
            todo.status = 'DONE'
        else:
            todo.status = 'TODO'
        todo.save()

class Migration(migrations.Migration):

    dependencies = [
        ('todos', '0004_todo_status'),
    ]

    operations = [
        migrations.RunPython(populate_status),
    ]
