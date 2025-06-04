import { TestBed } from '@angular/core/testing';
import { RegistroService } from './registro.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

describe('RegistroService (básico)', () => {
  let service: RegistroService;
  let httpMock: HttpTestingController;
  let authSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authSpy = jasmine.createSpyObj('AuthService', ['setUsuario']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        RegistroService,
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    service = TestBed.inject(RegistroService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería registrar usuario y guardar token si la respuesta es válida', () => {
    const formData = new FormData();
    formData.append('username', 'test');

    const mockResponse = {
      token: 'abc123',
      usuario: { id: 1, username: 'test', email: 'test@test.com', rol: 'USUARIO', foto: null }
    };

    service.registrarUsuario(formData).subscribe();

    const req = httpMock.expectOne(environment.apiUrl + 'custom-register/');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);

    expect(localStorage.getItem('token')).toBe('abc123');
    expect(authSpy.setUsuario).toHaveBeenCalledWith(mockResponse.usuario);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

  it('no debe hacer nada si la respuesta no tiene token o usuario', () => {
    const formData = new FormData();

    const mockResponse = {}; // respuesta vacía o incompleta

    service.registrarUsuario(formData).subscribe();

    const req = httpMock.expectOne(environment.apiUrl + 'custom-register/');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);

    expect(localStorage.getItem('token')).toBeNull();
    expect(authSpy.setUsuario).not.toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });
});
