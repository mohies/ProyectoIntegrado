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
    Resena,
]

# Registro automático en el panel de administración
for model in models:
    admin.site.register(model)


@admin.register(Payout)
class PayoutAdmin(admin.ModelAdmin):
    list_display = ('id', 'organizador', 'email', 'cantidad', 'estado', 'fecha_creacion', 'nota')
    list_filter = ('estado',)
    search_fields = ('organizador__usuario__username', 'email')
    actions = ['marcar_como_pagado']

    @admin.action(description='✅ Marcar payouts seleccionados como pagados')
    def marcar_como_pagado(self, request, queryset):
        updated = queryset.update(estado='pagado')
        self.message_user(request, f'{updated} payout(s) marcados como pagados correctamente ✅')


@admin.register(Reembolso)
class ReembolsoAdmin(admin.ModelAdmin):
    list_display = ('id', 'usuario', 'cantidad', 'estado', 'fecha', 'motivo')
    list_filter = ('estado',)
    search_fields = ('usuario__username', 'usuario__email', 'motivo')
    actions = ['aprobar_reembolsos', 'rechazar_reembolsos']

    @admin.action(description="✅ Aprobar reembolsos seleccionados")
    def aprobar_reembolsos(self, request, queryset):
        updated = queryset.update(estado='aprobado')
        self.message_user(request, f"{updated} reembolsos aprobados.")

    @admin.action(description="❌ Rechazar reembolsos seleccionados")
    def rechazar_reembolsos(self, request, queryset):
        updated = queryset.update(estado='rechazado')
        self.message_user(request, f"{updated} reembolsos rechazados.")
