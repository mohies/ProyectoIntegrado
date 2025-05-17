import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
// Componente standalone para mostrar eventos en el panel de administración.
// Al inicializar, realiza una petición GET a la API para obtener la lista de eventos.
// Los eventos recibidos se almacenan en un array y se pueden renderizar en el HTML.
// Si ocurre un error en la carga, se muestra en consola.

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get(environment.apiUrl + 'eventos/').subscribe({
      next: (res: any) => {
        this.eventos = res;
      },
      error: err => {
        console.error('❌ Error al cargar eventos:', err);
      }
    });
  }
}
