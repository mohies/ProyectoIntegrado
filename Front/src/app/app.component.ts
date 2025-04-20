import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
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
  constructor(public auth: AuthService,private router:Router) {}

  ngOnInit(): void {
    this.auth.cargarUsuario();
    this.usuario$ = this.auth.usuario$;
  }

  buscar() {
    if (this.terminoBusqueda.trim()) {
      this.router.navigate(['/eventos'], { queryParams: { q: this.terminoBusqueda } });
    }
  }
}
