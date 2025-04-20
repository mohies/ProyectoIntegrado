import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-elegir-rol',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './elegir-rol.component.html',
  styleUrls: ['./elegir-rol.component.css']
})
export class ElegirRolComponent {

  constructor(private http: HttpClient, private router: Router) {}

  seleccionarRol(valor: number) {
    const token = localStorage.getItem('token'); 

    if (!token) {
      console.warn('❌ No hay token guardado');
      return;
    }

    this.http.get<any>('http://localhost:8000/api/v1/session/', {
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

        const url = `http://localhost:8000/api/v1/usuarios/${user.id}/`;

        this.http.patch(url, { rol: valor }, {
          headers: new HttpHeaders({
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          })
        }).subscribe({
          next: () => {
            console.log('✅ Rol actualizado con éxito');
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
