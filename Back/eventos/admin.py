from django.contrib import admin
from .models import *

# Lista de modelos 
models = [
    Usuario,
    Organizador,
    Administrador,
    Evento,
    Reserva,
    Pago,
    Resena
]

# Registro automático en el panel de administración
for model in models:
    admin.site.register(model)
