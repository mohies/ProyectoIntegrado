from rest_framework import serializers
from .models import Evento, Reserva, Pago, Resena, Usuario,Organizador


# --- Serializers de modelos principales ---
class EventoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evento
        fields = '__all__'
        read_only_fields = ['organizador']  #  para no pedirlo desde el frontend

    def create(self, validated_data):
        request = self.context['request']
        user = request.user

        try:
            organizador = Organizador.objects.get(usuario=user)
        except Organizador.DoesNotExist:
            raise serializers.ValidationError("Este usuario no es un organizador.")

        validated_data['organizador'] = organizador
        return super().create(validated_data)
    
    def get_promedio_reseñas(self, obj):
        promedio = obj.resena_set.aggregate(avg=Avg('puntuacion'))['avg']
        return round(promedio, 1) if promedio else 0



class ReservaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reserva
        fields = '__all__'

class PagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pago
        fields = '__all__'

# serializers.py
class UsuarioMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'username', 'foto']

class ResenaSerializer(serializers.ModelSerializer):
    usuario = UsuarioMiniSerializer(read_only=True)  # 👈 importante: no dejar solo el id

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





