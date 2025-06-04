from allauth.account.signals import user_signed_up
from django.dispatch import receiver
from django.shortcuts import redirect
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from django.dispatch import receiver
from django_rest_passwordreset.signals import reset_password_token_created
from django.core.mail import send_mail
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
        
        
@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    frontend_url = getattr(settings, 'FRONTEND_BASE_URL', 'http://localhost:4200')
    reset_url = f"{frontend_url}/resetear-password?token={reset_password_token.key}"

    send_mail(
        subject="🔐 Restablecer tu contraseña",
        message=f"Hola,\n\nPuedes restablecer tu contraseña usando este enlace:\n{reset_url}\n\nSi no lo has solicitado, ignora este mensaje.",
        from_email="no-reply@tuapp.com",
        recipient_list=[reset_password_token.user.email]
    )