import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-resenas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resenas.component.html',
  styleUrls: ['./resenas.component.scss']
})
export class ResenasAdminComponent implements OnInit {
  resenas: any[] = [];

  constructor(private http: HttpClient, private auth: AuthService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');

    if (!token) return;

    const headers = new HttpHeaders({
      Authorization: `Token ${token}`
    });

    this.http.get('http://localhost:8000/api/v1/resenas/', { headers })
      .subscribe({
        next: (res: any) => {
          this.resenas = res;
        },
        error: (err) => {
          console.error('❌ Error al obtener reseñas:', err);
        }
      });
  }

  eliminarResena(id: number) {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Token ${token}`
    });

    this.http.delete(`http://localhost:8000/api/v1/resenas/${id}/`, { headers })
      .subscribe(() => {
        this.resenas = this.resenas.filter(r => r.id !== id);
      });
  }
}
