
from django.core.management import call_command
import os
import django

# Script de exportación para generar un volcado completo de la base de datos en formato JSON,
# excluyendo modelos que no son relevantes para restauración personalizada, como permisos, logs y sesiones.
# Inicializa el entorno Django y usa `call_command('dumpdata')` para generar `datos_completos.json`.
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mysite.settings")

# Inicializa Django
django.setup()

# Dump con exclusiones
with open('datos_completos.json', 'w', encoding='utf-8') as f:
    call_command(
        'dumpdata',
        indent=2,
        exclude=['auth.permission', 'contenttypes', 'admin.logentry', 'sessions.session'],
        stdout=f
    )
