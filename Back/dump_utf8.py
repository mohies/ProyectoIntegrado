from django.core.management import call_command
import os
import django

# Ajusta el nombre del módulo settings según tu proyecto
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mysite.settings")

django.setup()

with open('datos_completos.json', 'w', encoding='utf-8') as f:
    call_command(
        'dumpdata',
        indent=2,
        exclude=[
            'auth.permission',
            'contenttypes',
            'admin.logentry',
            'sessions.session',
            'authtoken.token',      # Excluir tokens para evitar duplicados
        ],
        stdout=f
    )
