from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from decimal import Decimal

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
    paypal_email = models.EmailField(blank=True, null=True)  


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
    imagen = models.URLField(blank=True, null=True)
    destacado = models.BooleanField(default=False)
    descuento = models.DecimalField(
        max_digits=5, decimal_places=2, blank=True, null=True,
        help_text="Porcentaje de descuento, ejemplo 20 para 20%")

    @property
    def oferta_activa(self):
        dias_para_evento = (self.fecha - timezone.now()).days
        return dias_para_evento <= 5 and self.descuento  # solo si hay descuento



    @property
    def precio_con_descuento(self):
        if self.oferta_activa and self.descuento:
            descuento_decimal = Decimal(self.descuento) / Decimal(100)
            return self.precio * (Decimal('1.0') - descuento_decimal)
        return self.precio


    def __str__(self):
        return self.titulo




class Reserva(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    evento = models.ForeignKey(Evento, on_delete=models.CASCADE)
    fecha_reserva = models.DateTimeField(auto_now_add=True)
    estado = models.CharField(max_length=20, choices=[('activa', 'Activa'), ('cancelada', 'Cancelada')], default='activa')
    motivo_cancelacion = models.TextField(blank=True, null=True)
    fecha_cancelacion = models.DateTimeField(blank=True, null=True)

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


class Payout(models.Model):
    ESTADO_CHOICES = (
        ('pendiente', 'Pendiente'),
        ('pagado', 'Pagado'),
    )

    organizador = models.ForeignKey(Organizador, on_delete=models.CASCADE)
    email = models.EmailField()
    cantidad = models.DecimalField(max_digits=8, decimal_places=2)
    estado = models.CharField(max_length=10, choices=ESTADO_CHOICES, default='pendiente')
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    nota = models.TextField(blank=True, null=True)

    def __str__(self):
        return f'Payout #{self.id} - {self.organizador}'
    
    
    
class Reembolso(models.Model):
    ESTADOS = (
        ('pendiente', 'Pendiente'),
        ('aprobado', 'Aprobado'),
        ('rechazado', 'Rechazado'),
        ('parcial', 'Parcial'),
    )

    pago = models.OneToOneField(Pago, on_delete=models.CASCADE, related_name='reembolso')
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    cantidad = models.DecimalField(max_digits=8, decimal_places=2)
    fecha = models.DateTimeField(auto_now_add=True)
    motivo = models.TextField(blank=True, null=True)
    estado = models.CharField(max_length=20, choices=ESTADOS, default='pendiente')  

    def __str__(self):
        return f"Reembolso de {self.cantidad}€ a {self.usuario.username} - {self.estado}"


