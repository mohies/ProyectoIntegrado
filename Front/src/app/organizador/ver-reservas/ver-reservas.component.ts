import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-ver-reservas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ver-reservas.component.html',
  styleUrls: ['./ver-reservas.component.css']
})
export class VerReservasComponent implements OnInit {
  reservas: any[] = [];
  cargando = false;
  eventoId!: number;

  constructor(private http: HttpClient, private route: ActivatedRoute) {}
// ngOnInit se ejecuta al inicializar el componente.
// Extrae el ID del evento desde la URL y llama a cargarReservas para obtener las reservas asociadas.
  ngOnInit(): void {
    this.eventoId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarReservas();
  }
// Realiza una solicitud GET autenticada al backend para obtener todas las reservas asociadas al evento indicado.
// Muestra un indicador de carga durante la solicitud y maneja errores mostrando un mensaje en pantalla.
  cargarReservas() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Token ${token}` });

    this.cargando = true;
    this.http.get<any[]>(environment.apiUrl + 'reservas-por-evento/' + this.eventoId + '/', { headers }).subscribe({
      next: (res) => {
        this.reservas = res;
        this.cargando = false;
      },
      error: () => {
        alert('❌ Error al cargar las reservas');
        this.cargando = false;
      }
    });
  }
}
