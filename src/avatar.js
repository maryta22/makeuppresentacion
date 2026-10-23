// Avatar ilustrado en SVG. Los pasos lo controlan con una API pequeña:
//   avatar.tono('#D7A07A')                        tono de piel
//   avatar.efecto('espuma') / avatar.efecto(null)  efecto continuo mientras dura un paso
//   await avatar.destello('enjuague')              efecto breve que se reproduce una vez
//   avatar.capa('labios', { color: '#B3314A' })    maquillaje que se queda puesto
//   avatar.hablar(true | false)                    mueve la boca mientras habla
//
// Capas disponibles para los pasos: base, brillo, rubor, cejas, pestanas, labios.
// Efectos continuos: espuma. Destellos: enjuague, brillo.

const SVG = `
<svg class="avatar" viewBox="0 0 320 400" role="img" aria-label="Avatar que muestra cada paso del tutorial">
  <defs>
    <filter id="suavizado" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="5" />
    </filter>
    <radialGradient id="brillo-piel" cx="50%" cy="40%" r="50%">
      <stop offset="0%" stop-color="#fff" stop-opacity="0.75" />
      <stop offset="100%" stop-color="#fff" stop-opacity="0" />
    </radialGradient>
  </defs>

  <path class="cabello" d="M60 196 C40 92 108 30 164 30 C232 32 292 92 268 204 C262 262 270 304 286 352 L36 352 C54 304 62 258 60 196 Z" />
  <path class="bata" d="M34 400 C46 336 104 316 160 316 C216 316 274 336 286 400 Z" />
  <path class="bata-cuello" d="M118 320 L160 370 L202 320" />
  <path class="piel piel-sombra" d="M128 246 L128 316 C140 332 180 332 192 316 L192 246 Z" />
  <ellipse class="piel piel-sombra" cx="70" cy="182" rx="14" ry="22" />
  <ellipse class="piel piel-sombra" cx="250" cy="182" rx="14" ry="22" />

  <path class="piel rostro" d="M160 58 C216 58 252 98 252 162 C252 222 216 272 160 280 C104 272 68 222 68 162 C68 98 104 58 160 58 Z" />
  <path class="capa-base" d="M160 58 C216 58 252 98 252 162 C252 222 216 272 160 280 C104 272 68 222 68 162 C68 98 104 58 160 58 Z" />

  <g class="capa-brillo">
    <ellipse cx="160" cy="108" rx="34" ry="12" fill="url(#brillo-piel)" />
    <ellipse cx="112" cy="186" rx="20" ry="9" fill="url(#brillo-piel)" />
    <ellipse cx="208" cy="186" rx="20" ry="9" fill="url(#brillo-piel)" />
    <ellipse cx="160" cy="182" rx="6" ry="16" fill="url(#brillo-piel)" />
  </g>

  <g class="capa-rubor" filter="url(#suavizado)">
    <ellipse cx="108" cy="204" rx="22" ry="13" />
    <ellipse cx="212" cy="204" rx="22" ry="13" />
  </g>

  <g class="cejas">
    <path d="M100 132 C112 124 128 123 142 128" />
    <path d="M178 128 C192 123 208 124 220 132" />
  </g>

  <g class="ojos-abiertos">
    <path class="ojo" d="M100 158 C110 148 132 148 142 158 C132 166 110 166 100 158 Z" />
    <circle class="iris" cx="121" cy="157" r="7" />
    <circle class="reflejo" cx="123.5" cy="154.5" r="2" />
    <path class="parpado" d="M98 158 C110 146 132 146 144 157" />
    <path class="ojo" d="M220 158 C210 148 188 148 178 158 C188 166 210 166 220 158 Z" />
    <circle class="iris" cx="199" cy="157" r="7" />
    <circle class="reflejo" cx="201.5" cy="154.5" r="2" />
    <path class="parpado" d="M222 158 C210 146 188 146 176 157" />
  </g>
  <g class="ojos-cerrados">
    <path class="parpado" d="M100 160 C112 168 130 168 142 160" />
    <path class="parpado" d="M178 160 C190 168 208 168 220 160" />
  </g>
  <g class="capa-pestanas">
    <path d="M100 156 l-7 -5 M105 151 l-5 -8 M112 148 l-3 -8 M220 156 l7 -5 M215 151 l5 -8 M208 148 l3 -8" />
  </g>

  <path class="nariz" d="M160 170 C158 190 152 200 150 205 C155 209 165 209 170 205" />

  <g class="boca">
    <path class="labios" d="M134 232 C142 224 152 224 160 229 C168 224 178 224 186 232 C176 236 144 236 134 232 Z" />
    <path class="labios labio-inferior" d="M134 232 C144 236 176 236 186 232 C180 246 168 252 160 252 C152 252 140 246 134 232 Z" />
    <path class="comisura" d="M136 232 C150 236 170 236 184 232" />
  </g>

  <path class="cabello" d="M70 152 C64 90 112 50 168 52 C216 54 248 86 256 132 C228 106 192 88 150 94 C118 100 92 122 70 152 Z" />
  <path class="diadema" d="M72 132 C88 72 232 72 248 132 C234 102 194 84 160 84 C126 84 86 102 72 132 Z" />
  <ellipse class="diadema" cx="228" cy="94" rx="14" ry="10" />

  <g class="espuma">
    <path class="remolino" d="M88 206 a20 13 0 1 1 40 0" />
    <path class="remolino" d="M192 206 a20 13 0 1 1 40 0" />
    <path class="remolino" d="M136 112 a24 10 0 1 1 48 0" />
    <circle class="burbuja" cx="132" cy="114" r="9" />
    <circle class="burbuja" cx="150" cy="106" r="7" />
    <circle class="burbuja" cx="170" cy="110" r="10" />
    <circle class="burbuja" cx="190" cy="116" r="6" />
    <circle class="burbuja" cx="96" cy="196" r="8" />
    <circle class="burbuja" cx="110" cy="214" r="10" />
    <circle class="burbuja" cx="124" cy="200" r="6" />
    <circle class="burbuja" cx="224" cy="196" r="8" />
    <circle class="burbuja" cx="210" cy="214" r="10" />
    <circle class="burbuja" cx="196" cy="200" r="6" />
    <circle class="burbuja" cx="152" cy="262" r="7" />
    <circle class="burbuja" cx="168" cy="266" r="9" />
  </g>

  <g class="gotas">
    <path class="gota" transform="translate(84 196)" d="M0 0 C3 5 6 9 6 12 A6 6 0 0 1 -6 12 C-6 9 -3 5 0 0 Z" />
    <path class="gota" transform="translate(236 204)" d="M0 0 C3 5 6 9 6 12 A6 6 0 0 1 -6 12 C-6 9 -3 5 0 0 Z" />
    <path class="gota" transform="translate(124 252)" d="M0 0 C3 5 6 9 6 12 A6 6 0 0 1 -6 12 C-6 9 -3 5 0 0 Z" />
    <path class="gota" transform="translate(196 252)" d="M0 0 C3 5 6 9 6 12 A6 6 0 0 1 -6 12 C-6 9 -3 5 0 0 Z" />
    <path class="gota" transform="translate(160 274)" d="M0 0 C3 5 6 9 6 12 A6 6 0 0 1 -6 12 C-6 9 -3 5 0 0 Z" />
  </g>

  <g class="destellos">
    <path class="destello" transform="translate(236 112)" d="M0 -12 L3 -3 L12 0 L3 3 L0 12 L-3 3 L-12 0 L-3 -3 Z" />
    <path class="destello" transform="translate(84 236)" d="M0 -9 L2 -2 L9 0 L2 2 L0 9 L-2 2 L-9 0 L-2 -2 Z" />
    <path class="destello" transform="translate(206 250)" d="M0 -7 L2 -2 L7 0 L2 2 L0 7 L-2 2 L-7 0 L-2 -2 Z" />
  </g>
</svg>`;

const CAPAS = ['base', 'brillo', 'rubor', 'cejas', 'pestanas', 'labios'];
const esperar = (ms) => new Promise((resolver) => setTimeout(resolver, ms));
const menosMovimiento = () => globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export function crearAvatar(contenedor) {
  contenedor.innerHTML = SVG;
  const raiz = contenedor.querySelector('.avatar');

  const quitarClases = (prefijo) => {
    [...raiz.classList].filter((clase) => clase.startsWith(prefijo)).forEach((clase) => raiz.classList.remove(clase));
  };

  return {
    tono(color) {
      raiz.style.setProperty('--piel', color);
    },

    efecto(nombre) {
      quitarClases('efecto-');
      if (nombre) raiz.classList.add(`efecto-${nombre}`);
    },

    async destello(nombre) {
      raiz.classList.add(`destello-${nombre}`);
      await esperar(menosMovimiento() ? 300 : 1600);
      raiz.classList.remove(`destello-${nombre}`);
    },

    capa(nombre, { color, opacidad = 1, grosor } = {}) {
      if (!CAPAS.includes(nombre)) throw new Error(`Capa desconocida: ${nombre}`);
      if (color) raiz.style.setProperty(`--capa-${nombre}-color`, color);
      if (grosor) raiz.style.setProperty(`--capa-${nombre}-grosor`, `${grosor}px`);
      raiz.style.setProperty(`--capa-${nombre}-opacidad`, String(opacidad));
    },

    hablar(activo) {
      raiz.classList.toggle('hablando', activo);
    },

    reiniciar() {
      quitarClases('efecto-');
      quitarClases('destello-');
      raiz.classList.remove('hablando');
      CAPAS.forEach((nombre) => {
        ['color', 'opacidad', 'grosor'].forEach((prop) => raiz.style.removeProperty(`--capa-${nombre}-${prop}`));
      });
    }
  };
}
