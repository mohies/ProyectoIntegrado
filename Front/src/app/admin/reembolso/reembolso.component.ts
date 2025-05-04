import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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

  ngOnInit(): void {
    this.cargarReembolsos();
  }

  cargarReembolsos() {
    this.cargando = true;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Token ${token}`
    });

    this.http.get<any[]>('http://localhost:8000/api/v1/admin/reembolsos/', { headers }).subscribe({
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

  actualizarEstado(reembolsoId: number, nuevoEstado: string) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Token ${token}` });
  
    this.http.patch(`http://localhost:8000/api/v1/admin/reembolsos/${reembolsoId}/estado/`, { estado: nuevoEstado }, { headers })
      .subscribe({
        next: () => this.cargarReembolsos(),
        error: () => alert('❌ Error al actualizar estado del reembolso')
      });
  }
  
}
