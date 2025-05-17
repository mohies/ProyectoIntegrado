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
  styleUrls: ['./app.component.css']
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
// Método que se ejecuta al inicializar el componente.
// Carga el usuario desde el servicio de autenticación.
// Muestra un mensaje si el pago fue exitoso (o simulado) y verifica si hay eventos en oferta.
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
// Realiza una búsqueda si hay texto ingresado.
// Redirige a la ruta de eventos con el término de búsqueda como parámetro de consulta.
  buscar() {
    if (this.terminoBusqueda.trim()) {
      this.router.navigate(['/eventos'], { queryParams: { q: this.terminoBusqueda } });
    }
  }
// Cierra el modal de eventos en oferta.

  cerrarModal() {
    this.mostrarModalOfertas = false;
  }
  
}
