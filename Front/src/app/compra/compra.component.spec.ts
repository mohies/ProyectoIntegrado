import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CompraComponent } from './compra.component';
import { CarritoService } from '../services/carrito.service';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

describe('CompraComponent (básico)', () => {
  let component: CompraComponent;
  let fixture: ComponentFixture<CompraComponent>;
  let carritoServiceMock: any;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    carritoServiceMock = {
      eventos$: of([]), // ← observable simulado
      vaciar: jasmine.createSpy('vaciar')
    };

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        CompraComponent,
        ReactiveFormsModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: CarritoService, useValue: carritoServiceMock },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('formulario debería ser inválido al inicio', () => {
    expect(component.form.valid).toBeFalse();
  });

  it('debería marcar los campos como tocados si el formulario es inválido', () => {
    spyOn(component.form, 'markAllAsTouched');
    component.getDatosCompra();
    expect(component.form.markAllAsTouched).toHaveBeenCalled();
  });
});
