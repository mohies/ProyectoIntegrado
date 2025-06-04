import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service'; //  Importamos el servicio de autenticación

@Component({
  selector: 'app-elegir-rol',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './elegir-rol.component.html',
  styleUrls: ['./elegir-rol.component.css']
})
export class ElegirRolComponent {

  constructor(
    private http: HttpClient,
    private router: Router,
    private auth: AuthService // 👈 Inyectamos el AuthService
  ) {}

  // Método para seleccionar y guardar el rol del usuario.
  // Primero obtiene la sesión actual con el token guardado.
  // Luego actualiza el rol del usuario con una petición PATCH al backend.
  // Si todo va bien, recarga el usuario desde el backend y redirige al home.
  seleccionarRol(valor: number) {
    const token = localStorage.getItem('token'); 

    if (!token) {
      console.warn('❌ No hay token guardado');
      return;
    }

    // 1. Obtener usuario actual desde la sesión
    this.http.get<any>(environment.apiUrl + 'session/', {
      headers: new HttpHeaders({
        'Authorization': `Token ${token}`
      })
    }).subscribe({
      next: (res) => {
        const user = res.user;
        if (!user || !user.id) {
          console.warn('No se encontró el usuario en sesión');
          return;
        }

        const url = environment.apiUrl + `usuarios/${user.id}/`;

        // 2. Enviar PATCH al backend con el nuevo rol
        this.http.patch(url, { rol: valor }, {
          headers: new HttpHeaders({
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          })
        }).subscribe({
          next: () => {
            console.log('✅ Rol actualizado con éxito');

            // 3. Actualizamos el usuario en el frontend sin necesidad de F5
            this.auth.cargarUsuario(); //  ACTUALIZA el estado del usuario

            // 4. Redirigir al home
            this.router.navigate(['/']);
          },
          error: err => {
            console.error('❌ Error al guardar el rol:', err);
          }
        });
      },
      error: err => {
        console.error('❌ Error al obtener sesión:', err);
      }
    });
  }
}
