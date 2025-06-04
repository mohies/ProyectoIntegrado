import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
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

  mensaje: string = '';
  tipoMensaje: 'success' | 'error' | '' = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarEventos();
  }

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
        this.mostrarMensaje('❌ Error al cargar tus eventos', 'error');
        this.cargando = false;
      }
    });
  }

  activarEdicion(id: number, actual: number | null) {
    this.editarId = id;
    this.nuevoDescuento = actual ?? null;
  }

  guardarEdicion(evento: any) {
    if (this.nuevoDescuento === null || this.nuevoDescuento < 0 || this.nuevoDescuento > 100) {
      this.mostrarMensaje('⚠️ Descuento inválido (0-100)', 'error');
      return;
    }

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Token ${token}` });

    const payload = {
      titulo: evento.titulo,
      descripcion: evento.descripcion,
      fecha: evento.fecha,
      ubicacion: evento.ubicacion,
      cupo_maximo: evento.cupo_maximo,
      descuento: this.nuevoDescuento,
      imagen: evento.imagen
    };

    this.http.patch(environment.apiUrl + `gestion-eventos/${evento.id}/`, payload, { headers }).subscribe({
      next: () => {
        this.mostrarMensaje('✅ Evento actualizado correctamente', 'success');
        this.editarId = null;
        this.cargarEventos();
      },
      error: () => this.mostrarMensaje('❌ Error al actualizar el evento', 'error')
    });
  }

  esFuturo(fecha: string): boolean {
    return new Date(fecha) > new Date();
  }

  mostrarMensaje(texto: string, tipo: 'success' | 'error') {
    this.mensaje = texto;
    this.tipoMensaje = tipo;
    setTimeout(() => {
      this.mensaje = '';
      this.tipoMensaje = '';
    }, 4000);
  }
}
