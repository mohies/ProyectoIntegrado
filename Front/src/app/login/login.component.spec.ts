import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../services/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

describe('LoginComponent (básico)', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    // Mock del botón de Google
    (window as any).google = {
      accounts: {
        id: {
          initialize: () => {},
          renderButton: () => {}
        }
      }
    };

    authServiceSpy = jasmine.createSpyObj('AuthService', ['setUsuario']);

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule  
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
        
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  it('debería crearse correctamente', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('formulario debería ser inválido al inicio', () => {
    expect(component.loginForm.valid).toBeFalse();
    expect(component.loginForm.get('username')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
  });

  it('debería mostrar mensaje de localStorage si existe loginMessage', () => {
    localStorage.setItem('loginMessage', 'Debe iniciar sesión');
    component.ngOnInit();
    expect(component.errorMsg).toBe('Debe iniciar sesión');
    expect(localStorage.getItem('loginMessage')).toBeNull();
  });
});
