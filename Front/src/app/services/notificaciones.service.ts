import { Injectable, computed, signal } from '@angular/core';

/**
 * Estructura de una notificación de tipo 'oferta'.
 */
export interface Notificacion {
  tipo: 'oferta';            // Tipo fijo: solo 'oferta'
  mensaje: string;           // Texto descriptivo
  leido: boolean;            // Indica si fue leída
  fecha: Date;               // Fecha de creación
  eventoId?: number;         // ID del evento vinculado (opcional)
}

@Injectable({ providedIn: 'root' })
export class NotificacionesService {
  // Signal reactivo para el estado interno de las notificaciones
  private notificaciones = signal<Notificacion[]>([]);

  /**
   * Devuelve todas las notificaciones como readonly signal.
   */
  get todas$() {
    return this.notificaciones.asReadonly();
  }

  /**
   * Computa y devuelve únicamente las notificaciones no leídas.
   */
  get sinLeer$() {
    return computed(() =>
      this.notificaciones().filter(n => !n.leido)
    );
  }

  /**
   * Agrega una nueva notificación de tipo 'oferta'.
   * @param mensaje Texto de la notificación.
   * @param eventoId (opcional) ID del evento relacionado.
   */
  agregarOferta(mensaje: string, eventoId?: number) {
    const nueva: Notificacion = {
      tipo: 'oferta',
      mensaje,
      leido: false,
      fecha: new Date(),
      eventoId
    };
    this.notificaciones.update(n => [nueva, ...n]);
  }

  /**
   * Marca como leída una notificación en una posición específica.
   * @param index Índice dentro del array.
   */
  marcarComoLeido(index: number) {
    this.notificaciones.update(n =>
      n.map((item, i) =>
        i === index ? { ...item, leido: true } : item
      )
    );
  }

  /**
   * Elimina todas las notificaciones existentes.
   */
  limpiar() {
    this.notificaciones.set([]);
  }
}
