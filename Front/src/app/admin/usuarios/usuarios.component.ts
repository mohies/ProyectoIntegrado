import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service'; // asegúrate de importar bien

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuarios.component.html',
})
export class UsuariosAdminComponent implements OnInit {
  usuarios: any[] = [];

  constructor(private http: HttpClient, private auth: AuthService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token'); // o puedes acceder desde auth.usuarioActual

    if (!token) return;

    const headers = new HttpHeaders({
      Authorization: `Token ${token}`
    });

    this.http.get('http://localhost:8000/api/v1/usuarios/', { headers })
      .subscribe({
        next: (res: any) => {
          this.usuarios = res;
        },
        error: (err) => {
          console.error('❌ Error cargando usuarios:', err);
        }
      });
  }

  eliminarUsuario(id: number) {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Token ${token}`
    });

    this.http.delete(`http://localhost:8000/api/v1/usuarios/${id}/`, { headers })
      .subscribe(() => {
        this.usuarios = this.usuarios.filter(u => u.id !== id);
      });
  }
}
