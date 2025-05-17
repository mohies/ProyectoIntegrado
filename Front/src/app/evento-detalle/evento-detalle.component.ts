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
// Al inicializar, obtiene el ID del evento desde la URL.
// Carga los datos del evento, sus reseñas, el resumen (promedio y total) y evalúa si el usuario puede reseñar.
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
// Envía una nueva reseña del usuario actual al backend.
// Si es exitosa, la agrega al listado y muestra un mensaje.
// Si falla, muestra el error recibido.
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
        this.resenas.push(res.resena); // viene completo con usuario y foto
  
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

// Elimina una reseña por su ID tras confirmación del usuario.
// Si es exitosa, actualiza la lista local y muestra un mensaje.
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
  // Agrega el evento actual al carrito de compras, calculando el precio final o con oferta.
// Muestra un mensaje de confirmación temporal.
  agregarAlCarrito() {
    if (!this.evento) return;
  
    const item = {
      ...this.evento,
      precio: this.evento.precio_final || this.evento.precio, // precio que se usará en total
      precio_original: this.evento.precio                      // precio original para mostrar
    };
  
    this.carritoService.agregar(item);
  
    this.mensaje = '🛒 Evento añadido al carrito.';
    this.tipoMensaje = 'success';
  
    setTimeout(() => {
      this.mensaje = null;
      this.tipoMensaje = null;
    }, 3000);
  }
  
  
  
  
  
  
  
}
