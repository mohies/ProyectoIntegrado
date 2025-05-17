import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

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
// ngOnInit se ejecuta al inicializar el componente.
// Llama a cargarResumen para obtener datos estadísticos del organizador.
  ngOnInit(): void {
    this.cargarResumen();
  }
// Realiza una petición GET autenticada al backend para obtener un resumen de métricas del organizador (como ingresos, eventos creados, reservas, etc.).
// Si ocurre un error en la carga, muestra un mensaje de error en pantalla.
  cargarResumen() {
    const token = localStorage.getItem('token');
    if (!token) return;

    const headers = new HttpHeaders({ Authorization: `Token ${token}` });

    this.http.get<any>(environment.apiUrl + 'organizador/resumen/', { headers }).subscribe({
      next: (res) => this.resumen = res,
      error: () => this.error = '❌ Error al cargar el resumen.'
    });
  }
}
