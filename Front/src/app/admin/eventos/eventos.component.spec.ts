import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventosAdminComponent } from './eventos.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';

describe('EventosAdminComponent', () => {
  let component: EventosAdminComponent;
  let fixture: ComponentFixture<EventosAdminComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        EventosAdminComponent,
        HttpClientTestingModule 
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventosAdminComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('debería cargar eventos al inicializar', () => {
    const mockEventos = [
      { id: 1, titulo: 'Evento A' },
      { id: 2, titulo: 'Evento B' }
    ];

    fixture.detectChanges(); 

    const req = httpMock.expectOne(environment.apiUrl + 'eventos/');
    expect(req.request.method).toBe('GET');

    req.flush(mockEventos); 

    expect(component.eventos.length).toBe(2);
    expect(component.eventos[0].titulo).toBe('Evento A');
  });

  afterEach(() => {
    httpMock.verify(); 
  });
});
