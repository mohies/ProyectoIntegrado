# Generated by Django 5.1.2 on 2025-04-06 14:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('eventos', '0004_alter_usuario_rol'),
    ]

    operations = [
        migrations.AddField(
            model_name='evento',
            name='destacado',
            field=models.BooleanField(default=False),
        ),
    ]
