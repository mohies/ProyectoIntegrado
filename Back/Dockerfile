FROM python:3.12

WORKDIR /app

# Copia todo el contenido del proyecto al contenedor
COPY . /app

# Instala dependencias
RUN pip install --upgrade pip && pip install -r requirements.txt

# Asegúrate de tener configurado Django antes de recolectar estáticos
RUN python manage.py migrate

# Carga datos iniciales (opcional pero útil si lo quieres hacer en build)
# RUN python manage.py loaddata datos_completos.json   ❌ Evita esto aquí (mejor en runtime)

# Recolecta estáticos (repetido pero no pasa nada)
RUN python manage.py collectstatic --noinput

# Copia y da permisos al entrypoint
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 8000

CMD ["/entrypoint.sh"]
