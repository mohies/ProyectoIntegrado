import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-evento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './crear-evento.component.html',
  styleUrls: ['./crear-evento.component.css']
})
export class CrearEventoComponent {
  eventoForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.eventoForm = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: [''],
      fecha: ['', Validators.required],
      ubicacion: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(0)]],
      imagen: ['', Validators.required],  // 👈 URL, no file
      cupo_maximo: [100, Validators.required]
    });
  }

  crearEvento() {
    const token = localStorage.getItem('token');
    if (!token) return;

    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json'
    });

    this.http.post('http://localhost:8000/api/v1/gestion-eventos/', this.eventoForm.value, { headers }).subscribe({
      next: () => {
        alert('✅ Evento creado con éxito');
        this.router.navigate(['/eventos']);
      },
      error: (err) => {
        console.error('❌ Error al crear evento:', err);
        alert('❌ Ocurrió un error al crear el evento');
      }
    });
  }
}
