import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CarritoService } from '../services/carrito.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-compra',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './compra.component.html',
  styleUrls: ['./compra.component.css'],
})
export class CompraComponent implements OnInit, OnDestroy, AfterViewInit {
  form: FormGroup;
  carrito: any[] = [];
  tiempoRestante: number = 300;
  private timerInterval: any;
  private compraFinalizada = false;
  mensajeError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private carritoService: CarritoService,
    private router: Router,
    private http: HttpClient
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      direccion: ['', Validators.required],
      ciudad: ['', Validators.required],
      notas: ['']
    });
  }

  // Inicializa el formulario, escucha los productos del carrito y arranca el temporizador de expiración.
  ngOnInit(): void {
    this.carritoService.eventos$.subscribe((items) => {
      this.carrito = items;
    });

    this.iniciarTemporizador();
  }

  // Carga el script de PayPal dinámicamente después de que la vista esté renderizada.
  ngAfterViewInit(): void {
    this.cargarScriptPaypal();
  }

  // Limpia el intervalo del temporizador y vacía el carrito si no se completó la compra.
  ngOnDestroy(): void {
    clearInterval(this.timerInterval);
    if (!this.compraFinalizada) {
      this.carritoService.vaciar();
    }
  }

  // Inicia un temporizador de 5 minutos. Si se agota, vacía el carrito y redirige al inicio.
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

  // Carga el script de PayPal desde la CDN y llama a renderizar el botón cuando esté listo.
  cargarScriptPaypal() {
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${environment.paypalClientId}&currency=EUR`;
    script.onload = () => this.renderizarBotonPayPal();
    document.body.appendChild(script);
  }

  // Valida el formulario y estructura los datos necesarios para enviar la compra al backend.
  getDatosCompra(): any | null {
    if (this.form.valid) {
      const datosFormulario = this.form.value;

      return {
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
    } else {
      this.form.markAllAsTouched();
      return null;
    }
  }

  // Calcula el total del carrito sumando precio × cantidad de cada producto.
  calcularTotal(): number {
    return this.carrito.reduce((acc, item) => acc + item.precio * (item.cantidad || 1), 0);
  }

  // Renderiza el botón de PayPal y configura su comportamiento (orden, aprobación, errores).
  renderizarBotonPayPal() {
    const total = this.calcularTotal();
    const paypal = (window as any).paypal;
    const contenedor = document.getElementById('paypal-button-container');

    if (paypal && total > 0 && contenedor) {
      paypal.Buttons({
        createOrder: (data: any, actions: any) => {
          if (!this.form.valid) {
            this.mensajeError = '⚠️ Por favor, completa todos los campos obligatorios antes de continuar con el pago.';
            this.form.markAllAsTouched();
            return actions.reject();
          }

          return actions.order.create({
            purchase_units: [{
              amount: {
                value: total.toFixed(2),
                currency_code: 'EUR'
              }
            }]
          });
        },
        onApprove: async (data: any, actions: any) => {
          this.mensajeError = null;
          const detalles = await actions.order.capture();
          console.log('✅ Pago completado:', detalles);
          const compra = this.getDatosCompra();
          if (compra) {
            const token = localStorage.getItem('token');
            const headers = new HttpHeaders({
              Authorization: `Token ${token}`,
              'Content-Type': 'application/json'
            });

            const payload = {
              ...compra,
              metodo_pago: 'PayPal',
              total_pago: total
            };

            this.http.post(environment.apiUrl + 'procesar-compra/', payload, { headers }).subscribe({
              next: (res) => {
                console.log('📦 Compra registrada en backend:', res);
                this.compraFinalizada = true;
                this.carritoService.vaciar();
                clearInterval(this.timerInterval);
                this.router.navigate(['/'], { queryParams: { pago: 'exitoso' } });
              },
              error: (err) => {
                console.error('❌ Error al registrar compra en backend:', err);
                this.mensajeError = err.error?.error || '❌ Error inesperado al registrar la compra.';
              }
            });
          }
        },
        onError: (err: any) => {
          console.error('❌ Error en PayPal:', err);
          this.mensajeError = '❌ Ocurrió un error en el pago con PayPal.';
        }
      }).render('#paypal-button-container');
    } else {
      console.warn('⚠️ No se encontró el contenedor o PayPal no está disponible');
    }
  }
}
