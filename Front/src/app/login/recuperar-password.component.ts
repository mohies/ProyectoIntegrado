import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-recuperar-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recuperar-password.component.html'
})
export class RecuperarPasswordComponent {
  form: FormGroup;
  mensaje: string | null = null;
  error: string | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  enviar() {
    if (this.form.valid) {
      this.http.post(environment.apiUrl + 'password-reset/', this.form.value).subscribe({
        next: () => {
          this.mensaje = '📧 Se ha enviado un correo con instrucciones para restablecer tu contraseña.';
          this.error = null;
        },
        error: () => {
          this.error = '❌ No se pudo enviar el correo de recuperación.';
          this.mensaje = null;
        }
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
