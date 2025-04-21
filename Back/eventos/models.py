from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone


class Usuario(AbstractUser):
    ADMINISTRADOR = 1
    ORGANIZADOR = 2
    USUARIO = 3

    ROLES = (
        (ADMINISTRADOR, 'Administrador'),
        (ORGANIZADOR, 'Organizador'),
        (USUARIO, 'Usuario'),
    )

    rol = models.PositiveSmallIntegerField(choices=ROLES, null=True, blank=True)
    foto = models.ImageField(upload_to='perfiles/', blank=True, null=True)




class Organizador(models.Model):
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE)
    datos_adicionales = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Organizador: {self.usuario.email}"




class Administrador(models.Model):
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE)

    def __str__(self):
        return f"Admin: {self.usuario.email}"




class Evento(models.Model):
    titulo = models.CharField(max_length=100)
    descripcion = models.TextField()
    fecha = models.DateTimeField()
    ubicacion = models.CharField(max_length=200)
    precio = models.DecimalField(max_digits=6, decimal_places=2)
    cupo_maximo = models.PositiveIntegerField()
    organizador = models.ForeignKey(Organizador, on_delete=models.CASCADE)
    imagen = models.URLField(blank=True, null=True)  # para guardar la URL de la imagen del evento
    destacado = models.BooleanField(default=False)

    def __str__(self):
        return self.titulo




class Reserva(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    evento = models.ForeignKey(Evento, on_delete=models.CASCADE)
    fecha_reserva = models.DateTimeField(auto_now_add=True)
    estado = models.CharField(max_length=20, choices=[('activa', 'Activa'), ('cancelada', 'Cancelada')], default='activa')

    def __str__(self):
        return f"{self.usuario.email} → {self.evento.titulo}"


class Pago(models.Model):
    reserva = models.OneToOneField(Reserva, on_delete=models.CASCADE)
    fecha_pago = models.DateTimeField(auto_now_add=True)
    total_pago = models.DecimalField(max_digits=6, decimal_places=2)
    metodo_pago = models.CharField(max_length=30, default="PayPal")
    estado = models.CharField(max_length=20, choices=[('completado', 'Completado'), ('pendiente', 'Pendiente'), ('fallido', 'Fallido')])

    def __str__(self):
        return f"Pago de {self.reserva.usuario.email} - {self.total_pago}€"




class Resena(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    evento = models.ForeignKey(Evento, on_delete=models.CASCADE)
    puntuacion = models.IntegerField()
    comentario = models.TextField(blank=True)
    fecha = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.usuario.email} - {self.evento.titulo} ({self.puntuacion}/5)"  
