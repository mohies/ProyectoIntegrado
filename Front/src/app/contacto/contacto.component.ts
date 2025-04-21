import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

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

  constructor(private fb: FormBuilder,private http: HttpClient) {
    this.contactoForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      tipo: ['', Validators.required],
      temas: [[], Validators.required],
      mensaje: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  enviar() {
    if (this.contactoForm.valid) {
      const datos = this.contactoForm.value;
  
      this.http.post('http://localhost:8000/api/v1/contacto/', datos).subscribe({
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
