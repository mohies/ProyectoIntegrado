import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-payouts',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './payouts.component.html',
  styleUrl: './payouts.component.css'
})
export class PayoutsComponent implements OnInit {
  payouts: any[] = [];
  loading = false;
  errorMsg: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarPayouts();
  }

  cargarPayouts() {
    this.loading = true;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Token ${token}`
    });

    this.http.get<any[]>('http://localhost:8000/api/v1/payouts/', { headers }).subscribe({
      next: (res) => {
        this.payouts = res;
        this.loading = false;
      },
      error: (err) => {
        this.errorMsg = '❌ Error cargando payouts.';
        this.loading = false;
      }
    });
  }

  marcarComoPagado(payoutId: number) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Token ${token}`
    });

    this.http.patch(`http://localhost:8000/api/v1/payouts/${payoutId}/`, { estado: 'pagado' }, { headers }).subscribe({
      next: () => {
        this.cargarPayouts(); // Recarga lista
      },
      error: () => {
        this.errorMsg = '❌ No se pudo actualizar el estado.';
      }
    });
  }
}
