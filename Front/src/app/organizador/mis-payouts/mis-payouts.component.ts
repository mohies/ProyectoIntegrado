import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-mis-payouts',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mis-payouts.component.html',
  styleUrls: ['./mis-payouts.component.css']
})
export class MisPayoutsComponent implements OnInit {
  payouts: any[] = [];
  cargando = false;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarPayouts();
  }

  cargarPayouts() {
    this.cargando = true;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Token ${token}` });

    this.http.get<any[]>('http://localhost:8000/api/v1/organizador/payouts/', { headers }).subscribe({
      next: (res) => {
        this.payouts = res;
        this.cargando = false;
      },
      error: () => {
        this.error = '❌ Error al cargar tus pagos.';
        this.cargando = false;
      }
    });
  }
}
