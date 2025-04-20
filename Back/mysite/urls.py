from django.contrib import admin
from django.urls import include, path

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
