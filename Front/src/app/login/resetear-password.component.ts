import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-resetear-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './resetear-password.component.html',
})
export class ResetearPasswordComponent implements OnInit {
  form: FormGroup;
  token: string = '';
  mensaje: string | null = null;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {
    this.form = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmacion: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    });
  }

  enviar() {
    if (this.form.valid && this.form.value.password === this.form.value.confirmacion) {
      const payload = {
        token: this.token,
        password: this.form.value.password
      };

      this.http.post(environment.apiUrl + 'password-reset/confirm/', payload).subscribe({
        next: () => {
          this.mensaje = '✅ Contraseña restablecida correctamente. Puedes iniciar sesión.';
          this.error = null;
          setTimeout(() => this.router.navigate(['/login']), 3000);
        },
        error: (err) => {
          console.error('❌ Error en restablecimiento:', err);

          // Captura errores específicos del backend (como la similitud con el correo)
          if (err.error?.password?.length) {
            this.error = err.error.password.join(' ');
          } else if (err.error?.token) {
            this.error = err.error.token.join(' ');
          } else {
            this.error = '❌ Error al restablecer la contraseña.';
          }

          this.mensaje = null;
        }
      });
    } else {
      this.form.markAllAsTouched();

      if (this.form.value.password !== this.form.value.confirmacion) {
        this.error = '❗ Las contraseñas no coinciden.';
      }
    }
  }
}
