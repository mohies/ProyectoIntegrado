from rest_framework.test import APITestCase
from django.urls import reverse
from eventos.models import Usuario, Organizador, Evento, Reserva, Pago
from rest_framework.authtoken.models import Token
from django.utils import timezone
from decimal import Decimal

class CompraTestCase(APITestCase):

    def setUp(self):
         # Crea un usuario con rol 'USUARIO' (comprador)

        self.usuario = Usuario.objects.create_user(username="comprador", email="compra@test.com", password="1234", rol=Usuario.USUARIO)
                # Crea un token de autenticación para el usuario

        self.token = Token.objects.create(user=self.usuario)
        # Crea un usuario con rol 'ORGANIZADOR'

        self.organizador_user = Usuario.objects.create_user(username="org", email="org@test.com", password="1234", rol=Usuario.ORGANIZADOR)
                # Registra al usuario organizador como objeto Organizador

        self.organizador = Organizador.objects.create(usuario=self.organizador_user)
        # Crea un evento futuro asociado al organizador

        self.evento = Evento.objects.create(
            titulo="Concierto",
            descripcion="Un buen evento",
            fecha=timezone.now() + timezone.timedelta(days=10),
            ubicacion="Barcelona",
            precio=Decimal("20.00"),
            cupo_maximo=100,
            organizador=self.organizador
        )
                # Establece el token de autenticación para las peticiones del cliente

        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

    def test_procesar_compra_guarda_direccion_y_ciudad(self):
                # Obtiene la URL del endpoint que procesa las compras

        url = reverse("procesar-compra")  
            #Si el endpoint no está definido, puedes usar la URL directa
        payload = {
            "items": [{
                "evento_id": self.evento.id,
                "cantidad": 1,
                "precio": "20.00"
            }],
            "metodo_pago": "PayPal",
            "total_pago": "20.00",
            "direccion": "Calle Falsa 123",
            "ciudad": "Madrid",
            "notas": "Por favor asiento adelante"
        }

        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, 201)

        reserva = Reserva.objects.get(usuario=self.usuario, evento=self.evento)

        self.assertEqual(reserva.direccion, "Calle Falsa 123")
        self.assertEqual(reserva.ciudad, "Madrid")
        self.assertEqual(reserva.notas, "Por favor asiento adelante")
        self.assertEqual(reserva.estado, "activa")

        pago = Pago.objects.get(reserva=reserva)
        self.assertEqual(pago.total_pago, Decimal("20.00"))
