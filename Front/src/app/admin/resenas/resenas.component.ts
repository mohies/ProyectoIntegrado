import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-resenas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resenas.component.html',
  styleUrls: ['./resenas.component.css']
})
export class ResenasAdminComponent implements OnInit {
  resenas: any[] = [];

  constructor(private http: HttpClient, private auth: AuthService) {}
// Al inicializar el componente, obtiene el token y realiza una petición GET para cargar todas las reseñas.
// Si hay error en la petición, lo muestra por consola.
  ngOnInit(): void {
    const token = localStorage.getItem('token');

    if (!token) return;

    const headers = new HttpHeaders({
      Authorization: `Token ${token}`
    });

    this.http.get(environment.apiUrl + 'resenas/', { headers })
      .subscribe({
        next: (res: any) => {
          this.resenas = res;
        },
        error: (err) => {
          console.error('❌ Error al obtener reseñas:', err);
        }
      });
  }
// Elimina una reseña específica mediante una petición DELETE al backend.
// Si se elimina correctamente, se actualiza la lista local quitando la reseña eliminada.
  eliminarResena(id: number) {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Token ${token}`
    });

    this.http.delete(environment.apiUrl + `resenas/${id}/`, { headers })
      .subscribe(() => {
        this.resenas = this.resenas.filter(r => r.id !== id);
      });
  }
}
