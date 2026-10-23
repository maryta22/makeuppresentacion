const GRUPO_DE_TONO = {
  claro: 'claros', 'claro-medio': 'claros',
  medio: 'medios', 'medio-oscuro': 'medios',
  oscuro: 'oscuros', profundo: 'oscuros'
};

export const COLORES = {
  claros: { nombre: 'rosa natural', color: '#C9566B' },
  medios: { nombre: 'terracota', color: '#B4513C' },
  oscuros: { nombre: 'vino', color: '#7E2038' }
};

export const colorDeLabial = (perfil) => COLORES[GRUPO_DE_TONO[perfil.tono]];

export default {
  id: 'labial',
  titulo: 'Labial',

  mensaje: () => 'Llegamos al color de los labios. Empieza por el centro.',

  consejos: () => [
    'Hidrata los labios con un bálsamo antes de empezar.',
    'Aplica desde el centro hacia las comisuras.',
    'Retira el exceso con un pañuelo y aplica una segunda capa para que dure más.'
  ],

  recomendacion: (perfil) => ({
    titulo: 'Para tu tono de piel',
    texto: `Un labial ${colorDeLabial(perfil).nombre} realza tu tono de forma natural.`
  }),

  guia: 'labial',
  aplicar: (avatar, perfil) => avatar.difuminar('labios', { color: colorDeLabial(perfil).color }),
  logro: '¡Hermoso! El labial quedó perfecto.'
};
