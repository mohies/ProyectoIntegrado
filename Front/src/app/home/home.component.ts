import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventosService } from '../services/eventbrite.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  destacados: any[] = [];
  proximos: any[] = [];

  constructor(private eventosService: EventosService) {}

  ngOnInit(): void {
    // Eventos destacados
    this.eventosService.getDestacados().subscribe({
      next: (res) => {
        this.destacados = res.slice(0, 3);
      },
      error: () => console.error('❌ Error al cargar eventos destacados')
    });

    //  Eventos próximos (para el carrusel)
    this.eventosService.getProximos().subscribe({
      next: (res) => {
        this.proximos = res;
      },
      error: () => console.error('❌ Error al cargar eventos próximos')
    });
  }
}
