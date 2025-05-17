import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { AuthService, Usuario } from '../services/auth.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  perfilForm!: FormGroup;
  imagenPreview: string | null = null;
  selectedFile: File | null = null;

  successMsg: string | null = null;
  backendErrors: string[] = [];
  usuarioActual: Usuario | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private auth: AuthService
  ) {}
// Se ejecuta al iniciar el componente.
// Inicializa el formulario de perfil y carga los datos del usuario actual en los campos del formulario.
  ngOnInit(): void {
    this.perfilForm = this.fb.group({
      username: ['', Validators.required],
      email: [{ value: '', disabled: true }],
      foto: [null]
    });

    this.auth.usuario$.subscribe((user) => {
      if (user) {
        this.perfilForm.patchValue({
          username: user.username,
          email: user.email
        });
        this.imagenPreview = user.foto;
    
        this.usuarioActual = user; 
      }
    });
    

    this.auth.cargarUsuario();
  }
// Maneja el cambio de archivo en el input de imagen.
// Lee la imagen seleccionada y genera una vista previa en base64.
  onFileChange(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
// Envía los datos del formulario (nombre de usuario y foto) al backend para actualizar el perfil del usuario.
// Usa un FormData para enviar también el archivo de imagen si ha sido seleccionado.
// Muestra mensajes de éxito o errores dependiendo de la respuesta del servidor.
  guardarCambios() {
    this.successMsg = null;
    this.backendErrors = [];

    const token = localStorage.getItem('token');
    if (!token) return;

    const formData = new FormData();
    formData.append('username', this.perfilForm.value.username);
    if (this.selectedFile) {
      formData.append('foto', this.selectedFile);
    }

    const headers = new HttpHeaders({
      Authorization: `Token ${token}`
    });

    const userId = this.auth.usuarioActual?.id;
    if (!userId) return;

    this.http.patch<Usuario>(environment.apiUrl + 'usuarios/' + userId + '/', formData, { headers }).subscribe({
      next: (usuarioActualizado) => {
        this.successMsg = '✅ Perfil actualizado correctamente.';
        this.auth.setUsuario(usuarioActualizado); // Actualiza observable
      },
      error: (err) => {
        const errores = err?.error;
        if (typeof errores === 'object') {
          for (const campo in errores) {
            if (Array.isArray(errores[campo])) {
              this.backendErrors.push(errores[campo][0]);
            }
          }
        } else {
          this.backendErrors.push('❌ Error inesperado al actualizar perfil.');
        }
      }
    });
  }
}
