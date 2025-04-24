import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
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
    private route: ActivatedRoute
  ) {}

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

  eliminar(id: number) {
    this.carritoService.eliminar(id);
  }

  vaciarCarrito() {
    this.carritoService.vaciar();
  }

  calcularTotal(): number {
    return this.lineas.reduce((acc, item) => acc + item.precio * (item.cantidad || 1), 0);
  }

  recalcular(linea: any) {
    this.carritoService.actualizarCantidad(linea.id, linea.cantidad);
  }
  
}
