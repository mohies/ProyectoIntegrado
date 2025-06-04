import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import esLocale from '@fullcalendar/core/locales/es';
import { CalendarOptions } from '@fullcalendar/core';
import { EventosService, Evento } from '../services/eventbrite.service';

@Component({
  selector: 'app-calendario-eventos',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './calendarioeventos.component.html',
  styleUrls: ['./calendarioeventos.component.css']
})
export class CalendarioEventosComponent implements OnInit {
calendarOptions: CalendarOptions = {
  plugins: [dayGridPlugin],
  initialView: 'dayGridMonth',
  locale: esLocale,
  height: 'auto',
  contentHeight: 'auto',
  aspectRatio: 1.2,
  fixedWeekCount: false, 
  dayMaxEventRows: true, 
  
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: ''
  },
  events: [],
  eventClick: (info) => {
    const url = info.event.url;
    if (url) {
      window.open(url, '_blank');
      info.jsEvent.preventDefault();
    }
  }
};


  constructor(private eventosService: EventosService) {}

  ngOnInit(): void {
    this.eventosService.getEventos().subscribe((eventos: Evento[]) => {
      this.calendarOptions.events = eventos.map(e => ({
        title: e.titulo,
        date: e.fecha,
        url: `/evento/${e.id}`
      }));
    });
  }
}
