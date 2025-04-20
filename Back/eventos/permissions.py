from rest_framework.permissions import BasePermission

class EsAdministrador(BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name='Administradores').exists()

class EsOrganizador(BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name='Organizadores').exists()

class EsUsuario(BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name='Usuarios').exists()

class EsOrganizadorOAdministrador(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and (
                request.user.groups.filter(name='Organizadores').exists() or
                request.user.groups.filter(name='Administradores').exists()
            )
        )
