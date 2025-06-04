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
  usuarioAEliminar: any = null; // Usuario seleccionado para eliminar (modal)

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

  // Abre el modal de confirmación para eliminar
  abrirModalEliminar(usuario: any) {
    this.usuarioAEliminar = usuario;
    document.body.style.overflow = 'hidden';
  }

  // Cierra el modal
  cerrarModal() {
    this.usuarioAEliminar = null;
    document.body.style.overflow = 'auto';
  }

  // Elimina un usuario específico mediante una petición DELETE al backend.
  // Si se elimina correctamente, actualiza la lista local filtrando al usuario eliminado.
  confirmarEliminacion() {
    if (!this.usuarioAEliminar) return;

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Token ${token}`
    });

    this.http.delete(environment.apiUrl + `usuarios/${this.usuarioAEliminar.id}/`, { headers })
      .subscribe(() => {
        this.usuarios = this.usuarios.filter(u => u.id !== this.usuarioAEliminar.id);
        this.cerrarModal();
      });
  }
}
