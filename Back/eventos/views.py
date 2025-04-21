from datetime import datetime
from django.shortcuts import render
from rest_framework import viewsets
from .models import Evento, Reserva, Pago, Resena
from .serializers import EventoSerializer, ReservaSerializer, PagoSerializer, ResenaSerializer
from .permissions import EsOrganizador, EsUsuario,EsAdministrador,EsOrganizadorOAdministrador
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework import generics

# Vista para la página de inicio
def index(request):
    return render(request, 'index.html')

class EventoPrivadoViewSet(viewsets.ModelViewSet):
    queryset = Evento.objects.all()
    serializer_class = EventoSerializer
    permission_classes = [IsAuthenticated, EsOrganizador]

class EventoPublicoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Evento.objects.all()
    serializer_class = EventoSerializer
    permission_classes = [AllowAny]
    def get_queryset(self):
        return Evento.objects.filter(fecha__gte=datetime.now()).order_by('fecha')
    
class EventosDestacadosAPIView(generics.ListAPIView):
    queryset = Evento.objects.filter(destacado=True).order_by('-fecha')[:3]
    serializer_class = EventoSerializer
    permission_classes = [AllowAny]

class EventosProximosAPIView(generics.ListAPIView):
    queryset = Evento.objects.filter(fecha__gte=datetime.now()).order_by('fecha')[:5]
    serializer_class = EventoSerializer
    permission_classes = [AllowAny]


class ReservaViewSet(viewsets.ModelViewSet):
    queryset = Reserva.objects.all()
    serializer_class = ReservaSerializer
    permission_classes = [IsAuthenticated, EsUsuario]

class PagoViewSet(viewsets.ModelViewSet):
    queryset = Pago.objects.all()
    serializer_class = PagoSerializer

class ResenaViewSet(viewsets.ModelViewSet):
    queryset = Resena.objects.all()
    serializer_class = ResenaSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        elif self.action == 'destroy':
            return [IsAuthenticated(), EsAdministrador()] 
        elif self.action == 'create':
            return [IsAuthenticated(), EsUsuario()]  
        return [IsAuthenticated()]  

    def get_queryset(self):
        evento_id = self.request.query_params.get('evento')
        if evento_id:
            return Resena.objects.filter(evento__id=evento_id)
        return Resena.objects.all()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(usuario=request.user)

        return Response({
            'mensaje': '✅ ¡Gracias por tu reseña!',
            'resena': serializer.data
        }, status=status.HTTP_201_CREATED)
    
from rest_framework import viewsets
from .models import Usuario
from .serializers import UsuarioSerializer
from rest_framework.permissions import IsAuthenticated

from .permissions import EsAdministrador

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [IsAuthenticated, EsAdministrador]

    
    
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import Group
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.authtoken.models import Token
from .serializers import RegisterSerializer

from .models import Organizador, Usuario
from django.contrib.auth.models import Group
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer

from django.db import IntegrityError
from django.core.exceptions import ObjectDoesNotExist

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            try:
                user = serializer.save()

                # Si es organizador, crea el objeto Organizador
                if user.rol == Usuario.ORGANIZADOR:
                    Organizador.objects.get_or_create(usuario=user)

                # Asignar grupo según rol
                group_name = {
                    Usuario.USUARIO: "Usuarios",
                    Usuario.ORGANIZADOR: "Organizadores",
                    Usuario.ADMINISTRADOR: "Administradores"
                }.get(user.rol)

                if group_name:
                    try:
                        grupo = Group.objects.get(name=group_name)
                        user.groups.add(grupo)
                        print(f"✅ Usuario asignado al grupo '{group_name}'")
                    except ObjectDoesNotExist:
                        print(f"⚠️ El grupo '{group_name}' no existe.")

                # Crear token
                token, _ = Token.objects.get_or_create(user=user)

                return Response({
                    "mensaje": "Usuario registrado correctamente",
                    "token": token.key,
                    "usuario": {
                        "id": user.id,
                        "username": user.username,
                        "email": user.email,
                        "rol": user.get_rol_display() if user.rol else None,
                        "foto": request.build_absolute_uri(user.foto.url) if user.foto else None
                    }
                }, status=status.HTTP_201_CREATED)

            except IntegrityError:
                return Response({
                    "error": "Ya existe un usuario con ese nombre o email."
                }, status=status.HTTP_400_BAD_REQUEST)

        #  si no es válido
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny

from django.utils.text import slugify
from django.utils.crypto import get_random_string
from django.contrib.auth import login
from django.conf import settings

from .models import Usuario
from rest_framework.authtoken.models import Token

import requests
import jwt
from jwt import algorithms

class GoogleLoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get('credential')

        if not token:
            return Response({'error': 'No se recibió ningún token'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            #  Obtener cabecera y certs de Google
            header = jwt.get_unverified_header(token)
            kid = header['kid']

            certs_url = 'https://www.googleapis.com/oauth2/v3/certs'
            certs = requests.get(certs_url).json()

            # Buscar la clave pública correspondiente al kid
            public_key = None
            for key in certs['keys']:
                if key['kid'] == kid:
                    public_key = algorithms.RSAAlgorithm.from_jwk(key)
                    break

            if not public_key:
                return Response({'error': 'No se pudo verificar la firma'}, status=status.HTTP_400_BAD_REQUEST)

            #  Decodificar el token, sin verificar `nbf` (para evitar error de reloj)
            idinfo = jwt.decode(
                token,
                public_key,
                algorithms=['RS256'],
                audience='234430080055-5ddns29uj7qkk3me3v0at4rvm2qmnhla.apps.googleusercontent.com',
                options={"verify_nbf": False, "verify_iat": False}  
            )


            email = idinfo['email']
            name = idinfo.get('name', email.split('@')[0])

            print("📧 Email desde Google:", email)
            print("👤 Nombre desde Google:", name)

            base_username = slugify(name)
            username = base_username
            while Usuario.objects.filter(username=username).exists():
                username = f"{base_username}-{get_random_string(4)}"

            user, created = Usuario.objects.get_or_create(
                email=email,
                defaults={
                    'username': username,
                    'rol': None
                }
            )

            user.backend = 'django.contrib.auth.backends.ModelBackend'
            user.save()
            login(request, user)

            token_obj, _ = Token.objects.get_or_create(user=user)

            return Response({
                'message': 'Login exitoso',
                'nuevo_usuario': created,
                'token': token_obj.key,
                'usuario': {
                    'id': user.id,
                    'email': user.email,
                    'username': user.username,
                    'rol': user.get_rol_display() if user.rol else None,
                    'foto': request.build_absolute_uri(user.foto.url) if user.foto else None
                }
            }, status=status.HTTP_200_OK)

        except jwt.ExpiredSignatureError:
            return Response({'error': 'Token expirado'}, status=status.HTTP_400_BAD_REQUEST)
        except jwt.InvalidTokenError as e:
            print("❌ ERROR JWT:", e)
            return Response({'error': 'Token de Google inválido'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



from rest_framework.views import APIView
from rest_framework.response import Response

class SessionView(APIView):
    def get(self, request):
        user = request.user
        if user.is_authenticated:
            return Response({
                'authenticated': True,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'rol': user.get_rol_display(),  
                    'foto': request.build_absolute_uri(user.foto.url) if user.foto else None
                }
            })
        return Response({'authenticated': False})




from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import JSONParser
from .models import Usuario
from .serializers import UsuarioSerializer
from rest_framework.parsers import MultiPartParser, FormParser

from django.contrib.auth.models import Group

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()

        if request.user.id != instance.id:
            return Response({'detail': 'No tienes permiso para modificar este usuario.'}, status=403)

        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        # Asignar grupo si se actualizó el rol
        nuevo_rol = request.data.get('rol')
        if nuevo_rol:
            try:
                grupo = None
                if str(nuevo_rol) == '2':
                    grupo = Group.objects.get(name="Organizadores")
                elif str(nuevo_rol) == '3':
                    grupo = Group.objects.get(name="Usuarios")

                if grupo:
                    instance.groups.clear()
                    instance.groups.add(grupo)
                    print(f"✅ Usuario agregado al grupo {grupo.name}")

            except Group.DoesNotExist:
                print(f"⚠️ Grupo no encontrado para rol: {nuevo_rol}")

        return Response(serializer.data)


from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny

from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny

class LoginConTokenAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({'error': 'El usuario y la contraseña son obligatorios.'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, username=username, password=password)

        if user is None:
            return Response({'error': 'Credenciales incorrectas.'}, status=status.HTTP_401_UNAUTHORIZED)

        token, _ = Token.objects.get_or_create(user=user)

        return Response({
            'token': token.key,
            'usuario': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'rol': user.get_rol_display() if user.rol else None,
                'foto': request.build_absolute_uri(user.foto.url) if user.foto else None
            }
        }, status=status.HTTP_200_OK)


from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from django.db.models import Avg, Count
from .models import Resena

@api_view(['GET'])
@permission_classes([AllowAny])  
def resumen_reseñas(request, evento_id):
    stats = Resena.objects.filter(evento__id=evento_id).aggregate(
        promedio=Avg('puntuacion'),
        total=Count('id')
    )

    # Redondeamos el promedio a 1 decimal
    promedio = round(stats['promedio'] or 0, 1)
    total = stats['total']

    return Response({
        'promedio': promedio,
        'total': total
    })


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.core.mail import send_mail
from rest_framework import status

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.core.mail import send_mail
from django.conf import settings
from rest_framework import status

class ContactoAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            email = request.data.get('email')
            tipo = request.data.get('tipo')
            temas = request.data.get('temas', [])
            mensaje = request.data.get('mensaje')

            asunto = f"Nuevo mensaje de contacto - {tipo}"
            cuerpo = f"""
            📬 Nuevo mensaje de contacto:

            De: {email}
            Tipo: {tipo}
            Temas: {', '.join(temas)}
            Mensaje: 
            {mensaje}
            """

            send_mail(
                asunto,
                cuerpo,
                settings.DEFAULT_FROM_EMAIL,
                [settings.DEFAULT_FROM_EMAIL],
                fail_silently=False
            )

            return Response({"mensaje": "Correo enviado correctamente ✅"}, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"❌ Error al enviar correo: {e}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

