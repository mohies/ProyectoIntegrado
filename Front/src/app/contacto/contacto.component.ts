import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent {
  contactoForm: FormGroup;
  form: any;

  // Mensaje visual
  mensaje: string | null = null;
  tipoMensaje: 'success' | 'danger' | null = null;

  // Inicializa el formulario de contacto con validaciones para email, tipo, temas y mensaje.
  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.contactoForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      tipo: ['', Validators.required],
      temas: [[], Validators.required],
      mensaje: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  // Envía el formulario al backend si es válido.
  // Si la solicitud es exitosa, muestra un mensaje y resetea el formulario.
  // Si hay error, muestra una alerta y lo registra en consola.
  // Si no es válido, marca todos los campos como tocados para mostrar validaciones.
  enviar() {
    if (this.contactoForm.valid) {
      const datos = this.contactoForm.value;

      this.http.post(environment.apiUrl + 'contacto/', datos).subscribe({
        next: () => {
          this.mensaje = '📧 Formulario enviado correctamente';
          this.tipoMensaje = 'success';
          this.contactoForm.reset();

          // Oculta el mensaje después de 4 segundos
          setTimeout(() => {
            this.mensaje = null;
            this.tipoMensaje = null;
          }, 4000);
        },
        error: (err) => {
          console.error('❌ Error al enviar el formulario', err);
          this.mensaje = '❌ Error al enviar el mensaje';
          this.tipoMensaje = 'danger';

          setTimeout(() => {
            this.mensaje = null;
            this.tipoMensaje = null;
          }, 4000);
        }
      });
    } else {
      this.contactoForm.markAllAsTouched();
    }
  }
}
