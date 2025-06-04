import { Component, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

declare const google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule,RouterModule],
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

  // Método llamado al inicializar el componente. Verifica si hay un mensaje de error
  // guardado en localStorage (usualmente colocado por un guard) y lo muestra.
  // Luego elimina el mensaje para evitar que se repita en futuras visitas.
  ngOnInit(): void {
    const msg = localStorage.getItem('loginMessage');
    if (msg) {
      this.errorMsg = msg;
      localStorage.removeItem('loginMessage');
    }
  }
// Se ejecuta después de que la vista ha sido completamente inicializada.
// Inicializa el botón de login de Google y define el callback que se ejecutará
// al recibir un token de autenticación desde el sistema de Google Identity.
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
// Realiza el proceso de login tradicional utilizando las credenciales ingresadas
// por el usuario. Si el login es exitoso, guarda el token en localStorage, establece
// los datos del usuario en el AuthService y redirige según si el usuario tiene rol asignado.
  login() {
    this.errorMsg = null;

    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;

      this.http.post<any>(environment.apiUrl + 'token-login/', credentials).subscribe({
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
// Método llamado después de que el usuario se autentica con Google y se recibe
// un token (ID Token). Envía ese token al backend para verificar la identidad,
// obtener el token de sesión y los datos del usuario, y establecer la sesión en Angular.
  enviarTokenAGoogleLogin(idToken: string) {
    this.errorMsg = null;

    this.http.post<any>(environment.apiUrl + 'google-login/', { credential: idToken }).subscribe({
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
