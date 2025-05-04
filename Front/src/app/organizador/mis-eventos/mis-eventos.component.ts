import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-mis-eventos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mis-eventos.component.html',
  styleUrls: ['./mis-eventos.component.css']
})
export class MisEventosComponent implements OnInit {
  eventos: any[] = [];
  cargando = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarEventos();
  }

  cargarEventos() {
    this.cargando = true;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Token ${token}` });

    this.http.get<any[]>('http://localhost:8000/api/v1/mis-eventos/', { headers }).subscribe({
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
}
