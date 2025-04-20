// src/app/chatbot/chatbot.component.ts
import { Component } from '@angular/core';
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
export class ChatbotComponent {
  abierto = false;
  mensaje = '';
  mensajes: { de: 'usuario' | 'bot', texto: string }[] = [];

  constructor(private faqService: FaqService) {
    this.mensajes.push({
      de: 'bot',
      texto: `👋 ¡Hola! Soy el asistente de Eventia.

Puedes preguntarme cosas como:
• ¿Cómo reservo un evento?
• ¿Cómo pago?
• ¿Puedo cancelar una reserva?

📝 ¡Escríbeme tu duda y con gusto te ayudaré!`
    });
  }

  enviar() {
    const pregunta = this.mensaje.trim();
    if (!pregunta) return;

    this.mensajes.push({ de: 'usuario', texto: pregunta });
    const respuesta = this.faqService.buscarRespuesta(pregunta);
    this.mensajes.push({ de: 'bot', texto: respuesta });

    this.mensaje = '';
  }

  toggleChat() {
    this.abierto = !this.abierto;
  }
}
