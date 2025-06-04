import requests
from datetime import datetime
from .models import Evento, Organizador
import os
from django.core.files import File
from django.conf import settings
# Función para importar eventos desde la API pública de Ticketmaster.
# Recorre las páginas de resultados, extrae los datos necesarios (título, fecha, imagen, precio, etc.)
# y los guarda como nuevos objetos de modelo Evento asociados al primer organizador encontrado.
def importar_eventos_ticketmaster():
    base_url = "https://app.ticketmaster.com/discovery/v2/events"
    params = {
        "apikey": "vwKSfOaSpRguo8SYoJ3xUzuAEG8DDazd",  #  API Key real
        "countryCode": "ES",
        "size": 200
    }

    organizador = Organizador.objects.first()  #  filtrar por email o id si necesitamos uno concreto
    if not organizador:
        print("⚠️ No se encontró ningún organizador. Crea uno primero.")
        return

    page = 0

    while True:
        params["page"] = page
        response = requests.get(base_url, params=params)
        data = response.json()

        eventos = data.get('_embedded', {}).get('events', [])
        if not eventos:
            print("✅ Importación finalizada.")
            break

        for e in eventos:
            titulo = e.get('name', 'Sin título')
            descripcion = e.get('info', 'Sin descripción')
            fecha_str = e['dates']['start']['localDate'] + 'T' + e['dates']['start'].get('localTime', '00:00:00')
            fecha = datetime.fromisoformat(fecha_str)

            # Ubicación: lugar + ciudad
            venue = e['_embedded']['venues'][0]
            lugar = venue.get('name', '')
            ciudad = venue.get('city', {}).get('name', '')
            ubicacion = f"{lugar} - {ciudad}"

            # Imagen principal
            imagen = e.get('images', [{}])[0].get('url', '')

            # Precio mínimo (si está disponible)
            precio = e.get('priceRanges', [{}])[0].get('min', 0)

            # Crear evento
            Evento.objects.create(
                titulo=titulo,
                descripcion=descripcion,
                fecha=fecha,
                ubicacion=ubicacion,
                imagen=imagen,
                precio=precio,
                cupo_maximo=100,  # valor fijo configurable
                organizador=organizador
            )

        print(f"✅ Página {page + 1} importada ({len(eventos)} eventos).")
        page += 1



def asignar_foto_por_defecto(user):
    ruta = os.path.join(settings.MEDIA_ROOT, 'perfiles', 'default-user.png')
    if os.path.exists(ruta):
        with open(ruta, 'rb') as f:
            user.foto.save('default-user.png', File(f), save=True)