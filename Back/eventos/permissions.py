from rest_framework.permissions import BasePermission
# Permiso que permite acceso solo a los usuarios del grupo "Administradores"

class EsAdministrador(BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name='Administradores').exists()


# Permiso que permite acceso solo a los usuarios del grupo "Organizadores"

class EsOrganizador(BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name='Organizadores').exists()
# Permiso que permite acceso solo a los usuarios del grupo "Usuarios"

class EsUsuario(BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name='Usuarios').exists()
# Permiso que permite acceso tanto a organizadores como a administradores

class EsOrganizadorOAdministrador(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and (
                request.user.groups.filter(name='Organizadores').exists() or
                request.user.groups.filter(name='Administradores').exists()
            )
        )
