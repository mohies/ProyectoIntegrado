import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule,RouterOutlet } from '@angular/router';
interface LineaCarrito {
  id: number;
  nombre: string;
  imagen: string;
}

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent {
  lineas: LineaCarrito[] = [
    { id: 1, nombre: 'Item 1', imagen: 'https://via.placeholder.com/100x100' },
    { id: 2, nombre: 'Item 2', imagen: 'https://via.placeholder.com/100x100' },
    { id: 3, nombre: 'Item 3', imagen: 'https://via.placeholder.com/100x100' }
  ];
}
