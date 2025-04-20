import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // 👈 Necesario para usar @model
import { EventosService } from '../services/eventbrite.service';
import { ActivatedRoute } from '@angular/router';

interface Evento {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: string;
  imagen: string;
  ubicacion: string;
  precio: number;
  tipo?: string;
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
  

  constructor(private eventosService: EventosService,   private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Cargar eventos
    this.eventosService.getEventos().subscribe({
      next: (res: Evento[]) => {
        this.eventos = res;
  
        // Leer query param después de cargar los eventos
        this.route.queryParams.subscribe(params => {
          this.filtroNombre = params['q'] || '';
        });
      },
      error: err => {
        console.error('❌ Error al obtener eventos', err);
      }
    });
  }
  

  eventosFiltrados() {
    return this.eventos
      .filter(e => 
        !this.filtroNombre || e.titulo.toLowerCase().includes(this.filtroNombre.toLowerCase())
      )
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
