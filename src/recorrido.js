// El recorrido completo del tutorial, en orden.
// Cada paso vive en su propio archivo: src/pasos/<id>.js.
// Un paso cuyo archivo todavía no existe se muestra como "próximamente" y se salta.

export const RECORRIDO = [
  { id: 'limpieza', titulo: 'Limpieza' },
  { id: 'hidratacion', titulo: 'Hidratación' },
  { id: 'primer', titulo: 'Primer' },
  { id: 'base', titulo: 'Base' },
  { id: 'rubor', titulo: 'Rubor' },
  { id: 'cejas', titulo: 'Cejas' },
  { id: 'pestanas', titulo: 'Pestañas' },
  { id: 'labial', titulo: 'Labial' }
];

const importarPaso = (id) => import(`./pasos/${id}.js`);

// Devuelve un Map id → paso con los pasos que ya existen.
export async function cargarPasos(importar = importarPaso) {
  const disponibles = new Map();
  await Promise.all(RECORRIDO.map(async ({ id }) => {
    try {
      const modulo = await importar(id);
      disponibles.set(id, modulo.default);
    } catch {
      // El paso todavía no existe: queda como "próximamente".
    }
  }));
  return disponibles;
}

export function primerPaso(disponibles) {
  return RECORRIDO.find(({ id }) => disponibles.has(id))?.id ?? null;
}

// Qué viene después de un paso:
// - { tipo: 'paso', id }: el siguiente paso disponible, saltando los que no existen.
// - { tipo: 'pendiente', id, titulo }: no quedan pasos disponibles; este es el siguiente que falta.
// - { tipo: 'fin' }: se completó todo el recorrido.
export function siguientePaso(actualId, disponibles) {
  const restantes = RECORRIDO.slice(RECORRIDO.findIndex(({ id }) => id === actualId) + 1);
  const disponible = restantes.find(({ id }) => disponibles.has(id));
  if (disponible) return { tipo: 'paso', id: disponible.id };
  const pendiente = restantes[0];
  if (pendiente) return { tipo: 'pendiente', id: pendiente.id, titulo: pendiente.titulo };
  return { tipo: 'fin' };
}

export function numeroDePaso(id) {
  return RECORRIDO.findIndex((paso) => paso.id === id) + 1;
}
