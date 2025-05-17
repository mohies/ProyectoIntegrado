import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RegistroService {
  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private router: Router
  ) {}
// Envía los datos del formulario al endpoint de registro personalizado.
// Si la respuesta contiene un token y el usuario, guarda el token,
// actualiza el observable del usuario y redirige al inicio.
  registrarUsuario(data: FormData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}custom-register/`, data).pipe(
      tap(res => {
        if (res.token && res.usuario) {
          localStorage.setItem('token', res.token);                  //  Guarda el token
          this.auth.setUsuario(res.usuario);                         //  Notifica al observable
          this.router.navigate(['/']);                               // Redirige 
        }
      })
    );
  }
}
