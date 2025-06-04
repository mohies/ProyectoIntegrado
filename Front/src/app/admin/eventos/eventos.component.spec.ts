import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventosAdminComponent } from './eventos.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';

describe('EventosAdminComponent', () => {
  let component: EventosAdminComponent;
  let fixture: ComponentFixture<EventosAdminComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    // Mock del token necesario para ejecutar peticiones
    localStorage.setItem('token', 'FAKE_TOKEN');

    await TestBed.configureTestingModule({
      imports: [
        EventosAdminComponent, // componente standalone
        HttpClientTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventosAdminComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar eventos al inicializar', () => {
    const mockEventos = [
      { id: 1, titulo: 'Evento A' },
      { id: 2, titulo: 'Evento B' }
    ];

    fixture.detectChanges(); // dispara ngOnInit()

    const req = httpMock.expectOne(`${environment.apiUrl}gestion-eventos/`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Token FAKE_TOKEN');

    req.flush(mockEventos);

    expect(component.eventos.length).toBe(2);
    expect(component.eventos[0].titulo).toBe('Evento A');
  });

  afterEach(() => {
    httpMock.verify();     // Verifica que no haya peticiones pendientes
    localStorage.clear();  // Limpia el token entre pruebas
  });
});
