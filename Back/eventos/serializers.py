from rest_framework import serializers
from .models import Evento, Reserva, Pago, Resena, Usuario,Organizador,Reembolso


class OrganizadorMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organizador
        fields = ['id', 'usuario']

class ReembolsoSerializer(serializers.ModelSerializer):
    usuario = serializers.StringRelatedField()  # Muestra el nombre de usuario
    estado = serializers.CharField()  # Asegura que el estado se incluya en el JSON

    class Meta:
        model = Reembolso
        fields = ['id', 'usuario', 'cantidad', 'motivo', 'fecha', 'estado']

# --- Serializers de modelos principales ---
class EventoSerializer(serializers.ModelSerializer):
    organizador = OrganizadorMiniSerializer(read_only=True)
    cupo = serializers.SerializerMethodField()
    oferta_activa = serializers.SerializerMethodField()
    precio_final = serializers.SerializerMethodField()

    class Meta:
        model = Evento
        fields = '__all__'
        read_only_fields = ['organizador']

    def create(self, validated_data):
        request = self.context['request']
        user = request.user

        try:
            organizador = Organizador.objects.get(usuario=user)
        except Organizador.DoesNotExist:
            raise serializers.ValidationError("Este usuario no es un organizador.")

        validated_data['organizador'] = organizador
        return super().create(validated_data)

    def get_cupo(self, obj):
        reservas_activas = Reserva.objects.filter(evento=obj, estado='activa').count()
        return max(obj.cupo_maximo - reservas_activas, 0)

    def get_oferta_activa(self, obj):
        return obj.oferta_activa

    def get_precio_final(self, obj):
        return str(round(obj.precio_con_descuento, 2))  # evita problemas de tipo en el JSON



class ReservaSerializer(serializers.ModelSerializer):
    evento = EventoSerializer()
    reembolso = serializers.SerializerMethodField()
    reembolso_estado = serializers.SerializerMethodField()
    reembolso_cantidad = serializers.SerializerMethodField()

    class Meta:
        model = Reserva
        fields = '__all__'  

    def get_reembolso(self, obj):
        try:
            reembolso = obj.pago.reembolso
            return ReembolsoSerializer(reembolso).data
        except:
            return None

    def get_reembolso_estado(self, obj):
        try:
            return obj.pago.reembolso.estado
        except:
            return None

    def get_reembolso_cantidad(self, obj):
        try:
            return str(obj.pago.reembolso.cantidad)
        except:
            return None



class PagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pago
        fields = '__all__'


class UsuarioMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'username', 'foto']
class EventoMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evento
        fields = ['id', 'titulo']

class ResenaSerializer(serializers.ModelSerializer):
    usuario = UsuarioMiniSerializer(read_only=True)  # Solo lectura, no se puede modificar desde el frontend
    evento = EventoMiniSerializer(read_only=True)  

    class Meta:
        model = Resena
        fields = '__all__'
        read_only_fields = ['usuario', 'fecha']

    def validate(self, data):
        return data

    def create(self, validated_data):
        validated_data['usuario'] = self.context['request'].user
        return super().create(validated_data)





# --- Serializer de Usuario general (lectura y escritura de rol) ---
class UsuarioSerializer(serializers.ModelSerializer):
    rol_display = serializers.CharField(source='get_rol_display', read_only=True)

    class Meta:
        model = Usuario
        fields = ['id', 'username', 'email', 'rol', 'rol_display', 'foto']


# --- Serializer de registro (solo para crear usuario) ---
ROLES_REGISTRO = (
    (Usuario.ORGANIZADOR, 'Organizador'),
    (Usuario.USUARIO, 'Usuario'),
)

from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Usuario

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    rol = serializers.ChoiceField(choices=ROLES_REGISTRO, default=Usuario.USUARIO)

    class Meta:
        model = Usuario
        fields = ['username', 'email', 'password', 'rol', 'foto']

    def validate_username(self, value):
        if Usuario.objects.filter(username=value).exists():
            raise serializers.ValidationError("Ya existe un usuario con este nombre.")
        return value

    def validate_email(self, value):
        if Usuario.objects.filter(email=value).exists():
            raise serializers.ValidationError("Ya existe un usuario con este email.")
        return value

    def create(self, validated_data):
        foto = validated_data.get('foto')

        if not foto:
            validated_data['foto'] = 'perfiles/default-user.png'

        return Usuario.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            rol=validated_data['rol'],
            foto=validated_data['foto']
        )





from rest_framework import serializers
from .models import Payout

class PayoutSerializer(serializers.ModelSerializer):
    organizador = serializers.SerializerMethodField()

    class Meta:
        model = Payout
        fields = ['id', 'organizador', 'email', 'cantidad', 'estado', 'fecha_creacion', 'nota']

    def get_organizador(self, obj):
        if obj.organizador and obj.organizador.usuario:
            return {
                'id': obj.organizador.id,
                'usuario': {
                    'id': obj.organizador.usuario.id,
                    'username': obj.organizador.usuario.username
                }
            }
        return None
