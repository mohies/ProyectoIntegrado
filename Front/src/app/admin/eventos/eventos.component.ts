import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosAdminComponent implements OnInit {
  eventos: any[] = [];
  eventoAEliminar: any = null; // Evento seleccionado para eliminar, se usa en el modal

  constructor(private http: HttpClient) {}

  // Al inicializar, se hace una petición GET para obtener todos los eventos.
  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    const headers = new HttpHeaders({
      Authorization: `Token ${token}`
    });

    this.http.get(environment.apiUrl + 'gestion-eventos/', { headers }).subscribe({
      next: (res: any) => {
        this.eventos = res;
      },
      error: err => {
        console.error('❌ Error al cargar eventos:', err);
      }
    });
  }

  // Abre el modal de confirmación y guarda el evento a eliminar.
abrirModalEliminar(evento: any) {
  this.eventoAEliminar = evento;
  document.body.style.overflow = 'hidden';
}

cerrarModal() {
  this.eventoAEliminar = null;
  document.body.style.overflow = 'auto';
}


  // Realiza la petición DELETE solo si se ha confirmado desde el modal.
  confirmarEliminacion() {
    if (!this.eventoAEliminar) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    const headers = new HttpHeaders({
      Authorization: `Token ${token}`
    });

    this.http.delete(environment.apiUrl + `gestion-eventos/${this.eventoAEliminar.id}/`, { headers })
      .subscribe({
        next: () => {
          this.eventos = this.eventos.filter(e => e.id !== this.eventoAEliminar.id); // Actualiza la lista local
          this.cerrarModal(); // Cierra el modal
        },
        error: err => {
          console.error('❌ Error al eliminar evento:', err);
          this.cerrarModal();
        }
      });
  }
}
