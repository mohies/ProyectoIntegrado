import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // ✅ Esto es lo que falta

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [CommonModule], // 👈 Asegúrate que esté aquí
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
})
export class EventosAdminComponent implements OnInit {
  eventos: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get('http://localhost:8000/api/v1/eventos/').subscribe({
      next: (res: any) => {
        this.eventos = res;
      },
      error: err => {
        console.error('❌ Error al cargar eventos:', err);
      }
    });
  }
}
