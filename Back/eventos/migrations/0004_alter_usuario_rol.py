# Generated by Django 5.1.2 on 2025-03-30 16:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('eventos', '0003_usuario_foto'),
    ]

    operations = [
        migrations.AlterField(
            model_name='usuario',
            name='rol',
            field=models.PositiveSmallIntegerField(blank=True, choices=[(1, 'Administrador'), (2, 'Organizador'), (3, 'Usuario')], null=True),
        ),
    ]
