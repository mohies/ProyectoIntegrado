import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RegistroService } from '../services/registro.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  form: FormGroup;
  errorMsg: string | null = null;
  successMsg: string | null = null;
  backendErrors: Record<string, string> = {};
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private registroService: RegistroService,
    private router: Router
  ) {
    this.form = this.fb.group(
      {
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        rol: ['3', Validators.required],
        foto: [null]
      },
      { validators: this.passwordsMatchValidator }
    );
  }
// Valida que los campos 'password' y 'confirmPassword' coincidan.
// Se usa como validador personalizado del formulario.
  passwordsMatchValidator(group: FormGroup): { [key: string]: any } | null {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { passwordsMismatch: true };
  }
// Captura el archivo seleccionado por el usuario para subir una foto.
// Almacena el archivo en la propiedad 'selectedFile' del componente.
  onFileChange(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (file) {
      this.selectedFile = file;
    }
  }
// Envía los datos del formulario al backend si es válido.
// Utiliza FormData para incluir la imagen y otros campos.
// Maneja respuestas exitosas y errores del backend, mostrando mensajes apropiados.
// Redirige al inicio tras el registro exitoso.
  onSubmit() {
    this.backendErrors = {};
    this.errorMsg = null;
    this.successMsg = null;

    if (this.form.valid) {
      const formData = new FormData();
      formData.append('username', this.form.value.username);
      formData.append('email', this.form.value.email);
      formData.append('password', this.form.value.password);
      formData.append('rol', this.form.value.rol);

      if (this.selectedFile) {
        formData.append('foto', this.selectedFile);
      }

      this.registroService.registrarUsuario(formData).subscribe({
        next: () => {
          this.successMsg = '✅ Usuario registrado correctamente.';
          this.form.reset();
          this.selectedFile = null;

          // Redirigir al inicio 
          this.router.navigate(['/']);
        },
        error: (err) => {
          const errores = err?.error;
        
          if (typeof errores === 'object') {
            for (const campo in errores) {
              if (Array.isArray(errores[campo])) {
                this.backendErrors[campo] = errores[campo][0];
              }
            }
          } else if (typeof errores === 'string') {
            this.errorMsg = errores; //  Aquí se captura el mensaje del backend tipo string
          } else if (errores?.error) {
            this.errorMsg = errores.error;
          } else {
            this.errorMsg = '❌ Error inesperado al registrar.';
          }
        }
        
        
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
