import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EventosService } from '../services/eventbrite.service';

interface Evento {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: string;
  imagen: string;
  ubicacion: string;
  precio: number;
  tipo?: string;
  cupo_disponible?: number;
}

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './eventos.component.html',
  styleUrl: './eventos.component.css'
})
export class EventosComponent implements OnInit {
  eventos: Evento[] = [];
  filtroNombre: string = '';
  orden: string = '';
  mensaje: string | null = null;

  constructor(
    private eventosService: EventosService,
    private route: ActivatedRoute
  ) {}

  // Al iniciar el componente:
  // 1. Obtiene todos los eventos desde el servicio.
  // 2. Luego lee el parámetro de búsqueda "q" desde la URL (si existe) para aplicarlo como filtro.
  ngOnInit(): void {
    this.eventosService.getEventos().subscribe({
      next: (res: Evento[]) => {
        this.eventos = res;

        // Leer query param después de cargar los eventos
        this.route.queryParams.subscribe(params => {
          this.filtroNombre = params['q'] || '';
          if (params['creado'] === '1') {
            this.mensaje = '✅ Evento creado correctamente.';
            setTimeout(() => this.mensaje = null, 4000);
          }
        });
      },
      error: err => {
        console.error('❌ Error al obtener eventos', err);
      }
    });
  }

  // Devuelve la lista de eventos filtrados por nombre (si hay búsqueda activa)
  // y ordenados por fecha o título, según lo que se haya seleccionado en `orden`.
  eventosFiltrados() {
    return this.eventos
      .filter(e => !this.filtroNombre || e.titulo.toLowerCase().includes(this.filtroNombre.toLowerCase()))
      .sort((a, b) => {
        if (this.orden === 'fecha') {
          return new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
        } else if (this.orden === 'nombre') {
          return a.titulo.localeCompare(b.titulo);
        }
        return 0;
      });
  }
}
