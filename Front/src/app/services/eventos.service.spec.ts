import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { Evento, EventosService } from './eventbrite.service';

describe('EventosService (básico)', () => {
  let service: EventosService;
  let httpMock: HttpTestingController;

  const mockEvento: Evento = {
    id: 1,
    titulo: 'Concierto',
    descripcion: 'Evento de prueba',
    fecha: '2025-07-01',
    imagen: 'url.jpg',
    ubicacion: 'Madrid',
    precio: 20
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EventosService]
    });
    service = TestBed.inject(EventosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería obtener todos los eventos', () => {
    service.getEventos().subscribe(eventos => {
      expect(eventos.length).toBe(1);
      expect(eventos[0].titulo).toBe('Concierto');
    });

    const req = httpMock.expectOne(environment.apiUrl + 'eventos/');
    expect(req.request.method).toBe('GET');
    req.flush([mockEvento]);
  });

  it('debería obtener un evento por ID', () => {
    service.getEventoPorId(1).subscribe(evento => {
      expect(evento.id).toBe(1);
    });

    const req = httpMock.expectOne(environment.apiUrl + 'eventos/1/');
    expect(req.request.method).toBe('GET');
    req.flush(mockEvento);
  });

  it('debería obtener eventos destacados', () => {
    service.getDestacados().subscribe();
    const req = httpMock.expectOne(environment.apiUrl + 'eventos-destacados/');
    expect(req.request.method).toBe('GET');
    req.flush([mockEvento]);
  });

  it('debería obtener eventos próximos', () => {
    service.getProximos().subscribe();
    const req = httpMock.expectOne(environment.apiUrl + 'eventos-proximos/');
    expect(req.request.method).toBe('GET');
    req.flush([mockEvento]);
  });

  it('debería obtener reseñas por evento', () => {
    service.getResenasPorEvento(1).subscribe();
    const req = httpMock.expectOne(environment.apiUrl + 'resenas/?evento=1');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('debería crear una reseña con token', () => {
    const mockData = { comentario: 'Muy bien', puntuacion: 5 };
    const token = 'abc123';

    service.crearResena(mockData, token).subscribe();

    const req = httpMock.expectOne(environment.apiUrl + 'resenas/');
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe(`Token ${token}`);
    req.flush({});
  });

  it('debería obtener resumen de reseñas', () => {
    service.getResumenResenas(1).subscribe();
    const req = httpMock.expectOne(environment.apiUrl + 'eventos/1/reseñas-resumen/');
    expect(req.request.method).toBe('GET');
    req.flush({ promedio: 4.5, total: 10 });
  });

  it('debería eliminar una reseña con token', () => {
    service.eliminarResena(2, 'tok456').subscribe();
    const req = httpMock.expectOne(environment.apiUrl + 'resenas/2/');
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('Authorization')).toBe('Token tok456');
    req.flush({});
  });
});
