// Enciende las bombillas alrededor del espejo: tres a cada lado y siete en el arco.
export function encenderLuces(contenedor) {
  const lado = [88, 72, 56];
  const arco = [180, 150, 120, 90, 60, 30, 0].map((grados) => {
    const rad = (grados * Math.PI) / 180;
    return [50 + 50 * Math.cos(rad), 40 - 40 * Math.sin(rad)];
  });
  const posiciones = [
    ...lado.map((y) => [0, y]),
    ...arco,
    ...[...lado].reverse().map((y) => [100, y])
  ];
  contenedor.innerHTML = posiciones
    .map(([x, y], i) => `<span class="bombilla" style="left:${x}%;top:${y}%;animation-delay:${i * 70}ms"></span>`)
    .join('');
}
