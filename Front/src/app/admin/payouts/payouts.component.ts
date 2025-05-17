import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';

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
// Al iniciar el componente, se cargan los payouts del servidor.

  ngOnInit(): void {
    this.cargarPayouts();
  }
// Realiza una petición GET autenticada para obtener la lista de payouts.
// Maneja el estado de carga y posibles errores.
  cargarPayouts() {
    this.loading = true;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Token ${token}`
    });

    this.http.get<any[]>(environment.apiUrl + 'payouts/', { headers }).subscribe({
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
// Marca un payout como "pagado" mediante una petición PATCH.
// Luego recarga la lista de payouts actualizada.
// Muestra un mensaje de error si falla la actualización.
  marcarComoPagado(payoutId: number) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Token ${token}`
    });

    this.http.patch(environment.apiUrl + `payouts/${payoutId}/`, { estado: 'pagado' }, { headers }).subscribe({
      next: () => {
        this.cargarPayouts(); // Recarga lista
      },
      error: () => {
        this.errorMsg = '❌ No se pudo actualizar el estado.';
      }
    });
  }
}
