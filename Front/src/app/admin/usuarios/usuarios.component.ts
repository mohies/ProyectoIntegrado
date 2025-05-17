import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service'; // asegúrate de importar bien
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuarios.component.html',
})
export class UsuariosAdminComponent implements OnInit {
  usuarios: any[] = [];

  constructor(private http: HttpClient, private auth: AuthService) {}
// Al inicializar el componente, obtiene todos los usuarios desde la API usando el token de autenticación.
// Si ocurre un error, lo muestra en consola.
  ngOnInit(): void {
    const token = localStorage.getItem('token'); 

    if (!token) return;

    const headers = new HttpHeaders({
      Authorization: `Token ${token}`
    });

    this.http.get(environment.apiUrl + 'usuarios/', { headers })
      .subscribe({
        next: (res: any) => {
          this.usuarios = res;
        },
        error: (err) => {
          console.error('❌ Error cargando usuarios:', err);
        }
      });
  }
// Elimina un usuario específico mediante una petición DELETE al backend.
// Si se elimina correctamente, actualiza la lista local filtrando al usuario eliminado.
  eliminarUsuario(id: number) {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Token ${token}`
    });

    this.http.delete(environment.apiUrl + `usuarios/${id}/`, { headers })
      .subscribe(() => {
        this.usuarios = this.usuarios.filter(u => u.id !== id);
      });
  }
}
