// src/app/services/faq.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FaqService {
  // Mapea preguntas frecuentes a respuestas automáticas.
// Se usa en el chatbot para responder preguntas básicas
  private respuestas: { [key: string]: string } = {
    'cómo reservo un evento': '📌 Ve al detalle del evento y pulsa "Reservar entrada".',
    'cómo pago': '💳 Puedes pagar usando PayPal al finalizar tu reserva.',
    'puedo cancelar una reserva': '❌ Sí, desde tu perfil en la sección "Mis reservas".',
    'cómo me registro': '📝 Haz clic en "Registrarse" en la barra superior y completa el formulario.',
    'hola': '¡Hola! ¿En qué puedo ayudarte? 😊',
    'gracias': '¡De nada! 😄'
  };
// Busca una respuesta basada en la coincidencia parcial del texto de la pregunta.
// Normaliza el texto ingresado y lo compara contra las claves predefinidas.
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
// Convierte el texto a minúsculas y elimina acentos para facilitar la comparación.
// Esto permite coincidencias más flexibles entre la entrada del usuario y las claves.
  private normalizarTexto(texto: string): string {
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
}
