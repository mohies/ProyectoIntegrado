from rest_framework.test import APITestCase
from django.urls import reverse
from eventos.models import Usuario, Organizador, Evento, Reserva, Pago, Resena, Reembolso, Payout
from rest_framework.authtoken.models import Token
from django.utils import timezone
from decimal import Decimal
from django.contrib.auth.models import Group


class BaseTestSetup(APITestCase):
    def setUp(self):
        self.user = Usuario.objects.create_user(username="cliente", password="1234", rol=Usuario.USUARIO)
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

        self.org_user = Usuario.objects.create_user(username="org", password="1234", rol=Usuario.ORGANIZADOR)
        self.org = Organizador.objects.create(usuario=self.org_user)

        self.evento = Evento.objects.create(
            titulo="Evento Test",
            descripcion="Desc",
            fecha=timezone.now() + timezone.timedelta(days=5),
            ubicacion="Madrid",
            precio=Decimal("50.00"),
            cupo_maximo=20,
            organizador=self.org
        )


class TestCompraReserva(BaseTestSetup):
    def test_compra_y_cancelacion(self):
        # 1. Compra
        payload = {
            "items": [{"evento_id": self.evento.id, "cantidad": 1}],
            "metodo_pago": "PayPal",
            "total_pago": "50.00",
            "direccion": "Calle 1",
            "ciudad": "Madrid",
            "notas": "Primera fila"
        }
        res = self.client.post(reverse("procesar-compra"), payload, format='json')
        self.assertEqual(res.status_code, 201)

        reserva = Reserva.objects.get(usuario=self.user, evento=self.evento)
        self.assertEqual(reserva.direccion, "Calle 1")
        self.assertEqual(reserva.estado, "activa")

        pago = Pago.objects.get(reserva=reserva)
        self.assertEqual(pago.total_pago, Decimal("50.00"))

        # 2. Cancelar reserva
        cancel_url = reverse("cancelar-reserva", args=[reserva.id])
        res = self.client.post(cancel_url, {"motivo": "Cambio de planes"})
        self.assertEqual(res.status_code, 200)

        reserva.refresh_from_db()
        self.assertEqual(reserva.estado, "cancelada")
        self.assertTrue(Reembolso.objects.filter(pago=pago).exists())



class TestResena(APITestCase):
    def setUp(self):

        grupo_usuarios, _ = Group.objects.get_or_create(name="Usuarios")

        # Crear usuario con rol 'USUARIO'
        self.user = Usuario.objects.create_user(
            username="cliente",
            password="1234",
            email="cliente@test.com",
            rol=3  
        )
        self.user.groups.add(grupo_usuarios)  
        self.user.save()

        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

        # Crear organizador y evento
        self.org_user = Usuario.objects.create_user(username="org", password="1234", rol=2)
        self.org = Organizador.objects.create(usuario=self.org_user)

        self.evento = Evento.objects.create(
            titulo="Evento Test",
            descripcion="Desc",
            fecha=timezone.now() + timezone.timedelta(days=5),
            ubicacion="Madrid",
            precio=Decimal("50.00"),
            cupo_maximo=20,
            organizador=self.org
        )

        # Crear reserva activa del usuario en el evento
        Reserva.objects.create(
            usuario=self.user,
            evento=self.evento,
            estado="activa"
        )

    def test_crear_resena(self):
        payload = {
            "evento": self.evento.id,
            "comentario": "Muy buen evento",
            "puntuacion": 5
        }

        url = reverse("resena-list")
        res = self.client.post(url, payload)

        print("🧪 RESPONSE:", res.status_code, res.data)
        self.assertEqual(res.status_code, 201)
        self.assertTrue(Resena.objects.filter(evento=self.evento).exists())



class TestAuthRegistro(APITestCase):
    def test_register_usuario(self):
        payload = {
            "username": "nuevo",
            "email": "nuevo@test.com",
            "password": "1234",
            "rol": 3  # Usuario
        }
        url = reverse("custom-register")
        res = self.client.post(url, payload)
        self.assertEqual(res.status_code, 201)
        self.assertIn("token", res.data)
        self.assertEqual(res.data["usuario"]["username"], "nuevo")


class TestEventosPublicos(BaseTestSetup):
    def test_listar_eventos_publicos(self):
        url = reverse("eventos-publicos-list")
        self.client.credentials()  # Quitar token
        res = self.client.get(url)
        self.assertEqual(res.status_code, 200)
        self.assertTrue(any(e["id"] == self.evento.id for e in res.data))
