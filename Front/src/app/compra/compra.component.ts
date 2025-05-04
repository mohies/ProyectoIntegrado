import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CarritoService } from '../services/carrito.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../enviroments/enviroments';

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

  ngOnInit(): void {
    this.carritoService.eventos$.subscribe((items) => {
      this.carrito = items;
    });

    this.iniciarTemporizador();
  }

  ngAfterViewInit(): void {
    this.cargarScriptPaypal(); 
  }

  cargarScriptPaypal() {
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${environment.paypalClientId}&currency=EUR`;
    script.onload = () => this.renderizarBotonPayPal();
    document.body.appendChild(script);
  }

  ngOnDestroy(): void {
    clearInterval(this.timerInterval);
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

  calcularTotal(): number {
    return this.carrito.reduce((acc, item) => acc + item.precio * (item.cantidad || 1), 0);
  }

  renderizarBotonPayPal() {
    const total = this.calcularTotal();
    const paypal = (window as any).paypal;
    const contenedor = document.getElementById('paypal-button-container');

    if (paypal && total > 0 && contenedor) {
      paypal.Buttons({
        createOrder: (data: any, actions: any) => {
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
              items: compra.items,
              metodo_pago: 'PayPal',
              total_pago: total
            };

            this.http.post('http://localhost:8000/api/v1/procesar-compra/', payload, { headers }).subscribe({
              next: (res) => {
                console.log('📦 Compra registrada en backend:', res);
                this.compraFinalizada = true;
                this.carritoService.vaciar();
                clearInterval(this.timerInterval);
                this.router.navigate(['/'], { queryParams: { pago: 'exitoso' } });
              },
              error: (err) => {
                console.error('❌ Error al registrar compra en backend:', err);
              }
            });
          }
        },
        onError: (err: any) => {
          console.error('❌ Error en PayPal:', err);
        }
      }).render('#paypal-button-container');
    } else {
      console.warn('⚠️ No se encontró el contenedor o PayPal no está disponible');
    }
  }

  simularCompra() {
    const compra = this.getDatosCompra();
    console.log('🧾 Datos de compra:', compra);

    if (!compra || !compra.items || compra.items.length === 0) {
      console.warn('⚠️ Carrito vacío, no se puede simular compra');
      return;
    }

    const total = this.calcularTotal();
    if (total <= 0) {
      console.warn('⚠️ Total debe ser mayor a 0 para simular compra');
      return;
    }

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Token ${token}`,
      'Content-Type': 'application/json'
    });

    const payload = {
      items: compra.items,
      metodo_pago: 'PayPal',
      total_pago: total
    };

    this.http.post('http://localhost:8000/api/v1/procesar-compra/', payload, { headers }).subscribe({
      next: (res) => {
        console.log('🧪 Compra simulada registrada en backend:', res);
        this.compraFinalizada = true;
        this.carritoService.vaciar();
        clearInterval(this.timerInterval);
        this.router.navigate(['/'], { queryParams: { pago: 'simulado' } });
      },
      error: (err) => {
        console.error('❌ Error simulando compra:', err);
        console.log('📩 Respuesta completa del error:', err.error);
      }
    });
  }
}
