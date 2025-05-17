from allauth.account.signals import user_signed_up
from django.dispatch import receiver
from django.shortcuts import redirect
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token

# @receiver(user_signed_up)
# def asignar_rol_inicial(sender, request, user, **kwargs):
#     # Guardamos que necesita elegir un rol
#     user.rol = None  # o Usuario.USUARIO como valor por defecto
#     user.save()
    
# Crea automáticamente un token de autenticación para cada usuario nuevo.
# Este token se utiliza para autenticación basada en token en la API (DRF TokenAuthentication).
# Se ejecuta justo después de que un nuevo usuario haya sido guardado en la base de datos.
    
@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def crear_token_usuario(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.get_or_create(user=instance)