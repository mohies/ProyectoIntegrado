import { Component, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FaqService } from '../services/faq.service';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements AfterViewChecked {
  abierto = false;
  mensaje = '';
  mensajes: { de: 'usuario' | 'bot', texto: string }[] = [];
  mostrarSugerencias = true;

  sugerencias: string[] = [
    '¿Cómo reservo un evento?',
    '¿Cómo pago?',
    '¿Puedo cancelar una reserva?',
    '¿Cómo me registro?',
    'Hola',
    'Gracias'
  ];

  @ViewChild('chatBody') private chatBody!: ElementRef;
  @ViewChild('scrollAnchor') private scrollAnchor!: ElementRef;

  constructor(private faqService: FaqService) {
    this.saludoInicial();
  }

  ngAfterViewChecked() {
    this.scrollSiEstaAbajo();
  }

  private scrollSiEstaAbajo() {
    if (!this.chatBody || !this.scrollAnchor) return;

    const bodyEl = this.chatBody.nativeElement;
    const estaCasiAbajo =
      bodyEl.scrollHeight - bodyEl.scrollTop <= bodyEl.clientHeight + 50;

    if (estaCasiAbajo) {
      this.scrollAnchor.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  saludoInicial() {
    this.mensajes.push({ de: 'bot', texto: `👋 ¡Hola! Soy el asistente de Eventia.` });
    this.mensajes.push({ de: 'bot', texto: `Puedes preguntarme cosas como:` });
  }

  enviar(textoManual?: string) {
    const pregunta = textoManual?.trim() || this.mensaje.trim();
    if (!pregunta) return;

    this.mensajes.push({ de: 'usuario', texto: pregunta });
    const respuesta = this.faqService.buscarRespuesta(pregunta);
    this.mensajes.push({ de: 'bot', texto: respuesta });

    this.mensaje = '';

    if (!pregunta.toLowerCase().includes('gracias')) {
      this.mensajes.push({ de: 'bot', texto: '¿Te puedo ayudar en algo más?' });
    }

    this.mostrarSugerencias = true;
  }

  usarSugerencia(opcion: string) {
    this.enviar(opcion);
  }

  toggleChat() {
    this.abierto = !this.abierto;
    if (this.abierto && this.mensajes.length === 0) {
      this.saludoInicial();
    }
  }
}
