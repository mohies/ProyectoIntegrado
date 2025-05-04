import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet, ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'; 
import { AuthService } from './services/auth.service';
import { Observable } from 'rxjs';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterOutlet,
    ChatbotComponent,
    HttpClientModule,
    FormsModule  
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  usuario$!: Observable<any>;
  terminoBusqueda: string = '';
  mensajeExito: string | null = null;
  mostrarOferta: boolean = false;
  eventosOferta: any[] = [];
  eventosEnOferta: any[] = [];
  mostrarModalOfertas = false;


  constructor(
    public auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.auth.cargarUsuario();
    this.usuario$ = this.auth.usuario$;
  
    this.route.queryParams.subscribe(params => {
      if (params['pago'] === 'exitoso' || params['pago'] === 'simulado') {
        this.mensajeExito = '✅ ¡Compra realizada con éxito!';
        setTimeout(() => {
          this.mensajeExito = null;
          this.router.navigate([], { queryParams: {} });
        }, 4000);
      }
    });
  
    // Verificar ofertas tras login
    this.auth.usuario$.subscribe(usuario => {
      if (usuario) {
        this.auth.chequearOfertas().subscribe({
          next: (eventos) => {
            if (eventos.length > 0) {
              this.eventosEnOferta = eventos;
              this.mostrarModalOfertas = true;
            }
          },
          error: () => {}
        });
      }
    });
  }

  buscar() {
    if (this.terminoBusqueda.trim()) {
      this.router.navigate(['/eventos'], { queryParams: { q: this.terminoBusqueda } });
    }
  }

  cerrarModal() {
    this.mostrarModalOfertas = false;
  }
  
}
