// src/app/services/carrito.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Subscription } from 'rxjs';

interface EventoCarrito {
  cantidad: number;
  id: number;
  titulo: string;
  imagen: string;
  precio: number;
}

@Injectable({ providedIn: 'root' })
export class CarritoService {
  private eventos = new BehaviorSubject<EventoCarrito[]>([]);
  eventos$ = this.eventos.asObservable();

  private temporizadorSub: Subscription | null = null;
  private tiempoMaximo = 300; // 5 minutos en segundos
  private segundosRestantes = this.tiempoMaximo;
  // Agrega un evento al carrito si aún no está presente.
  // También inicia el temporizador para expiración automática.
  agregar(evento: EventoCarrito) {
    const actual = this.eventos.getValue();
    if (!actual.some(e => e.id === evento.id)) {
      this.eventos.next([...actual, evento]);
      this.iniciarTemporizador(); // iniciar cuando se agrega
    }
  }
  // Elimina un evento del carrito según su ID.
  // Si el carrito queda vacío, detiene el temporizador.
  eliminar(id: number) {
    const actualizado = this.eventos.getValue().filter(e => e.id !== id);
    this.eventos.next(actualizado);
    if (actualizado.length === 0) this.detenerTemporizador();
  }
  // Vacía completamente el carrito y detiene el temporizador.

  vaciar() {
    this.eventos.next([]);
    this.detenerTemporizador();
  }
  // Devuelve el estado actual del carrito como un array de eventos.

  obtenerCarrito(): EventoCarrito[] {
    return this.eventos.getValue();
  }
  // Actualiza la cantidad de un evento específico en el carrito.

  actualizarCantidad(id: number, cantidad: number) {
    const actual = this.eventos.getValue();
    const actualizado = actual.map(item =>
      item.id === id ? { ...item, cantidad } : item
    );
    this.eventos.next(actualizado);
  }
  // Inicia el temporizador de expiración del carrito (5 minutos).
  // Cada segundo decrementa y si llega a cero, vacía el carrito.
  private iniciarTemporizador() {
    if (this.temporizadorSub) return;

    this.segundosRestantes = this.tiempoMaximo;
    this.temporizadorSub = interval(1000).subscribe(() => {
      this.segundosRestantes--;

      if (this.segundosRestantes <= 0) {
        this.vaciar(); // vacía y detiene el temporizador
      }
    });
  }
  // Detiene el temporizador activo y reinicia el contador de segundos.

  private detenerTemporizador() {
    if (this.temporizadorSub) {
      this.temporizadorSub.unsubscribe();
      this.temporizadorSub = null;
    }
    this.segundosRestantes = this.tiempoMaximo;
  }
}
