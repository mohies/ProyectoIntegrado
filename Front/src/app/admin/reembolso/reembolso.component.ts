import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-reembolso',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './reembolso.component.html',
  styleUrls: ['./reembolso.component.css']
})
export class ReembolsoComponent implements OnInit {
  reembolsos: any[] = [];
  cargando = false;
  error: string | null = null;

  constructor(private http: HttpClient) {}
// Al inicializar el componente, se cargan los reembolsos desde el backend.

  ngOnInit(): void {
    this.cargarReembolsos();
  }
// Realiza una petición GET autenticada para obtener la lista de reembolsos.
// Actualiza el array local y controla los estados de carga y error.
  cargarReembolsos() {
    this.cargando = true;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Token ${token}`
    });

    this.http.get<any[]>(environment.apiUrl + 'admin/reembolsos/', { headers }).subscribe({
      next: (res) => {
        this.reembolsos = res;
        this.cargando = false;
      },
      error: () => {
        this.error = '❌ Error al cargar los reembolsos.';
        this.cargando = false;
      }
    });
  }
// Envía una petición PATCH al backend para actualizar el estado de un reembolso (aprobado, rechazado, parcial).
// Recarga la lista tras la actualización o muestra un mensaje de error si falla.
  actualizarEstado(reembolsoId: number, nuevoEstado: string) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Token ${token}` });
  
    this.http.patch(environment.apiUrl + `admin/reembolsos/${reembolsoId}/estado/`, { estado: nuevoEstado }, { headers })
      .subscribe({
        next: () => this.cargarReembolsos(),
        error: () => alert('❌ Error al actualizar estado del reembolso')
      });
  }
  
}
