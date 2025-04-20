import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class RegistroService {
  private baseUrl = 'http://localhost:8000/api/v1';

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private router: Router
  ) {}

  registrarUsuario(data: FormData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/custom-register/`, data).pipe(
      tap(res => {
        if (res.token && res.usuario) {
          localStorage.setItem('token', res.token);                  // ✅ Guarda el token
          this.auth.setUsuario(res.usuario);                         // ✅ Notifica al observable
          this.router.navigate(['/']);                               // ✅ Redirige (ajusta si quieres otra ruta)
        }
      })
    );
  }
}
