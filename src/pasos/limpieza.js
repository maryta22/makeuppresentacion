import { buscarTipo } from '../perfil.js';

const LIMPIADOR = {
  seca: 'Un limpiador cremoso o en leche, sin sulfatos, para no resecar.',
  grasa: 'Un limpiador en gel o espuma que ayude a controlar el brillo.',
  mixta: 'Un gel suave: limpia la zona T sin resecar las mejillas.',
  normal: 'Un limpiador suave de uso diario es suficiente.'
};

export default {
  id: 'limpieza',
  titulo: 'Limpieza',

  mensaje: () => 'Empecemos con la cara limpia. Moja tu rostro con agua tibia y aplica tu limpiador.',

  consejos: () => [
    'Masajea en círculos suaves, sin frotar, durante 30 a 60 segundos.',
    'Recorre la frente, la nariz, las mejillas y la línea del mentón.',
    'Enjuaga con agua tibia y seca con toques suaves, sin arrastrar la toalla.'
  ],

  recomendacion: (perfil) => ({
    titulo: `Para tu piel ${buscarTipo(perfil.tipo).nombre.toLowerCase()}`,
    texto: LIMPIADOR[perfil.tipo]
  }),

  // Efecto del avatar mientras dura el paso, señalización y efecto breve al terminar.
  efecto: 'espuma',
  guia: 'limpieza',
  alTerminar: 'enjuague',
  logro: '¡Listo! Tu rostro quedó limpio y fresco.'
};
