import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { EventosService } from '../services/eventbrite.service';
import { AuthService, Usuario } from '../services/auth.service';
import { CarritoService } from '../services/carrito.service'; // asegúrate que la ruta sea correcta


@Component({
  selector: 'app-evento-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './evento-detalle.component.html',
  styleUrls: ['./evento-detalle.component.css']
})
export class EventoDetalleComponent implements OnInit {
  evento: any;
  promedio = 0;
  totalResenas = 0;
  resenas: any[] = [];

  nuevaPuntuacion = 5;
  nuevoComentario = '';
  usuarioPuedeResenar = false;

  usuarioActual: Usuario | null = null;

  // Mensajes de éxito o error
  mensaje: string | null = null;
  tipoMensaje: 'success' | 'danger' | null = null;
a: any;

  constructor(
    private route: ActivatedRoute,
    private eventosService: EventosService,
    private auth: AuthService,
    private carritoService: CarritoService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const eid = +id;

      this.auth.usuario$.subscribe(usuario => {
        this.usuarioActual = usuario;
      });

      this.eventosService.getEventoPorId(eid).subscribe({
        next: (res) => this.evento = res,
        error: () => console.error('❌ Error al obtener el evento')
      });

      this.eventosService.getResumenResenas(eid).subscribe({
        next: (res) => {
          this.promedio = res.promedio;
          this.totalResenas = res.total;
        }
      });

      this.eventosService.getResenasPorEvento(eid).subscribe({
        next: (res) => {
          this.resenas = res;

          if (this.auth.usuarioActual) {
            const yaReseno = res.some(r => r.usuario?.id === this.auth.usuarioActual?.id);
            this.usuarioPuedeResenar = !yaReseno && this.auth.usuarioActual.rol === 'Usuario'; //  Solo usuarios pueden reseñar
          }
          
        },
        error: () => {
          console.error('❌ Error al obtener reseñas');
          this.usuarioPuedeResenar = false;
        }
      });
    }
  }

  enviarResena() {
    const token = localStorage.getItem('token');
    if (!token || !this.evento || !this.usuarioActual) return;
  
    const datos = {
      evento: this.evento.id,
      puntuacion: this.nuevaPuntuacion,
      comentario: this.nuevoComentario
    };
  
    this.eventosService.crearResena(datos, token).subscribe({
      next: (res) => {
        this.resenas.push(res.resena); // Ya viene completo con usuario y foto
  
        this.usuarioPuedeResenar = false;
        this.nuevaPuntuacion = 5;
        this.nuevoComentario = '';
  
        this.mensaje = '✅ ¡Gracias por tu reseña!';
        this.tipoMensaje = 'success';
  
        // Elimina el mensaje después de unos segundos
        setTimeout(() => {
          this.mensaje = null;
          this.tipoMensaje = null;
        }, 4000);
      },
      error: (err) => {
        this.mensaje = err?.error?.detail || '❌ No se pudo enviar la reseña.';
        this.tipoMensaje = 'danger';
  
        setTimeout(() => {
          this.mensaje = null;
          this.tipoMensaje = null;
        }, 4000);
      }
    });
  }


  eliminarResena(id: number) {
    const token = localStorage.getItem('token');
    if (!token) return;
  
    if (!confirm('¿Estás seguro de que deseas eliminar esta reseña?')) return;
  
    this.eventosService.eliminarResena(id, token).subscribe({
      next: () => {
        this.resenas = this.resenas.filter(r => r.id !== id);
        this.mensaje = '🗑️ Reseña eliminada correctamente.';
        this.tipoMensaje = 'success';
  
        setTimeout(() => {
          this.mensaje = null;
          this.tipoMensaje = null;
        }, 3000);
      },
      error: () => {
        this.mensaje = '❌ No se pudo eliminar la reseña.';
        this.tipoMensaje = 'danger';
  
        setTimeout(() => {
          this.mensaje = null;
          this.tipoMensaje = null;
        }, 3000);
      }
    });
  }
  agregarAlCarrito() {
    if (!this.evento) return;
  
    this.carritoService.agregar(this.evento);
    this.mensaje = '🛒 Evento añadido al carrito.';
    this.tipoMensaje = 'success';
  
    setTimeout(() => {
      this.mensaje = null;
      this.tipoMensaje = null;
    }, 3000);
  }
  
  
  
  
  
}
