import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificacionesService, Notificacion } from '../services/notificaciones.service';
import { Signal } from '@angular/core';

@Component({
  selector: 'app-notificaciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css']
})
export class NotificacionesComponent {
  notificaciones: Signal<Notificacion[]>;
  sinLeer: Signal<Notificacion[]>;

  constructor(private notificacionesService: NotificacionesService) {
    this.notificaciones = this.notificacionesService.todas$;
    this.sinLeer = this.notificacionesService.sinLeer$;
  }

  marcarLeido(i: number) {
    this.notificacionesService.marcarComoLeido(i);
  }

  limpiarTodo() {
    this.notificacionesService.limpiar();
  }
}
