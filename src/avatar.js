// Avatar ilustrado en SVG, con luces y sombras. Los pasos lo controlan con una API pequeña:
//   avatar.tono('#D7A07A')                        tono de piel
//   avatar.efecto('espuma') / avatar.efecto(null)  efecto continuo mientras dura un paso
//   await avatar.destello('enjuague')              efecto breve que se reproduce una vez
//   avatar.capa('labios', { color: '#B3314A' })    maquillaje que se queda puesto
//   avatar.guia('bronceador') / avatar.guia(null)  señaliza dónde aplicar y hacia dónde difuminar
//   avatar.hablar(true | false)                    mueve la boca mientras habla
//
// Capas: base, brillo, bronceador, iluminador, rubor, cejas, sombra, pestanas, labios.
// Efectos continuos: espuma, bruma. Destellos (una vez): enjuague, brillo, bruma.
// Guías: una por cada paso del recorrido (ver GUIAS).

const CAPAS = ['base', 'brillo', 'bronceador', 'iluminador', 'rubor', 'cejas', 'sombra', 'pestanas', 'labios'];

// ---------- Señalizaciones ----------
// Coordenadas del lado izquierdo del rostro; `simetrico` las refleja al lado derecho.

const n = (valor) => Math.round(valor * 10) / 10;
const lazo = (cx, cy, rx, ry) =>
  `<path class="flecha" marker-end="url(#ID-punta)" d="M${n(cx + rx)} ${cy} A${rx} ${ry} 0 1 1 ${n(cx + 0.5 * rx)} ${n(cy - 0.866 * ry)}" />`;
const flecha = (x1, y1, x2, y2, cx = (x1 + x2) / 2, cy = (y1 + y2) / 2, doble = false) =>
  `<path class="flecha" marker-end="url(#ID-punta)"${doble ? ' marker-start="url(#ID-punta)"' : ''} d="M${x1} ${y1} Q${n(cx)} ${n(cy)} ${x2} ${y2}" />`;
const punto = (x, y) => `<circle class="punto" cx="${x}" cy="${y}" r="4.5" />`;
const zona = (d, clase = '') => `<path class="zona ${clase}" d="${d}" />`;
const ovalo = (cx, cy, rx, ry, giro = 0) =>
  `<ellipse class="zona" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" transform="rotate(${giro} ${cx} ${cy})" />`;
const simetrico = (marcas) => `<g>${marcas}</g><g transform="matrix(-1 0 0 1 320 0)">${marcas}</g>`;

const MARCAS = {
  limpieza:
    lazo(160, 111, 38, 14) +
    simetrico(lazo(110, 206, 24, 18)) +
    lazo(160, 264, 20, 9),
  hidratacion:
    punto(160, 104) + punto(160, 258) +
    simetrico(punto(110, 198) + flecha(110, 198, 86, 168, 92, 190) + flecha(156, 100, 122, 92, 140, 90)) +
    flecha(160, 254, 160, 238),
  primer:
    zona('M108 100 Q160 84 212 100 L208 124 Q160 116 112 124 Z M151 128 L169 128 L173 196 L147 196 Z') +
    simetrico(flecha(146, 108, 116, 104, 130, 100) + flecha(110, 198, 84, 184, 94, 196)) +
    simetrico(punto(110, 198)),
  base:
    punto(160, 104) + punto(160, 188) + punto(160, 258) +
    simetrico(punto(110, 198) + flecha(110, 198, 80, 180, 88, 196) + flecha(154, 102, 118, 88, 134, 88) +
      flecha(152, 260, 124, 268, 136, 270)),
  bronceador:
    simetrico(zona('M88 102 Q104 138 84 160 Q114 196 96 222 Q116 248 128 272', 'linea') +
      flecha(108, 220, 84, 198, 92, 214)),
  iluminador:
    ovalo(160, 172, 4, 13) + ovalo(160, 221, 8, 3) +
    simetrico(ovalo(116, 182, 16, 5, -12) + ovalo(122, 139, 12, 3.5) + flecha(126, 182, 98, 168, 108, 172)),
  rubor:
    simetrico(`<circle class="zona" cx="108" cy="204" r="14" />` + flecha(112, 198, 88, 168, 94, 186)),
  cejas:
    simetrico(punto(141, 131) + flecha(139, 129, 99, 129, 120, 116) + flecha(141, 132, 139, 121, 143, 126)),
  'sombra-ojos':
    simetrico(zona('M99 156 C106 139 135 137 145 155 C133 147 111 147 99 156 Z') +
      flecha(98, 145, 146, 145, 122, 130, true)),
  pestanas:
    simetrico(flecha(107, 152, 101, 136, 101, 146) + flecha(121, 148, 120, 131, 124, 140) + flecha(134, 150, 140, 135, 134, 142)),
  labial:
    zona('M132 232 C141 223 152 222 160 228 C168 222 179 223 188 232 C181 247 169 253 160 253 C151 253 139 247 132 232 Z') +
    simetrico(flecha(156, 238, 136, 233, 146, 240)),
  sellador:
    flecha(104, 104, 216, 254, 160, 179) + flecha(216, 104, 104, 254, 160, 179) +
    flecha(108, 96, 212, 96, 160, 90) + flecha(160, 100, 160, 196, 164, 148) +
    `<text class="nota-guia" x="226" y="74">a 20 cm</text>`
};

export const GUIAS = Object.keys(MARCAS);

const SVG_GUIAS = Object.entries(MARCAS)
  .map(([id, marcas]) => `<g class="guia" data-guia="${id}">${marcas}</g>`)
  .join('');

// ---------- Ilustración ----------

const ROSTRO = 'M160 58 C216 58 252 98 252 162 C252 222 216 272 160 280 C104 272 68 222 68 162 C68 98 104 58 160 58 Z';
const OJO_IZQ = 'M100 158 C110 148 132 148 142 158 C132 166 110 166 100 158 Z';
const OJO_DER = 'M220 158 C210 148 188 148 178 158 C188 166 210 166 220 158 Z';

const ojoAbierto = (x, recorte) => `
  <path class="ojo" fill="url(#ID-g-ojo)" d="${x < 160 ? OJO_IZQ : OJO_DER}" />
  <g clip-path="url(#ID-${recorte})">
    <circle class="iris" fill="url(#ID-g-iris)" cx="${x}" cy="157" r="7.5" />
    <circle class="pupila" cx="${x}" cy="157" r="3.2" />
    <circle class="reflejo" cx="${x + 2.8}" cy="154.4" r="1.8" />
    <circle class="reflejo" cx="${x - 2}" cy="159.6" r="0.9" />
  </g>`;

const SVG = `
<svg class="avatar" viewBox="0 0 320 400" role="img" aria-label="Avatar que muestra cada paso del tutorial">
  <defs>
    <radialGradient id="ID-g-piel" cx="50%" cy="38%" r="65%">
      <stop offset="0%" style="stop-color: var(--piel-luz)" />
      <stop offset="55%" style="stop-color: var(--piel)" />
      <stop offset="100%" style="stop-color: var(--piel-sombra)" />
    </radialGradient>
    <linearGradient id="ID-g-cuello" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" style="stop-color: var(--piel-sombra-2)" />
      <stop offset="40%" style="stop-color: var(--piel-sombra)" />
      <stop offset="100%" style="stop-color: var(--piel)" />
    </linearGradient>
    <linearGradient id="ID-g-cabello" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#4E3128" />
      <stop offset="100%" stop-color="#28160F" />
    </linearGradient>
    <radialGradient id="ID-g-ojo" cx="50%" cy="45%" r="60%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#E9DDD9" />
    </radialGradient>
    <radialGradient id="ID-g-iris">
      <stop offset="0%" stop-color="#8A5C3C" />
      <stop offset="55%" stop-color="#4A2C1C" />
      <stop offset="100%" stop-color="#1C100A" />
    </radialGradient>
    <linearGradient id="ID-g-labios" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" style="stop-color: var(--labios-oscuro)" />
      <stop offset="100%" style="stop-color: var(--labios)" />
    </linearGradient>
    <radialGradient id="ID-g-luz" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fff" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#fff" stop-opacity="0" />
    </radialGradient>
    <filter id="ID-suavizado" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5" /></filter>
    <filter id="ID-suavizado-fino" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.5" /></filter>
    <filter id="ID-sombra-suave" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="7" /></filter>
    <filter id="ID-halo" x="-20%" y="-20%" width="140%" height="140%">
      <feMorphology in="SourceAlpha" operator="dilate" radius="1.2" result="grueso" />
      <feFlood flood-color="#2A1830" flood-opacity="0.6" />
      <feComposite in2="grueso" operator="in" result="contorno" />
      <feMerge><feMergeNode in="contorno" /><feMergeNode in="SourceGraphic" /></feMerge>
    </filter>
    <clipPath id="ID-recorte-rostro"><path d="${ROSTRO}" /></clipPath>
    <clipPath id="ID-recorte-ojo-izq"><path d="${OJO_IZQ}" /></clipPath>
    <clipPath id="ID-recorte-ojo-der"><path d="${OJO_DER}" /></clipPath>
    <marker id="ID-punta" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4.5" markerHeight="4.5" orient="auto-start-reverse">
      <path d="M0 1 L9 5 L0 9 Z" fill="#fff" />
    </marker>
  </defs>

  <path class="cabello" fill="url(#ID-g-cabello)" d="M60 196 C40 92 108 30 164 30 C232 32 292 92 268 204 C262 262 270 304 286 352 L36 352 C54 304 62 258 60 196 Z" />
  <g class="mechones">
    <path d="M66 200 C60 250 62 300 50 344" /><path d="M80 214 C76 262 78 304 70 348" />
    <path d="M254 200 C260 250 258 300 270 344" /><path d="M240 214 C244 262 242 304 250 348" />
  </g>
  <path class="bata" d="M34 400 C46 336 104 316 160 316 C216 316 274 336 286 400 Z" />
  <path class="bata-cuello" d="M118 320 L160 370 L202 320" />
  <path class="cuello" fill="url(#ID-g-cuello)" d="M128 246 L128 316 C140 332 180 332 192 316 L192 246 Z" />
  <ellipse class="oreja" cx="70" cy="182" rx="14" ry="22" />
  <ellipse class="oreja" cx="250" cy="182" rx="14" ry="22" />
  <path class="oreja-detalle" d="M66 170 C59 181 61 194 70 199" />
  <path class="oreja-detalle" d="M254 170 C261 181 259 194 250 199" />

  <path class="rostro" fill="url(#ID-g-piel)" d="${ROSTRO}" />

  <g class="volumen" filter="url(#ID-sombra-suave)" clip-path="url(#ID-recorte-rostro)">
    <path d="M68 146 C64 202 92 254 134 278 C100 272 70 230 66 168 Z" />
    <path d="M252 146 C256 202 228 254 186 278 C220 272 250 230 254 168 Z" />
    <ellipse cx="121" cy="146" rx="24" ry="9" />
    <ellipse cx="199" cy="146" rx="24" ry="9" />
    <ellipse cx="150" cy="176" rx="4" ry="18" />
    <ellipse cx="170" cy="176" rx="4" ry="18" />
    <ellipse cx="160" cy="214" rx="11" ry="3" />
    <ellipse cx="160" cy="259" rx="15" ry="4" />
  </g>
  <g class="luces" clip-path="url(#ID-recorte-rostro)">
    <ellipse cx="160" cy="102" rx="34" ry="12" fill="url(#ID-g-luz)" />
    <ellipse cx="160" cy="199" rx="6" ry="4.5" fill="url(#ID-g-luz)" />
    <ellipse cx="160" cy="263" rx="9" ry="3.5" fill="url(#ID-g-luz)" />
  </g>

  <path class="capa-base" d="${ROSTRO}" />

  <g class="capa-brillo" clip-path="url(#ID-recorte-rostro)">
    <ellipse cx="160" cy="108" rx="34" ry="12" fill="url(#ID-g-luz)" />
    <ellipse cx="112" cy="186" rx="20" ry="9" fill="url(#ID-g-luz)" />
    <ellipse cx="208" cy="186" rx="20" ry="9" fill="url(#ID-g-luz)" />
    <ellipse cx="160" cy="182" rx="6" ry="16" fill="url(#ID-g-luz)" />
  </g>

  <g class="capa-bronceador" filter="url(#ID-suavizado)" clip-path="url(#ID-recorte-rostro)">
    <ellipse cx="96" cy="218" rx="20" ry="7" transform="rotate(-24 96 218)" />
    <ellipse cx="224" cy="218" rx="20" ry="7" transform="rotate(24 224 218)" />
    <ellipse cx="80" cy="128" rx="9" ry="22" />
    <ellipse cx="240" cy="128" rx="9" ry="22" />
    <ellipse cx="124" cy="262" rx="22" ry="6" transform="rotate(28 124 262)" />
    <ellipse cx="196" cy="262" rx="22" ry="6" transform="rotate(-28 196 262)" />
  </g>

  <g class="capa-rubor" filter="url(#ID-suavizado)" clip-path="url(#ID-recorte-rostro)">
    <ellipse cx="108" cy="204" rx="22" ry="13" />
    <ellipse cx="212" cy="204" rx="22" ry="13" />
  </g>

  <g class="capa-iluminador" filter="url(#ID-suavizado-fino)" clip-path="url(#ID-recorte-rostro)">
    <ellipse cx="116" cy="184" rx="15" ry="5" transform="rotate(-12 116 184)" />
    <ellipse cx="204" cy="184" rx="15" ry="5" transform="rotate(12 204 184)" />
    <ellipse cx="160" cy="176" rx="3" ry="13" />
    <ellipse cx="160" cy="222" rx="7" ry="2.5" />
    <ellipse cx="122" cy="140" rx="12" ry="3" />
    <ellipse cx="198" cy="140" rx="12" ry="3" />
  </g>

  <g class="capa-sombra" filter="url(#ID-suavizado-fino)">
    <path d="M98 157 C104 136 136 134 146 156 C134 146 110 146 98 157 Z" />
    <path d="M222 157 C216 136 184 134 174 156 C186 146 210 146 222 157 Z" />
  </g>

  <g class="cejas">
    <path d="M142 131 C132 121 112 119 97 130 C112 125 130 126 142 135 Z" />
    <path d="M178 131 C188 121 208 119 223 130 C208 125 190 126 178 135 Z" />
  </g>

  <g class="ojos-abiertos">
    ${ojoAbierto(121, 'recorte-ojo-izq')}
    ${ojoAbierto(199, 'recorte-ojo-der')}
    <path class="pliegue" d="M102 151 C112 142 132 142 141 150" />
    <path class="pliegue" d="M218 151 C208 142 188 142 179 150" />
    <path class="parpado" d="M98 158 C110 145.5 132 145.5 144 157" />
    <path class="parpado" d="M222 158 C210 145.5 188 145.5 176 157" />
    <path class="linea-inferior" d="M103 160.5 C112 166 130 166 139 160.5" />
    <path class="linea-inferior" d="M217 160.5 C208 166 190 166 181 160.5" />
    <path class="pestanas-naturales" d="M101 156 l-4 -3 M106 152 l-3 -5 M214 152 l3 -5 M219 156 l4 -3" />
  </g>
  <g class="ojos-cerrados">
    <path class="parpado" d="M100 160 C112 168 130 168 142 160" />
    <path class="parpado" d="M178 160 C190 168 208 168 220 160" />
    <path class="pestanas-naturales" d="M106 164 l-2 4 M113 166 l-1 5 M121 167 l0 5 M129 166 l1 5 M214 164 l2 4 M207 166 l1 5 M199 167 l0 5 M191 166 l-1 5" />
  </g>
  <g class="capa-pestanas">
    <path d="M99 156 l-8 -6 M103 152 l-6 -9 M109 149 l-4 -10 M116 147 l-2 -10 M221 156 l8 -6 M217 152 l6 -9 M211 149 l4 -10 M204 147 l2 -10" />
  </g>

  <g class="nariz">
    <path class="nariz-puente" d="M154 140 C152 160 150 180 150 196" />
    <path class="nariz-base" d="M147 203 C152 210 168 210 173 203" />
    <ellipse class="fosa" cx="152.5" cy="206" rx="4" ry="2.2" />
    <ellipse class="fosa" cx="167.5" cy="206" rx="4" ry="2.2" />
  </g>

  <g class="boca">
    <path class="labios" fill="url(#ID-g-labios)" d="M132 232 C141 223 152 222 160 228 C168 222 179 223 188 232 C176 235.5 144 235.5 132 232 Z" />
    <path class="labios labio-inferior" fill="url(#ID-g-labios)" d="M132 232 C144 236 176 236 188 232 C181 247 169 253 160 253 C151 253 139 247 132 232 Z" />
    <path class="comisura" d="M134 232 C150 235.5 170 235.5 186 232" />
    <ellipse class="reflejo-labio" cx="160" cy="243" rx="10" ry="3" filter="url(#ID-suavizado-fino)" />
  </g>

  <path class="cabello" fill="url(#ID-g-cabello)" d="M70 152 C64 90 112 50 168 52 C216 54 248 86 256 132 C228 106 192 88 150 94 C118 100 92 122 70 152 Z" />
  <g class="mechones">
    <path d="M96 120 C120 92 160 80 202 84" /><path d="M112 106 C142 88 182 82 224 98" /><path d="M150 60 C196 62 234 84 248 116" />
  </g>
  <path class="diadema" d="M72 132 C88 72 232 72 248 132 C234 102 194 84 160 84 C126 84 86 102 72 132 Z" />
  <ellipse class="diadema" cx="228" cy="94" rx="14" ry="10" />

  <g class="espuma">
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

  <g class="bruma">
    <circle class="gotita" cx="104" cy="120" r="3" />
    <circle class="gotita" cx="132" cy="96" r="2.5" />
    <circle class="gotita" cx="190" cy="98" r="3" />
    <circle class="gotita" cx="218" cy="124" r="2.5" />
    <circle class="gotita" cx="92" cy="176" r="2.5" />
    <circle class="gotita" cx="230" cy="172" r="3" />
    <circle class="gotita" cx="112" cy="236" r="3" />
    <circle class="gotita" cx="208" cy="238" r="2.5" />
    <circle class="gotita" cx="146" cy="150" r="2" />
    <circle class="gotita" cx="176" cy="200" r="2" />
    <circle class="gotita" cx="160" cy="250" r="2.5" />
    <circle class="gotita" cx="160" cy="130" r="2" />
  </g>

  <g class="destellos">
    <path class="destello" transform="translate(236 112)" d="M0 -12 L3 -3 L12 0 L3 3 L0 12 L-3 3 L-12 0 L-3 -3 Z" />
    <path class="destello" transform="translate(84 236)" d="M0 -9 L2 -2 L9 0 L2 2 L0 9 L-2 2 L-9 0 L-2 -2 Z" />
    <path class="destello" transform="translate(206 250)" d="M0 -7 L2 -2 L7 0 L2 2 L0 7 L-2 2 L-7 0 L-2 -2 Z" />
  </g>

  <g class="guias" filter="url(#ID-halo)">${SVG_GUIAS}</g>
</svg>`;

const esperar = (ms) => new Promise((resolver) => setTimeout(resolver, ms));
const menosMovimiento = () => globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

let avatares = 0;

export function crearAvatar(contenedor) {
  const idUnico = `avatar${++avatares}`;
  contenedor.innerHTML = SVG.replaceAll('ID-', `${idUnico}-`);
  const raiz = contenedor.querySelector('.avatar');

  const quitarClases = (prefijo) => {
    [...raiz.classList].filter((clase) => clase.startsWith(prefijo)).forEach((clase) => raiz.classList.remove(clase));
  };

  const api = {
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

    guia(nombre) {
      if (nombre && !GUIAS.includes(nombre)) throw new Error(`Guía desconocida: ${nombre}`);
      raiz.querySelectorAll('.guia').forEach((grupo) => grupo.classList.toggle('activa', grupo.dataset.guia === nombre));
    },

    hablar(activo) {
      raiz.classList.toggle('hablando', activo);
    },

    reiniciar() {
      quitarClases('efecto-');
      quitarClases('destello-');
      raiz.classList.remove('hablando');
      api.guia(null);
      CAPAS.forEach((nombre) => {
        ['color', 'opacidad', 'grosor'].forEach((prop) => raiz.style.removeProperty(`--capa-${nombre}-${prop}`));
      });
    }
  };
  return api;
}
