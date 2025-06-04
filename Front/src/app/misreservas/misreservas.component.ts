import { Component, OnInit, computed, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-misreservas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './misreservas.component.html',
  styleUrls: ['./misreservas.component.css']
})
export class MisreservasComponent implements OnInit {
  reservas = signal<any[]>([]);
  mensaje = signal<string | null>(null);
  reservaSeleccionada = signal<number | null>(null);
  motivoCancelacion = signal<string>('');
  today = new Date();

  // Computadas para próximas e historial
  proximas = computed(() =>
    this.reservas().filter(r => r.estado === 'activa' && !this.eventoPasado(r.evento?.fecha))
  );

  historial = computed(() =>
    this.reservas().filter(r => this.eventoPasado(r.evento?.fecha) || r.estado === 'cancelada')
  );

  constructor(private http: HttpClient) {}

  // Se ejecuta al inicializar el componente. Llama a la función para obtener las reservas del usuario.
  ngOnInit(): void {
    this.cargarReservas();
  }

  // Realiza una petición GET para obtener todas las reservas del usuario autenticado
  // y actualiza el estado reactivo `reservas`. En caso de error, muestra un mensaje.
  cargarReservas() {
    const token = localStorage.getItem('token');
    if (!token) return;

    const headers = new HttpHeaders({ Authorization: `Token ${token}` });
    this.http.get<any[]>(environment.apiUrl + 'mis-reservas/', { headers }).subscribe({
      next: res => this.reservas.set(res),
      error: () => this.mensaje.set('❌ Error al cargar tus reservas.')
    });
  }

  // Establece qué reserva ha sido seleccionada para cancelar, y limpia el motivo previo si lo había.
  seleccionarReserva(id: number) {
    const reserva = this.reservas().find(r => r.id === id);
    const fechaEvento = reserva?.evento?.fecha;

    if (fechaEvento && this.dentroDe24Horas(fechaEvento)) {
      this.mensaje.set('⛔ No puedes cancelar una reserva con menos de 24 horas de antelación.');
      return;
    }

    this.reservaSeleccionada.set(id);
    this.motivoCancelacion.set('');
  }

  // Realiza una petición POST al backend para cancelar una reserva específica,
  // enviando el motivo de cancelación. Tras éxito, recarga las reservas y limpia el estado.
  cancelarReserva() {
    const token = localStorage.getItem('token');
    if (!token || this.reservaSeleccionada() === null) return;

    const reserva = this.reservas().find(r => r.id === this.reservaSeleccionada());
    const fechaEvento = reserva?.evento?.fecha;

    if (fechaEvento && this.dentroDe24Horas(fechaEvento)) {
      this.mensaje.set('⛔ No puedes cancelar esta reserva porque el evento está muy próximo.');
      return;
    }

    const headers = new HttpHeaders({ Authorization: `Token ${token}` });
    const body = { motivo: this.motivoCancelacion() };

    this.http.post(environment.apiUrl + 'cancelar-reserva/' + this.reservaSeleccionada() + '/', body, { headers }).subscribe({
      next: () => {
        this.mensaje.set('✅ Reserva cancelada correctamente.');
        this.cargarReservas();
        this.reservaSeleccionada.set(null);
      },
      error: () => this.mensaje.set('❌ No se pudo cancelar la reserva.')
    });
  }

  // Función auxiliar que determina si una fecha de evento ya pasó comparándola con la fecha actual.
  eventoPasado(fecha: string): boolean {
    return new Date(fecha) < this.today;
  }

  // Nueva función auxiliar para verificar si un evento está dentro de las 24h
  dentroDe24Horas(fecha: string): boolean {
    const fechaEvento = new Date(fecha);
    const ahora = new Date();
    return fechaEvento.getTime() - ahora.getTime() < 24 * 60 * 60 * 1000;
  }

  // Realiza una petición GET para descargar el PDF de la entrada de una reserva específica.
  // Usa `responseType: 'blob'` y genera un enlace temporal para descargar el archivo.
  descargarEntradaPDF(reservaId: number) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Token ${token}` });

    this.http.get(environment.apiUrl + 'descargar-entrada/' + reservaId + '/', {
      headers,
      responseType: 'blob' //este parametro es una peticion httpcliente le indica a angular que larespuesta esperada no es un json ni texto sino un archivo binario
    }).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `entrada_reserva_${reservaId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  // Getter reactivo que expone el valor del motivo de cancelación desde la señal correspondiente.
  get motivo(): string {
    return this.motivoCancelacion();
  }

  // Setter que actualiza la señal `motivoCancelacion` con un nuevo valor.
  set motivo(value: string) {
    this.motivoCancelacion.set(value);
  }
}
