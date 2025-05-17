import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';

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
// ngOnInit se ejecuta automáticamente al inicializar el componente.
// Llama a la función cargarPayouts para obtener la lista de pagos del organizador.
  ngOnInit(): void {
    this.cargarPayouts();
  }
// Realiza una petición GET autenticada al backend para obtener los payouts (pagos) del organizador actual.
// Actualiza el estado de carga y maneja posibles errores mostrando un mensaje apropiado.
  cargarPayouts() {
    this.cargando = true;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Token ${token}` });

    this.http.get<any[]>(environment.apiUrl + 'organizador/payouts/', { headers }).subscribe({
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
