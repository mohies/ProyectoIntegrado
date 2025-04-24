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

  agregar(evento: EventoCarrito) {
    const actual = this.eventos.getValue();
    if (!actual.some(e => e.id === evento.id)) {
      this.eventos.next([...actual, evento]);
      this.iniciarTemporizador(); // iniciar cuando se agrega
    }
  }

  eliminar(id: number) {
    const actualizado = this.eventos.getValue().filter(e => e.id !== id);
    this.eventos.next(actualizado);
    if (actualizado.length === 0) this.detenerTemporizador();
  }

  vaciar() {
    this.eventos.next([]);
    this.detenerTemporizador();
  }

  obtenerCarrito(): EventoCarrito[] {
    return this.eventos.getValue();
  }

  actualizarCantidad(id: number, cantidad: number) {
    const actual = this.eventos.getValue();
    const actualizado = actual.map(item =>
      item.id === id ? { ...item, cantidad } : item
    );
    this.eventos.next(actualizado);
  }

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

  private detenerTemporizador() {
    if (this.temporizadorSub) {
      this.temporizadorSub.unsubscribe();
      this.temporizadorSub = null;
    }
    this.segundosRestantes = this.tiempoMaximo;
  }
}
