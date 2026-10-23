// Opciones para el perfil de la persona: el tono del rostro y el tipo de piel.

export const TONOS = [
  { id: 'claro', nombre: 'Claro', color: '#F6D7C3' },
  { id: 'claro-medio', nombre: 'Claro medio', color: '#EBC1A2' },
  { id: 'medio', nombre: 'Medio', color: '#D7A07A' },
  { id: 'medio-oscuro', nombre: 'Medio oscuro', color: '#B97A52' },
  { id: 'oscuro', nombre: 'Oscuro', color: '#8D5634' },
  { id: 'profundo', nombre: 'Profundo', color: '#5E3622' }
];

export const TIPOS_PIEL = [
  { id: 'seca', nombre: 'Seca', descripcion: 'Se siente tirante y a veces se descama.' },
  { id: 'grasa', nombre: 'Grasa', descripcion: 'Brilla durante el día, sobre todo en la frente y la nariz.' },
  { id: 'mixta', nombre: 'Mixta', descripcion: 'Grasa en la zona T, normal o seca en las mejillas.' },
  { id: 'normal', nombre: 'Normal', descripcion: 'Equilibrada, sin brillo ni tirantez.' }
];

export function buscarTono(id) {
  return TONOS.find((tono) => tono.id === id);
}

export function buscarTipo(id) {
  return TIPOS_PIEL.find((tipo) => tipo.id === id);
}

export function perfilCompleto(perfil) {
  return Boolean(buscarTono(perfil?.tono) && buscarTipo(perfil?.tipo));
}
