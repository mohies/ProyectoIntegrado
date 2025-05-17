import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}
// Este guard se asegura de que el usuario esté autenticado antes de acceder a una ruta protegida.
// Si no hay token en localStorage, redirige al login y muestra un mensaje de advertencia.
// Devuelve true solo si el usuario tiene un token válido (es decir, ha iniciado sesión).
  canActivate(): boolean {
    const token = localStorage.getItem('token');
  
    if (!token) {
      localStorage.setItem('loginMessage', '⚠️ Debes iniciar sesión para finalizar la compra.');
      this.router.navigate(['/login']);
      return false;
    }
  
    return true;
  }
  
}
