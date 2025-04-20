import { Component, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

declare const google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit {
  loginForm: FormGroup;
  errorMsg: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngAfterViewInit(): void {
    google.accounts.id.initialize({
      client_id: '234430080055-5ddns29uj7qkk3me3v0at4rvm2qmnhla.apps.googleusercontent.com',
      callback: (response: any) => {
        console.log('📦 Google callback:', response);

        if (response.credential) {
          console.log('✅ Credential recibida:', response.credential);
          this.enviarTokenAGoogleLogin(response.credential);
        } else {
          this.errorMsg = '❌ Error: No se recibió ningún token de Google.';
        }
      }
    });

    google.accounts.id.renderButton(
      document.getElementById('google-button'),
      {
        theme: 'outline',
        size: 'large',
        shape: 'pill',
        text: 'signin_with',
      }
    );
  }

  login() {
    this.errorMsg = null;

    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;

      this.http.post<any>('http://localhost:8000/api/v1/token-login/', credentials).subscribe({
        next: (res) => {
          console.log('✅ Login con token exitoso:', res);
          localStorage.setItem('token', res.token);
          this.authService.setUsuario(res.usuario);

          this.router.navigate([res.usuario?.rol ? '/' : '/elegir-rol']);
        },
        error: (err) => {
          console.error('❌ Error en login tradicional:', err);
          this.errorMsg = err.error?.error || 'Error inesperado en el login.';
        }
      });
    } else {
      this.errorMsg = '❗ Debes completar todos los campos correctamente.';
    }
  }

  enviarTokenAGoogleLogin(idToken: string) {
    this.errorMsg = null;

    this.http.post<any>('http://localhost:8000/api/v1/google-login/', { credential: idToken }).subscribe({
      next: (res) => {
        console.log('✅ Autenticado con Google:', res);
        localStorage.setItem('token', res.token);
        this.authService.setUsuario(res.usuario);

        this.router.navigate([res.usuario?.rol ? '/' : '/elegir-rol']);
      },
      error: (err) => {
        console.error('❌ Error al autenticar con Google:', err);
        this.errorMsg = err.error?.error || 'Error con el login de Google.';
      }
    });
  }
}
