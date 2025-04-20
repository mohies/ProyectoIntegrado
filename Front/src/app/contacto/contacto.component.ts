import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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

  constructor(private fb: FormBuilder) {
    this.contactoForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      tipo: ['', Validators.required],
      temas: [[], Validators.required],
      mensaje: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  enviar() {
    if (this.contactoForm.valid) {
      console.log('Formulario válido:', this.contactoForm.value);
      alert('Formulario enviado ✅');
      this.contactoForm.reset();
    } else {
      this.contactoForm.markAllAsTouched();
    }
  }
}
