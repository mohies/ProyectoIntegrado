from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve
from django.urls import re_path
urlpatterns = [
    path('admin/', admin.site.urls),
    path('__debug__/', include('debug_toolbar.urls')),

    path('', include('eventos.urls')),
    path('api/v1/',include("eventos.api_urls")),
    
    #  Autenticación básica
    path('api/v1/', include('dj_rest_auth.urls')),




    #  Google login directo (sin prefijo)
    path('accounts/', include('allauth.urls')),
    

  
]
# Archivos estáticos
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Archivos MEDIA si DEBUG = False
if not settings.DEBUG:
    urlpatterns += [
        re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
    ]