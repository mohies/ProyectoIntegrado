import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resumen-organizador',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resumen-organizador.component.html',
  styleUrls: ['./resumen-organizador.component.css']
})
export class ResumenOrganizadorComponent implements OnInit {
  resumen: any = null;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarResumen();
  }

  cargarResumen() {
    const token = localStorage.getItem('token');
    if (!token) return;

    const headers = new HttpHeaders({ Authorization: `Token ${token}` });

    this.http.get<any>('http://localhost:8000/api/v1/organizador/resumen/', { headers }).subscribe({
      next: (res) => this.resumen = res,
      error: () => this.error = '❌ Error al cargar el resumen.'
    });
  }
}
