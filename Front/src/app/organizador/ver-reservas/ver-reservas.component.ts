import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

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

  ngOnInit(): void {
    this.eventoId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarReservas();
  }

  cargarReservas() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Token ${token}` });

    this.cargando = true;
    this.http.get<any[]>(`http://localhost:8000/api/v1/reservas-por-evento/${this.eventoId}/`, { headers }).subscribe({
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
