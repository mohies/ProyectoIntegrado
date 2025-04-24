import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CarritoService } from '../services/carrito.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-compra',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './compra.component.html',
  styleUrls: ['./compra.component.css'],
})
export class CompraComponent implements OnInit, OnDestroy {
  form: FormGroup;
  carrito: any[] = [];
  tiempoRestante: number = 300; // ⏱️ 5 minutos
  private timerInterval: any;
  private compraFinalizada = false; // 👈 FLAG para saber si el usuario pagó

  constructor(
    private fb: FormBuilder,
    private carritoService: CarritoService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      direccion: ['', Validators.required],
      ciudad: ['', Validators.required],
      notas: ['']
    });
  }

  ngOnInit(): void {
    this.carritoService.eventos$.subscribe((items) => {
      this.carrito = items;
    });

    this.iniciarTemporizador();
  }

  ngOnDestroy(): void {
    clearInterval(this.timerInterval);
    
    //  Solo vacía si no se completó la compra
    if (!this.compraFinalizada) {
      this.carritoService.vaciar();
    }
  }

  iniciarTemporizador() {
    this.timerInterval = setInterval(() => {
      this.tiempoRestante--;

      if (this.tiempoRestante <= 0) {
        clearInterval(this.timerInterval);
        this.carritoService.vaciar();
        this.router.navigate(['/'], {
          queryParams: { expirado: '1' }
        });
      }
    }, 1000);
  }

  onSubmit(): void {
    if (this.form.valid) {
      const datosFormulario = this.form.value;

      const compra = {
        usuario: datosFormulario.email,
        direccion: datosFormulario.direccion,
        ciudad: datosFormulario.ciudad,
        notas: datosFormulario.notas,
        items: this.carrito.map(item => ({
          evento_id: item.id,
          cantidad: item.cantidad || 1,
          precio: item.precio
        }))
      };

      console.log('📦 Compra:', compra);

      this.compraFinalizada = true; // ✅ Flag para que no se vacíe en ngOnDestroy
      this.carritoService.vaciar(); // Limpieza manual
      clearInterval(this.timerInterval);
      this.router.navigate(['/']);
    } else {
      this.form.markAllAsTouched();
    }
  }

  calcularTotal(): number {
    return this.carrito.reduce((acc, item) => acc + item.precio * (item.cantidad || 1), 0);
  }
}
