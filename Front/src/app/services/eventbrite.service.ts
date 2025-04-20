import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Evento {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: string;
  imagen: string;
  ubicacion: string;
  precio: number;
}

@Injectable({ providedIn: 'root' })
export class EventosService {
  private apiUrl = 'http://localhost:8000/api/v1';

  constructor(private http: HttpClient) {}

  //  Todos los eventos públicos
  getEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.apiUrl}/eventos/`);
  }

  //  Evento por ID
  getEventoPorId(id: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.apiUrl}/eventos/${id}/`);
  }

  //  Eventos destacados
  getDestacados(): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.apiUrl}/eventos-destacados/`);
  }

  //  Eventos próximos
  getProximos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.apiUrl}/eventos-proximos/`);
  }

  // Reseñas de un evento
  getResenasPorEvento(eventoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/resenas/?evento=${eventoId}`);
  }

  //  Crear nueva reseña (requiere token)
  crearResena(data: any, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Token ${token}`
    });

    return this.http.post(`${this.apiUrl}/resenas/`, data, { headers });
  }

  //  Resumen de reseñas (promedio y total)
  getResumenResenas(eventoId: number): Observable<{ promedio: number; total: number }> {
    return this.http.get<{ promedio: number; total: number }>(
      `${this.apiUrl}/eventos/${eventoId}/reseñas-resumen/`
    );
  }

  eliminarResena(id: number, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Token ${token}`
    });
  
    return this.http.delete(`http://localhost:8000/api/v1/resenas/${id}/`, { headers });
  }
  
  
}
