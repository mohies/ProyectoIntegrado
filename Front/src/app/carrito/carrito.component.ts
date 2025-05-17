import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CarritoService } from '../services/carrito.service';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  lineas: any[] = [];
  mensajeError: string | null = null;

  constructor(
    private carritoService: CarritoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
// Al iniciar el componente, se suscribe al carrito para obtener los eventos añadidos y sus cantidades.
// También muestra un mensaje de error si el carrito está vacío (detectado por query param).
  ngOnInit(): void {
    this.carritoService.eventos$.subscribe((eventos) => {
      this.lineas = eventos.map(e => ({
        ...e,
        cantidad: e.cantidad || 1
      }));
    });

    this.route.queryParams.subscribe(params => {
      if (params['error'] === 'empty') {
        this.mensajeError = '⚠️ Tu carrito está vacío. Añade productos antes de finalizar la compra.';
      }
    });
  }
// Elimina un producto del carrito según su ID.

  eliminar(id: number) {
    this.carritoService.eliminar(id);
  }
// Vacía completamente el carrito.

  vaciarCarrito() {
    this.carritoService.vaciar();
  }
// Calcula el total del carrito sumando precio × cantidad de cada línea.

  calcularTotal(): number {
    return this.lineas.reduce((acc, item) => acc + item.precio * (item.cantidad || 1), 0);
  }
// Actualiza la cantidad de un producto en el carrito.

  recalcular(linea: any) {
    this.carritoService.actualizarCantidad(linea.id, linea.cantidad);
  }
// Verifica si el total del carrito es válido (> 0) y redirige a la página de compra.
// Si el total es cero, muestra un mensaje de error.
  finalizarCompra() {
    const total = this.calcularTotal();

    if (total <= 0) {
      this.mensajeError = '⚠️ No puedes finalizar la compra con un total de 0 €. Por favor, añade productos.';
      return;
    }

    this.router.navigate(['/compra']);
  }
}
