// src/app/services/faq.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FaqService {
  private respuestas: { [key: string]: string } = {
    'cómo reservo un evento': '📌 Ve al detalle del evento y pulsa "Reservar entrada".',
    'cómo pago': '💳 Puedes pagar usando PayPal al finalizar tu reserva.',
    'puedo cancelar una reserva': '❌ Sí, desde tu perfil en la sección "Mis reservas".',
    'cómo me registro': '📝 Haz clic en "Registrarse" en la barra superior y completa el formulario.',
    'hola': '¡Hola! ¿En qué puedo ayudarte? 😊',
    'gracias': '¡De nada! 😄'
  };

  buscarRespuesta(pregunta: string): string {
    const normalizada = this.normalizarTexto(pregunta);

    for (const clave in this.respuestas) {
      const claveNormalizada = this.normalizarTexto(clave);
      if (normalizada.includes(claveNormalizada)) {
        return this.respuestas[clave];
      }
    }

    return '❓ Lo siento, no entendí la pregunta. Intenta con otra o contacta soporte.';
  }

  private normalizarTexto(texto: string): string {
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
}
