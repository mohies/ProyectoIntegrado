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
// Inicializa el formulario de contacto con validaciones para email, tipo, temas y mensaje.

  constructor(private fb: FormBuilder,private http: HttpClient) {
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
          alert('📧 Formulario enviado correctamente');
          this.contactoForm.reset();
        },
        error: (err) => {
          console.error('❌ Error al enviar el formulario', err);
          alert('❌ Error al enviar el mensaje');
        }
      });
    } else {
      this.contactoForm.markAllAsTouched();
    }
}

}
