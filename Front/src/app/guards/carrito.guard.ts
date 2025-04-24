import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CarritoService } from '../services/carrito.service';

@Injectable({
  providedIn: 'root'
})
export class CarritoGuard implements CanActivate {

  constructor(private router: Router, private carritoService: CarritoService) {}

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
