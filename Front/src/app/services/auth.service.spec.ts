import { TestBed } from '@angular/core/testing';
import { AuthService, Usuario } from './auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';

describe('AuthService (básico)', () => {
  let service: AuthService;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockUser: Usuario = {
    id: 1,
    username: 'test',
    email: 'test@test.com',
    rol: 'USUARIO',
    foto: null
  };

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: Router, useValue: routerSpy }]
    });

    service = TestBed.inject(AuthService);
    localStorage.clear();
  });

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('setUsuario guarda el usuario y token', () => {
    service.setUsuario(mockUser, 'token123');
    expect(localStorage.getItem('token')).toBe('token123');
    expect(service.usuarioActual).toEqual(mockUser);
  });

  it('logout elimina token y redirige', () => {
    localStorage.setItem('token', 'xyz');
    service.logout();
    expect(localStorage.getItem('token')).toBeNull();
    expect(service.usuarioActual).toBeNull();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });
});
