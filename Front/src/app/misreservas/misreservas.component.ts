import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-misreservas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './misreservas.component.html',
  styleUrls: ['./misreservas.component.css']
})
export class MisreservasComponent implements OnInit {
  reservas: any[] = [];
  mensaje: string | null = null;
  reservaSeleccionada: number | null = null;
  motivoCancelacion: string = '';
  today = new Date();

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarReservas();
  }

  cargarReservas() {
    const token = localStorage.getItem('token');
    if (!token) return;

    const headers = new HttpHeaders({ Authorization: `Token ${token}` });
    this.http.get<any[]>('http://localhost:8000/api/v1/mis-reservas/', { headers }).subscribe({
      next: (res) => this.reservas = res,
      error: () => this.mensaje = '❌ Error al cargar tus reservas.'
    });
  }

  seleccionarReserva(id: number) {
    this.reservaSeleccionada = id;
    this.motivoCancelacion = '';
  }

  cancelarReserva() {
    const token = localStorage.getItem('token');
    if (!token || !this.reservaSeleccionada) return;

    const headers = new HttpHeaders({ Authorization: `Token ${token}` });
    const body = { motivo: this.motivoCancelacion };

    this.http.post(`http://localhost:8000/api/v1/cancelar-reserva/${this.reservaSeleccionada}/`, body, { headers }).subscribe({
      next: () => {
        this.mensaje = '✅ Reserva cancelada correctamente.';
        this.cargarReservas();
        this.reservaSeleccionada = null;
      },
      error: () => this.mensaje = '❌ No se pudo cancelar la reserva.'
    });
  }

  eventoPasado(fecha: string): boolean {
    return new Date(fecha) < this.today;
  }
}
