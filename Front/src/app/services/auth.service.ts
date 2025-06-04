import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

export interface Usuario {
  id: number;
  username: string;
  email: string;
  rol: string | null;
  foto: string | null;
  rol_display?: string; 

}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private usuarioSubject = new BehaviorSubject<Usuario | null>(null);
  usuario$ = this.usuarioSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}
// Carga la información del usuario autenticado desde el backend utilizando el token almacenado.
// Si no hay token o la sesión no es válida, se desloguea automáticamente.
  cargarUsuario() {
    const token = localStorage.getItem('token');

    if (!token) {
      this.usuarioSubject.next(null);
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Token ${token}`
    });

    this.http.get<any>(environment.apiUrl + 'session/', { headers })
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
// Establece manualmente el usuario actual en el observable y guarda el token opcionalmente en localStorage.

  setUsuario(usuario: Usuario, token?: string) {
    if (token) {
      localStorage.setItem('token', token);
    }
    this.usuarioSubject.next(usuario);
  }
// Elimina el token de autenticación y borra el estado del usuario, redirigiendo a la página principal.

  logout() {
    localStorage.removeItem('token');
    sessionStorage.clear(); // Limpia la sesión, incluida la bandera del modal
    this.usuarioSubject.next(null);
    this.router.navigate(['/']); // Redirige a la página de inicio
  }
  
// Getter para obtener el valor actual del usuario almacenado en el BehaviorSubject.

  get usuarioActual() {
    return this.usuarioSubject.value;
  }

// Consulta al backend si existen eventos con descuento disponibles para el usuario.
// Requiere autenticación mediante token.
chequearOfertas() {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    Authorization: `Token ${token}`
  });

  return this.http.get<any[]>(environment.apiUrl + 'eventos-con-oferta/', { headers });
}
// Devuelve las reservas del usuario autenticado a partir de su token.
// Se utiliza para cargar el listado de reservas personales.
getMisReservas(token: string) {
  return this.http.get<any[]>(environment.apiUrl + 'mis-reservas/', {
    headers: new HttpHeaders({ Authorization: `Token ${token}` })
  });
}
// Solicita la cancelación de una reserva específica enviando el motivo.
// Es necesario pasar el ID de la reserva y el token de autenticación.
cancelarReserva(reservaId: number, motivo: string, token: string) {
  return this.http.post(environment.apiUrl + 'cancelar-reserva/' + reservaId , 
    { motivo }, 
    {
      headers: new HttpHeaders({ Authorization: `Token ${token}` })
    }
  );
}


}


