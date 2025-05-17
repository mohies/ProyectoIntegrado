import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';  // Necesario para ngModel
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-mis-eventos',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './mis-eventos.component.html',
  styleUrls: ['./mis-eventos.component.css']
})
export class MisEventosComponent implements OnInit {
  eventos: any[] = [];
  cargando = false;
  editarId: number | null = null;
  nuevoDescuento: number | null = null;

  constructor(private http: HttpClient) {}
    // Se ejecuta al iniciar el componente. Llama a cargarEventos para obtener los eventos del organizador.

  ngOnInit(): void {
    this.cargarEventos();
  }
    // Realiza una petición GET autenticada para obtener los eventos del usuario actual.
    // Almacena la respuesta en el array 'eventos' y gestiona el estado de carga.
  cargarEventos() {
    this.cargando = true;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Token ${token}` });

    this.http.get<any[]>(environment.apiUrl + 'mis-eventos/', { headers }).subscribe({
      next: (res) => {
        this.eventos = res;
        this.cargando = false;
      },
      error: () => {
        alert('❌ Error al cargar tus eventos');
        this.cargando = false;
      }
    });
  }
    // Activa el modo edición para un evento específico, asignando el ID y el valor actual del descuento.

  activarEdicion(id: number, actual: number | null) {
    this.editarId = id;
    this.nuevoDescuento = actual ?? null;
  }
 // Valida el nuevo descuento (debe ser entre 0 y 100).
    // Si es válido, realiza una petición PATCH autenticada para actualizar el descuento del evento.
    // Luego recarga la lista de eventos.
  guardarDescuento(eventoId: number) {
    if (this.nuevoDescuento === null || this.nuevoDescuento < 0 || this.nuevoDescuento > 100) {
      alert('⚠️ Descuento inválido (0-100)');
      return;
    }

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Token ${token}` });

    this.http.patch(environment.apiUrl + `gestion-eventos/${eventoId}/`, {
      descuento: this.nuevoDescuento
    }, { headers }).subscribe({
      next: () => {
        alert('✅ Descuento actualizado');
        this.editarId = null;
        this.cargarEventos();
      },
      error: () => alert('❌ Error al actualizar el descuento')
    });
  }
}
