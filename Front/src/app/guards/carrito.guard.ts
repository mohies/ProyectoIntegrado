import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CarritoService } from '../services/carrito.service';

@Injectable({
  providedIn: 'root'
})
export class CarritoGuard implements CanActivate {

  constructor(private router: Router, private carritoService: CarritoService) {}
// Este guard evita que el usuario acceda a la página de compra si:
// - No ha iniciado sesión (no hay token).
// - El carrito está vacío.
// En ese caso, lo redirige al carrito con un mensaje de error en los query params.
  canActivate(): boolean {
    const token = localStorage.getItem('token');
    const carritoVacio = this.carritoService.obtenerCarrito().length === 0;

    if (!token || carritoVacio) {
      this.router.navigate(['/carrito'], {
        queryParams: { error: 'empty' }
      });
      return false;
    }

    return true;
  }
}
