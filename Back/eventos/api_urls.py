from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter
from .views import (
    ContactoAPIView,
    EventoPrivadoViewSet,
    EventoPublicoViewSet,
    EventosDestacadosAPIView,
    EventosProximosAPIView,
    GoogleLoginAPIView,
    LoginConTokenAPIView,
    PayoutViewSet,
    ReservaViewSet,
    PagoViewSet,
    ResenaViewSet,
    SessionView,
    UsuarioViewSet,
    RegisterView,
    resumen_reseñas,
    procesar_compra
)
from django.conf import settings
from django.conf.urls.static import static

#  Rutas públicas (GET)
router_publico = DefaultRouter()
router_publico.register(r'eventos', EventoPublicoViewSet, basename='eventos-publicos')

#  Rutas privadas (CRUD organizador)
router_privado = DefaultRouter()
router_privado.register(r'gestion-eventos', EventoPrivadoViewSet, basename='eventos-privados')
router_privado.register(r'reservas', ReservaViewSet)
router_privado.register(r'pagos', PagoViewSet)
router_privado.register(r'resenas', ResenaViewSet)
router_privado.register(r'usuarios', UsuarioViewSet)
router_privado.register(r'payouts', PayoutViewSet, basename='payouts')  # 👈 registra payouts

urlpatterns = [
    path('', include(router_publico.urls)),      # Público (ver eventos)
    path('', include(router_privado.urls)),      #  CRUD autenticado

    path('custom-register/', RegisterView.as_view(), name='custom-register'),
    path('session/', SessionView.as_view()),
    path('google-login/', GoogleLoginAPIView.as_view(), name='google_login'),
    path('token-login/', LoginConTokenAPIView.as_view(), name='token-login'),
    
    
    
    path('eventos-destacados/', EventosDestacadosAPIView.as_view(), name='eventos-destacados'),
    path('eventos-proximos/', EventosProximosAPIView.as_view(), name='eventos-proximos'),
    path('eventos/<int:evento_id>/reseñas-resumen/', resumen_reseñas, name='resumen-reseñas'),

    path('contacto/', ContactoAPIView.as_view(), name='contacto-api'),
    path('procesar-compra/', procesar_compra, name='procesar-compra'),
    path('eventos-con-oferta/', views.eventos_con_oferta, name='eventos-con-oferta'),

    path('mis-reservas/', views.mis_reservas, name='mis-reservas'),
    path('cancelar-reserva/<int:reserva_id>/', views.cancelar_reserva, name='cancelar-reserva'),
    path('admin/reembolsos/', views.listar_reembolsos, name='listar-reembolsos'),
    path('admin/reembolsos/<int:reembolso_id>/estado/', views.actualizar_estado_reembolso),

    path('mis-eventos/', views.mis_eventos, name='mis-eventos'),
    path('reservas-por-evento/<int:evento_id>/', views.reservas_por_evento, name='reservas-por-evento'),
    path('organizador/resumen/', views.resumen_organizador, name='resumen-organizador'),
    path('organizador/payouts/', views.mis_payouts, name='mis-payouts'),


] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
