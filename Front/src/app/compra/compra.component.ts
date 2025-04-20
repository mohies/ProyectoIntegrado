import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-compra',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './compra.component.html',
  styleUrl: './compra.component.css',
})
export class CompraComponent {
  form: FormGroup;

  carrito = [
    {
      id: 1,
      nombre: 'Entrada Concierto',
      imagen: 'https://via.placeholder.com/150',
      precio: '25.00€'
    },
    {
      id: 2,
      nombre: 'Taller Fotografía',
      imagen: 'https://via.placeholder.com/150',
      precio: '15.00€'
    }
  ];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      direccion: ['', Validators.required],
      ciudad: ['', Validators.required],
      notas: ['']
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log('📦 Datos del formulario:', this.form.value);
      console.log('🛒 Carrito:', this.carrito);
      // Aquí iría la integración con PayPal 
    } else {
      this.form.markAllAsTouched();
    }
  }
}
