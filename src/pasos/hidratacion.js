import { buscarTipo } from '../perfil.js';

const PRODUCTO = {
  seca: 'Un sérum hidratante sobre la piel aún húmeda y, después, una crema nutritiva para sellar la hidratación.',
  grasa: 'Un gel o una crema ligera sin aceites: hidrata sin sumar brillo.',
  mixta: 'Una crema ligera en todo el rostro, con un poco más en las mejillas si se sienten tirantes.',
  normal: 'Una crema humectante ligera de uso diario.'
};

// Intensidad del brillo de piel hidratada en el avatar.
export const BRILLO = { seca: 0.6, normal: 0.45, mixta: 0.4, grasa: 0.25 };

export default {
  id: 'hidratacion',
  titulo: 'Hidratación',

  mensaje: (perfil) => perfil.tipo === 'seca'
    ? 'Tu piel pide un extra de hidratación: primero el sérum y luego la crema.'
    : 'Ahora hidratamos. Coloca un poco de crema en la frente, las mejillas y el mentón.',

  consejos: () => [
    'Coloca el producto en puntos: frente, mejillas y mentón.',
    'Extiéndelo hacia afuera y hacia arriba con toques suaves, sin estirar la piel.',
    'Espera uno o dos minutos a que se absorba antes de seguir con el primer.'
  ],

  recomendacion: (perfil) => ({
    titulo: `Para tu piel ${buscarTipo(perfil.tipo).nombre.toLowerCase()}`,
    texto: PRODUCTO[perfil.tipo]
  }),

  guia: 'hidratacion',
  aplicar: (avatar, perfil) => avatar.difuminar('brillo', { guia: 'hidratacion', opacidad: BRILLO[perfil.tipo] }),
  logro: '¡Listo! Tu piel quedó hidratada y lista para el maquillaje.'
};
