import { buscarTipo } from '../perfil.js';

const GRUPO_DE_TONO = {
  claro: 'claros', 'claro-medio': 'claros',
  medio: 'medios', 'medio-oscuro': 'medios',
  oscuro: 'oscuros', profundo: 'oscuros'
};

export const COLORES = {
  claros: { nombre: 'rosa suave', color: '#EE8FA0' },
  medios: { nombre: 'durazno', color: '#E9846A' },
  oscuros: { nombre: 'frambuesa', color: '#C23E62' }
};

const FORMULA = {
  seca: 'Rubor en crema: se funde con la piel sin marcar la resequedad.',
  grasa: 'Rubor en polvo: dura más y no suma brillo.',
  mixta: 'Rubor en polvo o en crema ligera.',
  normal: 'En polvo o en crema, el que prefieras.'
};

export const colorDeRubor = (perfil) => COLORES[GRUPO_DE_TONO[perfil.tono]];

export default {
  id: 'rubor',
  titulo: 'Rubor',

  mensaje: () => 'Sonríe frente al espejo: el rubor va en la parte más alta de las mejillas.',

  consejos: () => [
    'Sonríe y aplica el rubor en la parte más alta de las mejillas.',
    'Difumina hacia arriba, en dirección a las sienes.',
    'Empieza con poco producto y ve sumando capas.'
  ],

  recomendacion: (perfil) => ({
    titulo: `Para tu piel ${buscarTipo(perfil.tipo).nombre.toLowerCase()}`,
    texto: `${FORMULA[perfil.tipo]} Tono sugerido: ${colorDeRubor(perfil).nombre}.`
  }),

  guia: 'rubor',
  aplicar: (avatar, perfil) => avatar.difuminar('rubor', { color: colorDeRubor(perfil).color, opacidad: 0.55 }),
  logro: '¡Qué buen color! Tus mejillas lucen naturales.'
};
