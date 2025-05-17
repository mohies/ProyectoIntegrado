#!/bin/bash

echo "✅ Aplicando migraciones..."
python manage.py migrate

echo "🕵️‍♂️ Comprobando si hay datos existentes..."
HAS_USERS=$(python manage.py shell -c "from django.contrib.auth import get_user_model; exit(1) if get_user_model().objects.exists() else exit(0)")

if [ $? -eq 0 ]; then
    echo "📥 Base de datos vacía, cargando datos iniciales..."
    if [ -f "./datos_completos.json" ]; then
        python manage.py loaddata datos_completos.json
    else
        echo "⚠️  No se encontró datos_completos.json"
    fi
else
    echo "✅ Ya hay datos cargados, se omite loaddata"
fi

echo "📦 Recolectando archivos estáticos..."
python manage.py collectstatic --noinput

echo "🚀 Iniciando Gunicorn..."
exec gunicorn mysite.wsgi:application --bind 0.0.0.0:8000
