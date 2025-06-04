import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-crear-evento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './crear-evento.component.html',
  styleUrls: ['./crear-evento.component.css']
})
export class CrearEventoComponent {
  eventoForm: FormGroup;
  mensaje: string | null = null;
  tipoMensaje: 'success' | 'danger' | null = null;

  // Inicializa el formulario de creación de evento con validaciones básicas.
  // Incluye campos como título, descripción, fecha, ubicación, precio, imagen y cupo máximo.
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
      imagen: ['', Validators.required],  
      cupo_maximo: [100, Validators.required]
    });
  }

  // Envía los datos del formulario al backend mediante una petición POST autenticada.
  // Si la creación es exitosa, redirige al listado de eventos con mensaje.
  // Si ocurre un error, muestra un mensaje visual arriba.
  crearEvento() {
    const token = localStorage.getItem('token');
    if (!token) return;

    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json'
    });

    this.http.post(environment.apiUrl + 'gestion-eventos/', this.eventoForm.value, { headers }).subscribe({
      next: () => {
        this.router.navigate(['/eventos'], {
          queryParams: { creado: '1' }
        });
      },
      error: (err) => {
        console.error('❌ Error al crear evento:', err);
        this.mensaje = '❌ Error al crear evento.';
        this.tipoMensaje = 'danger';

        setTimeout(() => {
          this.mensaje = null;
          this.tipoMensaje = null;
        }, 4000);
      }
    });
  }
}
