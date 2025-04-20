import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

export interface Usuario {
  id: number;
  username: string;
  email: string;
  rol: string | null;
  foto: string | null;
  rol_display?: string; // ✅ AÑADIDO para evitar error de tipo

}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private usuarioSubject = new BehaviorSubject<Usuario | null>(null);
  usuario$ = this.usuarioSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  cargarUsuario() {
    const token = localStorage.getItem('token');

    if (!token) {
      this.usuarioSubject.next(null);
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Token ${token}`
    });

    this.http.get<any>('http://localhost:8000/api/v1/session/', { headers })
      .subscribe({
        next: (res) => {
          if (res.authenticated) {
            this.usuarioSubject.next(res.user);
          } else {
            this.usuarioSubject.next(null);
          }
        },
        error: () => this.usuarioSubject.next(null)
      });
  }

  setUsuario(usuario: Usuario, token?: string) {
    if (token) {
      localStorage.setItem('token', token);
    }
    this.usuarioSubject.next(usuario);
  }

  logout() {
    localStorage.removeItem('token');
    this.usuarioSubject.next(null);
    this.router.navigate(['/']); // 👈 Redirige a la página de inicio
  }
  

  get usuarioActual() {
    return this.usuarioSubject.value;
  }
}
