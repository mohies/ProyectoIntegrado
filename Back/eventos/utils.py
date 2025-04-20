import requests
from datetime import datetime
from .models import Evento, Organizador

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



from django.contrib.auth.models import Group
from .models import Usuario

def asignar_grupo_por_rol(usuario: Usuario):
    rol = usuario.rol

    grupo_nombre = None
    if rol == Usuario.ADMIN:
        grupo_nombre = 'Administradores'
    elif rol == Usuario.ORGANIZADOR:
        grupo_nombre = 'Organizadores'
    elif rol == Usuario.USUARIO:
        grupo_nombre = 'Usuarios'

    if grupo_nombre:
        grupo, creado = Group.objects.get_or_create(name=grupo_nombre)
        usuario.groups.clear()  #  Solo estará en un grupo
        usuario.groups.add(grupo)
        print(f"✅ Usuario '{usuario.username}' asignado al grupo '{grupo_nombre}'")
