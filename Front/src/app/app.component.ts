import { Component, OnInit, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet, ActivatedRoute, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

import { AuthService } from './services/auth.service';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { NotificacionesService, Notificacion } from './services/notificaciones.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterOutlet,
    ChatbotComponent,
    HttpClientModule,
    FormsModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  // Usuario autenticado
  usuario$!: Observable<any>;

  // Campo de búsqueda
  terminoBusqueda: string = '';

  // Mensaje de éxito (por ejemplo, al completar una compra)
  mensajeExito: string | null = null;

  // Eventos en oferta
  eventosEnOferta: any[] = [];

  // Control de visibilidad del modal de oferta
  mostrarModalOfertas = false;

  // Control de visibilidad de alerta textual de oferta
  alertaOfertasMostrada = false;

  // Notificaciones no leídas y visibilidad del panel
  sinLeer!: Signal<Notificacion[]>;
  desplegarNotificaciones = false;

  // Registro de eventos ya notificados para evitar duplicados
  eventosOfertadosNotificados: number[] = [];

  constructor(
    public auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    public notificacionesService: NotificacionesService
  ) {}

  ngOnInit(): void {
    // Cargar usuario al iniciar la app
    this.auth.cargarUsuario();
    this.usuario$ = this.auth.usuario$;

    // Obtener notificaciones no leídas como signal
    this.sinLeer = this.notificacionesService.sinLeer$;

    // Mostrar mensaje si el pago fue exitoso o simulado
    this.route.queryParams.subscribe(params => {
      if (params['pago'] === 'exitoso' || params['pago'] === 'simulado') {
        this.mensajeExito = 'Compra realizada con éxito.';
        setTimeout(() => {
          this.mensajeExito = null;
          this.router.navigate([], { queryParams: {} });
        }, 4000);
      }
    });

    // Al loguearse, verificar eventos en oferta
    this.usuario$.subscribe(usuario => {
      if (usuario) {
        this.auth.chequearOfertas().subscribe({
          next: eventos => {
            if (eventos.length > 0) {
              this.eventosEnOferta = eventos;

              // Mostrar modal solo si no se mostró aún en esta sesión
              const modalYaMostrado = sessionStorage.getItem('modalOfertasMostrado');
              if (!modalYaMostrado) {
                this.mostrarModalOfertas = true;
                sessionStorage.setItem('modalOfertasMostrado', 'true');
              }

              // Mostrar alerta textual una vez por sesión
              const alertaYaMostrada = sessionStorage.getItem('alertaOfertasMostrada');
              if (!alertaYaMostrada) {
                this.alertaOfertasMostrada = true;
                sessionStorage.setItem('alertaOfertasMostrada', 'true');
              }

              // Notificar nuevos eventos no repetidos
              const nuevos = eventos.filter(
                e => !this.eventosOfertadosNotificados.includes(e.id)
              );

              nuevos.forEach(evento => {
                this.notificacionesService.agregarOferta(
                  `Nuevo evento en oferta: ${evento.titulo}`,
                  evento.id
                );
                this.eventosOfertadosNotificados.push(evento.id);
              });
            }
          },
          error: () => {}
        });
      }
    });
  }

  // Redirigir a la búsqueda si hay texto válido
  buscar() {
    if (this.terminoBusqueda.trim()) {
      this.router.navigate(['/eventos'], {
        queryParams: { q: this.terminoBusqueda }
      });
    }
  }

  // Cerrar modal de eventos en oferta
  cerrarModal() {
    this.mostrarModalOfertas = false;
  }

  // Alternar visibilidad del panel de notificaciones
  toggleNotificaciones() {
    this.desplegarNotificaciones = !this.desplegarNotificaciones;
  }

  // Marcar notificación como leída por índice
  marcarLeido(i: number) {
    this.notificacionesService.marcarComoLeido(i);
  }

  // Eliminar todas las notificaciones y cerrar panel
  limpiarNotificaciones() {
    this.notificacionesService.limpiar();
    this.desplegarNotificaciones = false;
  }

  // Navegar a una ruta y cerrar panel de notificaciones
  navegarYCerrar(ruta: any[]) {
    this.router.navigate(ruta);
    this.desplegarNotificaciones = false;
  }
}
