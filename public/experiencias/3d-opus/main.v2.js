// Nocturne · Lámina I — Fase 1: el mundo y sus tres gravedades.
// Idea clave: un cubo isométrico tiene simetría de 120°. Cada cara se dibuja
// como si fuera la cara superior y se rota ±120°. Al rotar el mundo, cada cara
// se convierte en "suelo" con sus figuras de pie: gravedad relativa (Escher).

const S = 230,
  C = S * 0.866,
  H = S / 2
const iso = (u, v) => [(u - v) * C, -S + (u + v) * H] // punto sobre la cara superior
const pts = (a) => a.map((p) => p.map((n) => n.toFixed(1)).join(',')).join(' ')
const COL = {
  blue: 'var(--blue)',
  gold: 'var(--gold)',
  green: 'var(--green)',
  purple: 'var(--purple)',
  slate: 'var(--ink2)',
}

// ── Sistema de piezas (Fase 2) ─────────────────────────────────
// Cada credencial tiene un perfil único: [arriba, derecha, abajo, izquierda]
// 1 = pestaña hacia fuera · -1 = hueco · 0 = plano. Solo encaja donde su forma existe.
const CREDS = {
  code: {
    name: 'Authorization code',
    color: COL.blue,
    edges: [1, 0, 0, 0],
    fits: ['Lambda Auth'],
    note: 'De un solo uso. Chrome lo recibe y lo entrega; no abre nada más.',
  },
  access: {
    name: 'Access token Google',
    color: COL.blue,
    edges: [1, 1, 0, 0],
    fits: ['YouTube API'],
    note: 'Temporal. Es la única pieza que abre YouTube.',
  },
  refresh: {
    name: 'Refresh token Google',
    color: COL.blue,
    edges: [1, 1, 1, 0],
    fits: ['Google token endpoint', 'KMS (cifrar)'],
    note: 'Larga duración. Fabrica nuevos access tokens sin el usuario.',
  },
  sealed: {
    name: 'Refresh token cifrado',
    color: COL.green,
    edges: [-1, -1, -1, 0],
    lock: true,
    fits: ['DynamoDB PROFILE', 'KMS (descifrar)'],
    note: 'El refresh tras pasar por KMS. Es su negativo: solo KMS lo encaja para revelarlo.',
  },
  jwt: {
    name: 'JWT Nocturne',
    color: COL.gold,
    edges: [0, -1, 1, -1],
    fits: ['storage.local', 'API Gateway · Upload/Status'],
    note: 'Abre la API propia. No encaja en YouTube.',
  },
  secret: {
    name: 'Secreto JWT (SSM)',
    color: COL.slate,
    edges: [1, -1, 0, 1],
    fits: ['Lambda Auth (firmar)'],
    note: 'Vive en SSM y nunca sale de Nocturne. Con él Lambda firma el JWT.',
  },
  msg: {
    name: 'Mensaje SQS',
    color: COL.purple,
    edges: [0, 1, -1, 0],
    tag: 'job+user',
    legend: false,
    fits: ['Worker'],
    note: 'jobId + userId. Sin JWT ni navegador.',
  },
}

function shapePath([t, r, b, l], k = 11, n = 4.5) {
  const arc = (dir, x, y) =>
    dir ? `A${n},${n} 0 1 ${dir > 0 ? 1 : 0} ${x},${y}` : `L${x},${y}`
  return (
    `M${-k},${-k} H${-n + 0.5} ${arc(t, n - 0.5, -k)} H${k}` +
    ` V${-n + 0.5} ${arc(r, k, n - 0.5)} V${k}` +
    ` H${n - 0.5} ${arc(b, -n + 0.5, k)} H${-k}` +
    ` V${n - 0.5} ${arc(l, -k, -n + 0.5)} Z`
  )
}

const padlock = `<g transform="translate(0,1)"><path d="M-3.5,-1 V-4 A3.5,3.5 0 0 1 3.5,-4 V-1" fill="none" stroke="#2a2118" stroke-width="1.4"/><rect x="-5" y="-1" width="10" height="7" fill="#2a2118"/></g>`

// Bloque isométrico apoyado en la cara (u,v,du,dv) con altura h
function box(u, v, du, dv, h, tag = '', above = false) {
  const a = iso(u, v),
    b = iso(u + du, v),
    c = iso(u + du, v + dv),
    d = iso(u, v + dv)
  const up = (p) => [p[0], p[1] - h]
  const [tx, ty] = iso(u + du / 2, v + dv / 2)
  const tagY = above ? ty - h - (H * (du + dv)) / 2 - 5 : ty - h - 8
  return `<g>
    <polygon class="solid box-r" fill="#e9dcbd" points="${pts([b, c, up(c), up(b)])}"/>
    <polygon class="solid" fill="url(#hatch-dense)" points="${pts([b, c, up(c), up(b)])}"/>
    <polygon class="solid box-l" fill="#e2d2ae" points="${pts([d, c, up(c), up(d)])}"/>
    <polygon class="solid" fill="url(#hatch-mid)" points="${pts([d, c, up(c), up(d)])}"/>
    <polygon class="solid box-top" fill="#f3e9d2" points="${pts([up(a), up(b), up(c), up(d)])}"/>
    ${tag ? `<text class="tag" text-anchor="middle" x="${tx}" y="${tagY}">${tag}</text>` : ''}
  </g>`
}

// Escalera de n peldaños a lo largo de u
const stairs = (u, v, n, w = 0.06, dv = 0.14, step = 7) =>
  Array.from({ length: n }, (_, i) =>
    box(u + i * w, v, w, dv, step * (i + 1)),
  ).join('')

// Figura humana estilizada (de pie sobre el punto)
function fig(u, v, tint) {
  const [x, y] = iso(u, v)
  return `<g class="fig" transform="translate(${x},${y})">
    <ellipse rx="7" ry="2.6" fill="#2a2118" opacity=".22"/>
    <path d="M-4.5,0 L-2.5,-14 L-6,-25 Q0,-29 6,-25 L2.5,-14 L4.5,0 Z" ${tint ? `style="fill:${tint}"` : ''}/>
    <circle cy="-32" r="4.6"/>
  </g>`
}

// Portal / arco de frontera
function portal(u, v, color) {
  const [x, y] = iso(u, v)
  return `<g transform="translate(${x},${y})">
    <path d="M-16,0 V-44 Q0,-64 16,-44 V0" fill="none" stroke="#2a2118" stroke-width="7" stroke-linecap="square"/>
    <path d="M-16,0 V-44 Q0,-64 16,-44 V0" fill="none" stroke="${color}" stroke-width="3"/>
    <path d="M-10,0 V-42 Q0,-55 10,-42 V0 Z" fill="url(#hatch-dense)" opacity=".7"/>
  </g>`
}

// Credencial = pieza de puzzle con forma propia
function piece(u, v, key, lift = 62, id = '') {
  const [x, y] = iso(u, v),
    c = CREDS[key]
  return `<g ${id ? `id="${id}"` : ''} transform="translate(${x},${y - lift})"><g class="piece" data-key="${key}">
    <circle class="aura" r="22" style="fill:${c.color}" opacity=".45" filter="url(#glow)"/>
    <circle class="drag-ring" r="21" style="stroke:${c.color}"/>
    <path d="${shapePath(c.edges)}" style="fill:${c.color}" stroke="#2a2118" stroke-width="1.4"/>
    ${c.lock ? padlock : ''}
    <text class="tag" text-anchor="middle" y="${c.edges[2] > 0 ? 32 : 26}">${key === 'sealed' ? 'refresh ⊘' : c.tag || key}</text>
  </g></g>`
}

// Cerradura = placa con el hueco exacto de una credencial
function lock(u, v, key, label, lift = 40, id = '', also = '', tagY = -25) {
  const [x, y] = iso(u, v),
    c = CREDS[key]
  return `<g ${id ? `id="${id}"` : ''} transform="translate(${x},${y - lift})"><g class="lock" data-key="${key}" data-also="${also}">
    <line y1="0" y2="${lift}" stroke="#2a2118" stroke-width="1.2" stroke-dasharray="2 2"/>
    <rect class="plate-r" x="-19" y="-19" width="38" height="38" fill="#f3e9d2" stroke="#2a2118" stroke-width="1.6"/>
    <path class="slot" d="${shapePath(c.edges)}" fill="url(#hatch-dense)" stroke="#2a2118" stroke-width="1.2" stroke-dasharray="3 2"/>
    <text class="tag" text-anchor="middle" y="${tagY}">${label}</text>
  </g></g>`
}

// Etiqueta impresa plana sobre la cara
function faceLabel(title, sub) {
  const [x, y] = iso(0.06, 0.86)
  return `<g transform="matrix(.866,.5,-.866,.5,${x},${y})">
    <text class="lbl" x="0" y="0">${title}</text>
    <text class="lbl-sub" x="0" y="17">${sub}</text>
  </g>`
}

function face(id, rot, fill, title, sub, content) {
  const grid = [1, 2, 3, 4, 5]
    .map((i) => {
      const t = i / 6,
        a = iso(t, 0),
        b = iso(t, 1),
        c = iso(0, t),
        d = iso(1, t)
      return `<line class="grid" x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"/>
            <line class="grid" x1="${c[0]}" y1="${c[1]}" x2="${d[0]}" y2="${d[1]}"/>`
    })
    .join('')
  const top = pts([iso(0, 0), iso(1, 0), iso(1, 1), iso(0, 1)])
  return `<g id="${id}" class="face" transform="rotate(${rot})">
    <polygon class="face-bg" points="${top}" fill="#f1e6cd"/>
    <polygon points="${top}" fill="${fill}"/>
    ${grid}
    ${faceLabel(title, sub)}
    ${content}
    <polygon class="edge" points="${top}"/>
  </g>`
}

// ── Las tres caras ─────────────────────────────────────────────
const userFace = face(
  'f-user',
  0,
  'url(#hatch-light)',
  'USUARIO · CHROME',
  'aquí la gravedad es tuya',
  box(0.18, 0.2, 0.3, 0.22, 22, 'chrome.identity') +
    box(0.55, 0.18, 0.2, 0.2, 14) +
    lock(0.65, 0.28, 'jwt', 'storage.local', 56, 'lk-storage') +
    portal(0.92, 0.45, COL.blue) +
    portal(0.82, 0.78, COL.gold) +
    fig(0.55, 0.62) +
    piece(0.82, 0.78, 'jwt', 40, 'm-jwt-u') +
    piece(0.92, 0.45, 'code', 40, 'm-code-u'),
)

const G_JWT = [0.6, 0.79, 26],
  G_ACC = [0.83, 0.9, 22],
  G_YT = [0.82, 0.61, 62]
const googleFace = face(
  'f-google',
  -120,
  'url(#hatch-mid)',
  'GOOGLE · OAUTH',
  'identidad y permisos YouTube',
  box(0.15, 0.15, 0.25, 0.25, 48, 'authorize') +
    box(0.5, 0.14, 0.22, 0.22, 30) +
    lock(0.61, 0.25, 'refresh', 'token endpoint', 72, 'lk-tok') +
    box(0.74, 0.52, 0.16, 0.18, 20) +
    lock(G_YT[0], G_YT[1], 'access', 'YouTube API', G_YT[2], 'lk-yt') +
    portal(0.3, 0.92, COL.blue) +
    fig(0.27, 0.52, '#c9d6e3') +
    fig(0.36, 0.54, '#c9d6e3') +
    `<g id="puzzle-guides">
    <path class="p-guide" style="stroke:${COL.gold}" d="M-15,-98 Q5,-103 18,-120"/>
    <path class="p-head"  style="stroke:${COL.gold}" d="M10,-118 L19,-120 L17,-111"/>
    <path class="p-guide" style="stroke:${COL.blue}" d="M3,-68 Q22,-84 32,-103"/>
    <path class="p-head"  style="stroke:${COL.blue}" d="M24,-100 L33,-104 L32,-95"/>
  </g>` +
    piece(G_ACC[0], G_ACC[1], 'access', G_ACC[2], 'd-access') +
    piece(G_JWT[0], G_JWT[1], 'jwt', G_JWT[2], 'd-jwt') +
    piece(0.3, 0.92, 'refresh', 40, 'm-refresh-g') +
    piece(0.61, 0.25, 'access', 72, 'm-access-g') +
    piece(0.275, 0.275, 'code', 82, 'm-code-g'),
)

// Anclas compartidas de Nocturne (geometría y beats usan el mismo punto)
const N = {
  por: { u: 0.08, v: 0.28 },
  lam: { u: 0.28, v: 0.21, lift: 102 },
  kms: { u: 0.64, v: 0.16, lift: 64 },
  ssm: { u: 0.88, v: 0.14, lift: 46 },
  dyn: { u: 0.78, v: 0.56, lift: 30 },
  api: { u: 0.69, v: 0.83, lift: 36 },
  sqs: { u: 0.91, v: 0.37, lift: 44 },
  ws: { u: 0.96, v: 0.66 },
  we: { u: 0.92, v: 0.49 },
}
const [ujX, ujY] = [28, -48]

const nocturneFace = face(
  'f-noct',
  120,
  'url(#hatch-dense)',
  'NOCTURNE · AWS',
  'otra gravedad, otra verdad',
  stairs(0.1, 0.6, 4, 0.042, 0.1, 4.5) +
    box(0.17, 0.11, 0.22, 0.2, 58) +
    lock(
      N.lam.u,
      N.lam.v,
      'code',
      'Lambda Auth',
      N.lam.lift,
      'lk-lambda',
      'secret',
    ) +
    box(0.57, 0.09, 0.14, 0.14, 18) +
    lock(N.kms.u, N.kms.v, 'refresh', 'KMS', N.kms.lift, 'lk-kms', 'sealed') +
    box(0.83, 0.09, 0.1, 0.1, 14, 'SSM', true) +
    box(0.695, 0.49, 0.17, 0.14, 12) +
    lock(
      N.dyn.u,
      N.dyn.v,
      'sealed',
      'DynamoDB',
      N.dyn.lift,
      'lk-dynamo',
      '',
      -29,
    ) +
    box(0.605, 0.76, 0.17, 0.14, 14) +
    lock(
      N.api.u,
      N.api.v,
      'jwt',
      'API Gateway',
      N.api.lift,
      'lk-api',
      '',
      -29,
    ) +
    box(0.865, 0.32, 0.09, 0.1, 10, 'SQS', true) +
    `<g id="w-fig">${fig(N.ws.u, N.ws.v, '#cdbfe0')}</g>` +
    piece(N.dyn.u, N.dyn.v, 'sealed', N.dyn.lift, 'm-sealed2') +
    piece(N.kms.u, N.kms.v, 'refresh', N.kms.lift, 'm-refresh2') +
    portal(N.por.u, N.por.v, COL.gold) +
    fig(0.59, 0.94, '#ecd9a8') +
    `<text id="m-userjob" class="tag" text-anchor="middle" x="${ujX}" y="${ujY}">USER#sub<tspan x="${ujX}" dy="10">JOB#id</tspan></text>` +
    `<g id="crack-dynamo" transform="translate(${iso(N.dyn.u, N.dyn.v)[0]},${iso(N.dyn.u, N.dyn.v)[1] - N.dyn.lift})"><circle class="crack-ring" r="25"/><text class="crack-lbl" text-anchor="middle" y="-43">∅ sin refresh</text></g>` +
    `<g id="crack-api" transform="translate(${iso(N.api.u, N.api.v)[0]},${iso(N.api.u, N.api.v)[1] - N.api.lift})"><circle class="crack-ring" r="25"/><text class="crack-lbl" text-anchor="middle" y="-43">sin authorizer</text></g>` +
    `<g id="crack-oauth" transform="translate(${iso(N.por.u, N.por.v)[0]},${iso(N.por.u, N.por.v)[1]})"><circle class="crack-ring" r="29"/><text class="crack-lbl crack-lbl-focus" text-anchor="middle" y="-43">sin PKCE / state</text></g>` +
    `<g id="crack-session" transform="translate(${iso(N.por.u, N.por.v)[0] + 27},${iso(N.por.u, N.por.v)[1] + 43})"><path class="crack-leader" d="M-27,-43 L-5,-17"/><rect class="crack-badge" x="0" y="-19" width="145" height="30" rx="3"/><text class="crack-badge-label" x="7" y="1">JWT → cliente</text></g>` +
    piece(N.por.u, N.por.v, 'code', 40, 'm-code-n') +
    `<text id="m-exch" class="tag" text-anchor="middle" x="${iso(N.por.u, N.por.v)[0] + 6}" y="${iso(N.por.u, N.por.v)[1] + 16}">canje ⇄ Google</text>` +
    `<text id="t-kms-enc" class="tag" x="${iso(N.kms.u, N.kms.v)[0] + 28}" y="${iso(N.kms.u, N.kms.v)[1] - (N.kms.lift - 3)}">← cifra</text>` +
    `<text id="t-kms-dec" class="tag" x="${iso(N.kms.u, N.kms.v)[0] + 28}" y="${iso(N.kms.u, N.kms.v)[1] - (N.kms.lift - 3)}">← descifra</text>` +
    piece(N.por.u, N.por.v, 'refresh', 40, 'm-refresh') +
    piece(N.kms.u, N.kms.v, 'sealed', N.kms.lift, 'm-sealed') +
    piece(N.ssm.u, N.ssm.v, 'secret', N.ssm.lift, 'm-secret') +
    piece(N.sqs.u, N.sqs.v, 'msg', N.sqs.lift, 'm-msg') +
    piece(N.por.u, N.por.v, 'jwt', 40, 'm-jwt-n2') +
    piece(N.lam.u, N.lam.v, 'jwt', N.lam.lift, 'm-jwt-n'),
)

document.getElementById('world').innerHTML =
  `<g id="epi-rot">${userFace + googleFace + nocturneFace}</g>`

// ── Leyenda de credenciales + foco "¿dónde encaja?" ─────────────
const legend = document.getElementById('legend')
legend.innerHTML =
  '<svg class="legend-frame" aria-hidden="true"><rect x=".5" y=".5" width="99.5%" height="99.5%"/></svg>' +
  '<p class="kicker">Credenciales · toca una</p>' +
  Object.entries(CREDS)
    .filter(([, c]) => c.legend !== false)
    .map(
      ([k, c]) =>
        `<button type="button" data-key="${k}">
     <svg class="dash-line" viewBox="0 0 180 4" preserveAspectRatio="none" aria-hidden="true"><line x1="0" y1="2" x2="180" y2="2"/></svg>
     <svg class="ico" viewBox="-20 -20 40 40" aria-hidden="true"><path d="${shapePath(c.edges)}" style="fill:${c.color}" stroke="#2a2118" stroke-width="1.4"/>${c.lock ? padlock : ''}</svg>
     <span><strong>${c.name}</strong><small>encaja en: ${c.fits.join(' · ')}</small></span>
   </button>`,
    )
    .join('') +
  '<p class="legend-note" id="legend-note">Cada forma solo entra en su cerradura.</p>'

let active = null
legend.addEventListener('click', (e) => {
  const b = e.target.closest('button')
  if (!b) return
  const k = active === b.dataset.key ? null : b.dataset.key
  active = k
  legend
    .querySelectorAll('button')
    .forEach((x) => x.classList.toggle('on', x.dataset.key === k))
  document.getElementById('legend-note').textContent = k
    ? CREDS[k].note
    : 'Cada forma solo entra en su cerradura.'
  document.querySelectorAll('.piece,.lock').forEach((el) => {
    const match =
      el.dataset.key === k || (el.dataset.also || '').split(' ').includes(k)
    el.classList.toggle('match', !!k && match)
    el.classList.toggle('mute', !!k && !match)
  })
})

// ── Animación con scroll ──────────────────────────────────────
gsap.registerPlugin(ScrollTrigger)
const caps = gsap.utils.toArray('.cap')
const chips = [...document.querySelectorAll('.chips span')]
// ── Marcos SVG dibujados a mano para chips y botones ────────────
const INK_FRAME =
  '<svg class="ink-frame" aria-hidden="true"><rect class="ink-sh" x="3" y="3" width="100%" height="100%" fill="url(#hatch-dense)"/><rect class="ink-bg" x="0" y="0" width="100%" height="100%"/></svg>'
document
  .querySelectorAll('.chips span, .zoom, .epilogue-nav button')
  .forEach((el) => el.insertAdjacentHTML('beforeend', INK_FRAME))

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches

// ── Cámara: "alejarse para girar, acercarse para leer" ──────────
// cam.v = del scroll · cam.o = manual (0 cerca, 1 lejos) · cam.w = peso manual (0 auto, 1 fijo)
const FAR = [-420, -400, 840, 800],
  NEAR = [-235, -345, 470, 380]
const cam = { v: 0, o: 0, w: 0 }
let camMode = 'auto',
  nearScene = -1,
  curScene = 0,
  epiChip = 0
const sceneEl = document.getElementById('scene')
const zoomBtn = document.getElementById('zoom')
const camT = () => cam.v * (1 - cam.w) + cam.o * cam.w
function syncZoomBtn(t) {
  const isFar = camMode === 'far' || (camMode === 'auto' && t >= 0.5)
  zoomBtn.setAttribute('aria-pressed', isFar)
  zoomBtn.childNodes[0].nodeValue = isFar
    ? '⊕ Acercar plano '
    : '⊖ Ver el mundo '
}
function applyCam() {
  const t = camT()
  sceneEl.setAttribute(
    'viewBox',
    NEAR.map((n, i) => (n + (FAR[i] - n) * t).toFixed(2)).join(' '),
  )
  document.body.classList.toggle('is-zoomed', t < 0.5)
  syncZoomBtn(t)
}
applyCam()

gsap.set(caps.slice(1), { autoAlpha: 0, y: 24 })
gsap.set('.face', { opacity: 0.3 })
gsap.set('#f-user', { opacity: 1 })
gsap.to('.piece', {
  y: -6,
  duration: 1.8,
  ease: 'sine.inOut',
  yoyo: true,
  repeat: -1,
  stagger: 0.4,
})

// ── Fase 3 · el viaje de las piezas ─────────────────────────────
const P = (u, v, l) => {
  const [x, y] = iso(u, v)
  return { x, y: y - l }
}
const movers =
  '#m-code-g,#m-code-n,#m-refresh,#m-sealed,#m-jwt-n,#m-jwt-u,#m-userjob,#d-jwt,#d-access,#w-fig,#m-sealed2,#m-refresh2,#m-refresh-g,#m-access-g,#crack-dynamo,#crack-api,#crack-oauth,#crack-session,#m-code-u,#m-secret,#m-msg,#m-jwt-n2,#m-exch,#t-kms-enc,#t-kms-dec'
gsap.set(movers, { autoAlpha: 0, transformOrigin: '50% 50%' })
const fillSlot = (tl, id, key, t) =>
  tl.set(
    `#${id} .slot`,
    { attr: { fill: CREDS[key].color }, strokeDasharray: 'none' },
    t,
  )
const appear = (tl, id, t) =>
  tl.fromTo(
    id,
    { autoAlpha: 0, scale: 0.2 },
    { autoAlpha: 1, scale: 1, duration: 0.25, ease: 'back.out(2)' },
    t,
  )
const consume = (tl, id, t) =>
  tl.to(id, { scale: 0.5, autoAlpha: 0, duration: 0.2 }, t)

// Escenas: rotación del mundo, cara activa, chip y "beats" dentro de la escena
const EASE = 'power1.inOut'
// Rotaciones absolutas: usuario 0 · Google ±120 (=-240) · Nocturne -120 (=240). Cada salto es de 120°.
const SCENES = [
  { rot: 0, face: '#f-user', chip: 0 },
  {
    rot: 120,
    face: '#f-google',
    chip: 1,
    beats: (tl, t) => {
      // Google entrega el code y lo devuelve (redirect)
      appear(tl, '#m-code-g', t)
      tl.to(
        '#m-code-g',
        { ...P(0.3, 0.92, 40), duration: 0.7, ease: EASE },
        t + 0.35,
      )
      consume(tl, '#m-code-g', t + 1.05)
    },
  },
  {
    rot: 0,
    face: '#f-user',
    chip: 0,
    beats: (tl, t) => {
      // Chrome recibe el redirect y entrega el code a Nocturne
      appear(tl, '#m-code-u', t)
      tl.to(
        '#m-code-u',
        { ...P(0.33, 0.31, 94), duration: 0.7, ease: EASE },
        t + 0.3,
      )
      tl.to(
        '#m-code-u',
        { ...P(0.82, 0.78, 40), duration: 0.8, ease: EASE },
        t + 1.3,
      )
      consume(tl, '#m-code-u', t + 2.1)
    },
  },
  {
    rot: -120,
    face: '#f-noct',
    chip: 2,
    beats: (tl, t) => {
      // Lambda Auth: canje con Google, KMS, DynamoDB, SSM → JWT
      appear(tl, '#m-code-n', t) // llega por el portal dorado
      tl.to(
        '#m-code-n',
        { ...P(N.lam.u, N.lam.v, N.lam.lift), duration: 0.6, ease: EASE },
        t + 0.3,
      )
      consume(tl, '#m-code-n', t + 0.9)
      fillSlot(tl, 'lk-lambda', 'code', t + 0.9)
      tl.to('#m-exch', { autoAlpha: 1, duration: 0.25 }, t + 1.0) // canje code ⇄ Google
      appear(tl, '#m-refresh', t + 1.25) // el refresh vuelve de Google por el portal
      tl.to(
        '#m-refresh',
        { ...P(N.lam.u, N.lam.v, N.lam.lift), duration: 0.5, ease: EASE },
        t + 1.55,
      )
      tl.to('#m-exch', { autoAlpha: 0, duration: 0.2 }, t + 1.9)
      tl.to(
        '#m-refresh',
        { ...P(N.kms.u, N.kms.v, N.kms.lift), duration: 0.55, ease: EASE },
        t + 2.05,
      )
      consume(tl, '#m-refresh', t + 2.6)
      fillSlot(tl, 'lk-kms', 'refresh', t + 2.6)
      tl.to('#t-kms-enc', { autoAlpha: 1, duration: 0.25 }, t + 2.6)
      appear(tl, '#m-sealed', t + 2.7)
      tl.to(
        '#m-sealed',
        { ...P(N.dyn.u, N.dyn.v, N.dyn.lift), duration: 0.55, ease: EASE },
        t + 2.95,
      )
      consume(tl, '#m-sealed', t + 3.5)
      fillSlot(tl, 'lk-dynamo', 'sealed', t + 3.5)
      appear(tl, '#m-secret', t + 3.7) // SSM entrega el secreto
      tl.to(
        '#m-secret',
        { ...P(N.lam.u, N.lam.v, N.lam.lift), duration: 0.6, ease: EASE },
        t + 3.95,
      )
      consume(tl, '#m-secret', t + 4.55)
      appear(tl, '#m-jwt-n', t + 4.55) // …y Lambda forja el JWT
      tl.to(
        '#m-jwt-n',
        { ...P(N.por.u, N.por.v, 40), duration: 0.7, ease: EASE },
        t + 5.0,
      )
      consume(tl, '#m-jwt-n', t + 5.7)
    },
  }, // el JWT sale por el portal dorado
  {
    rot: 0,
    face: '#f-user',
    chip: 0,
    beats: (tl, t) => {
      // el JWT llega a Chrome por el portal dorado
      appear(tl, '#m-jwt-u', t)
      tl.to(
        '#m-jwt-u',
        { ...P(0.65, 0.28, 56), duration: 0.7, ease: EASE },
        t + 0.3,
      )
      consume(tl, '#m-jwt-u', t + 1.0)
      fillSlot(tl, 'lk-storage', 'jwt', t + 1.0)
    },
  },
  {
    rot: -120,
    face: '#f-noct',
    chip: 2,
    beats: (tl, t) => {
      // Bearer JWT (viene de Chrome) → API Gateway → USER#sub/JOB#id
      appear(tl, '#m-jwt-n2', t)
      tl.to(
        '#m-jwt-n2',
        { ...P(N.api.u, N.api.v, N.api.lift), duration: 0.8, ease: EASE },
        t + 0.3,
      )
      consume(tl, '#m-jwt-n2', t + 1.1)
      fillSlot(tl, 'lk-api', 'jwt', t + 1.1)
      tl.to('#m-userjob', { autoAlpha: 1, duration: 0.3 }, t + 1.3)
    },
  },
  {
    rot: -240,
    face: '#f-google',
    chip: 1,
    puzzle: true,
    beats: (tl, t) => {
      // Fase 4 · el momento puzzle (interactivo)
      appear(tl, '#d-jwt', t)
      appear(tl, '#d-access', t + 0.15)
    },
  },
  {
    rot: -120,
    face: '#f-noct',
    chip: 2,
    night: true,
    beats: (tl, t) => {
      // noche: SQS despierta al Worker, KMS descifra
      appear(tl, '#m-msg', t) // el mensaje SQS (jobId + userId)
      tl.to(
        '#m-msg',
        { ...P(N.ws.u, N.ws.v, 45), duration: 0.5, ease: EASE },
        t + 0.3,
      )
      consume(tl, '#m-msg', t + 0.8)
      appear(tl, '#w-fig', t + 0.85) // el Worker despierta
      const [ax, ay] = iso(N.ws.u, N.ws.v),
        [bx, by] = iso(N.we.u, N.we.v)
      tl.to(
        '#w-fig',
        { x: bx - ax, y: by - ay, duration: 0.8, ease: 'none' },
        t + 1.15,
      )
      appear(tl, '#m-sealed2', t + 2.0) // lee PROFILE
      tl.to(
        '#m-sealed2',
        { ...P(N.kms.u, N.kms.v, N.kms.lift), duration: 0.6, ease: EASE },
        t + 2.25,
      )
      consume(tl, '#m-sealed2', t + 2.85)
      tl.to(
        '#lk-kms .plate-r',
        { fill: '#e7dcf3', duration: 0.2, yoyo: true, repeat: 1 },
        t + 2.85,
      )
      tl.to('#t-kms-enc', { autoAlpha: 0, duration: 0.2 }, t + 2.85)
      tl.to('#t-kms-dec', { autoAlpha: 1, duration: 0.25 }, t + 2.85)
      appear(tl, '#m-refresh2', t + 2.95)
      tl.to(
        '#m-refresh2',
        { ...P(N.por.u, N.por.v, 40), duration: 0.7, ease: EASE },
        t + 3.2,
      )
      consume(tl, '#m-refresh2', t + 3.9)
    },
  },
  {
    rot: -240,
    face: '#f-google',
    chip: 1,
    night: true,
    beats: (tl, t) => {
      // noche: el access token abre YouTube
      appear(tl, '#m-refresh-g', t)
      tl.to(
        '#m-refresh-g',
        { ...P(0.61, 0.25, 72), duration: 0.6, ease: EASE },
        t + 0.3,
      )
      consume(tl, '#m-refresh-g', t + 0.9)
      fillSlot(tl, 'lk-tok', 'refresh', t + 0.9)
      appear(tl, '#m-access-g', t + 1.05)
      tl.to(
        '#m-access-g',
        { ...P(0.82, 0.61, 62), duration: 0.7, ease: EASE },
        t + 1.3,
      )
      consume(tl, '#m-access-g', t + 2.0)
      fillSlot(tl, 'lk-yt', 'access', t + 2.0)
    },
  },
  {
    rot: -120,
    face: '#f-noct',
    chip: 2,
    beats: (tl, t) => {
      // Fase 5 · grietas en main
      tl.to(
        ['#crack-dynamo', '#crack-api', '#crack-oauth', '#crack-session'],
        { autoAlpha: 1, duration: 0.4, stagger: 0.2 },
        t,
      )
    },
  },
  { rot: 0, face: '#f-user', chip: 0, epilogue: true }, // Fase 5 · epílogo: ver las 3 caras
]

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: '#journey',
    start: 'top top',
    end: '+=1850%',
    pin: '.stage',
    scrub: reduce ? true : 0.55,
  },
})
const sceneAt = [0]
tl.addLabel('s0')
for (let i = 1; i < SCENES.length; i++) {
  const s = SCENES[i],
    prev = SCENES[i - 1],
    t0 = tl.duration()
  tl.to(
    cam,
    { v: 1, duration: 0.45, ease: 'power2.out', onUpdate: applyCam },
    t0,
  ) // alejar
    .to(
      '#world',
      { rotation: s.rot, svgOrigin: '0 0', duration: 1, ease: 'power3.inOut' },
      t0 + 0.3,
    ) // girar
    .to(prev.face, { opacity: s.epilogue ? 1 : 0.3, duration: 0.5 }, t0 + 0.3)
    .to(s.epilogue ? '.face' : s.face, { opacity: 1, duration: 0.5 }, t0 + 0.8)
    .to(caps[i - 1], { autoAlpha: 0, y: -24, duration: 0.3 }, t0 + 0.2)
    .to(caps[i], { autoAlpha: 1, y: 0, duration: 0.35 }, t0 + 1.2)
  if (!s.epilogue)
    tl.to(
      cam,
      { v: 0, duration: 0.5, ease: 'power2.inOut', onUpdate: applyCam },
      t0 + 1.15,
    ) // acercar
  sceneAt.push(t0 + 1.2)
  if (s.beats) s.beats(tl, t0 + 1.8)
  tl.addLabel('s' + i, tl.duration()) // reposo = escena ya asentada y con sus beats completos
}
const stepIdx = document.getElementById('step-idx')
const folioFill = document.getElementById('folio-fill')
const folioNav = document.getElementById('folio-acts')
const folioActs = folioNav ? [...folioNav.querySelectorAll('button')] : []
const ACT_OF = [0, 0, 0, 0, 0, 1, 1, 2, 2, 3, 3]
const ACT_SCENE = [0, 5, 7, 9]
tl.eventCallback('onUpdate', () => {
  const t = tl.time()
  let i = 0
  sceneAt.forEach((at, k) => {
    if (t >= at) i = k
  })
  curScene = i
  if (camMode === 'near' && i !== nearScene) {
    camMode = 'auto'
    gsap.to(cam, {
      w: 0,
      duration: reduce ? 0 : 0.45,
      ease: 'power2.out',
      overwrite: 'auto',
      onUpdate: applyCam,
    })
  }
  const isEpi = !!SCENES[i].epilogue
  const activeChip =
    isEpi && typeof epiChip === 'number' ? epiChip : SCENES[i].chip
  chips.forEach((c, k) => c.classList.toggle('on', k === activeChip))
  const activeAct = ACT_OF[i] ?? 0
  folioActs.forEach((b, k) => b.classList.toggle('on', k === activeAct))
  if (folioFill)
    folioFill.style.transform = `scaleX(${tl.progress().toFixed(4)})`
  stepIdx.textContent = `${i + 1} / ${SCENES.length}`
  const wasPuzzle = document.body.classList.contains('is-puzzle')
  const isPuzzle = !!SCENES[i].puzzle
  document.body.classList.toggle('is-night', !!SCENES[i].night)
  document.body.classList.toggle('is-puzzle', isPuzzle)
  if (wasPuzzle && !isPuzzle && typeof resetPuzzle === 'function')
    resetPuzzle(i)
  if (!isEpi && typeof epiChip === 'number' && epiChip !== 0) resetEpilogue()
})
chips[0].classList.add('on')
if (folioNav) {
  folioNav.addEventListener('click', (e) => {
    const b = e.target.closest('button')
    if (!b) return
    const st = ScrollTrigger.getAll()[0]
    if (!st) return
    const targetScene = ACT_SCENE[+b.dataset.act] ?? 0
    const targetTime =
      targetScene === 0 ? 0 : (tl.labels['s' + targetScene] ?? 0)
    const y = st.start + (st.end - st.start) * (targetTime / tl.duration())
    window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' })
  })
}
gsap.to('.hint', {
  autoAlpha: 0,
  scrollTrigger: {
    trigger: '#journey',
    start: 'top top',
    end: '+=80',
    scrub: true,
  },
})

// ── Botón: ver el mundo completo o acercar plano (prevalece sobre scroll) ──
function toggleZoom() {
  const cur = camT()
  const wantClose = camMode === 'far' || (camMode === 'auto' && cur >= 0.5)
  const dur = reduce ? 0 : 0.85
  if (cam.w < 0.01) cam.o = cam.v
  if (!wantClose) {
    camMode = 'far'
    gsap.to(cam, {
      o: 1,
      w: 1,
      duration: dur,
      ease: 'power3.inOut',
      overwrite: 'auto',
      onUpdate: applyCam,
    })
  } else if (cam.v < 0.5) {
    camMode = 'auto'
    gsap.to(cam, {
      w: 0,
      duration: dur,
      ease: 'power3.inOut',
      overwrite: 'auto',
      onUpdate: applyCam,
    })
  } else {
    camMode = 'near'
    nearScene = curScene
    gsap.to(cam, {
      o: 0,
      w: 1,
      duration: dur,
      ease: 'power3.inOut',
      overwrite: 'auto',
      onUpdate: applyCam,
    })
  }
  syncZoomBtn(cur)
}
zoomBtn.addEventListener('click', toggleZoom)
addEventListener('keydown', (e) => {
  if ((e.key === 'z' || e.key === 'Z') && !e.ctrlKey && !e.metaKey && !e.altKey)
    toggleZoom()
})

// ── Fase 4 · Puzzle interactivo: arrastrar piezas a YouTube API ──
const puzzleMsg = document.getElementById('puzzle-msg')
const ytLockEl = document.getElementById('lk-yt')
const ytPos = P(...G_YT)
const DRAG_HOME = { 'd-jwt': P(...G_JWT), 'd-access': P(...G_ACC) }
const cancelDrags = []
let puzzleSolved = false
function resetPuzzle(sceneIdx) {
  cancelDrags.forEach((fn) => fn())
  Object.entries(DRAG_HOME).forEach(([id, pos]) => {
    const el = document.getElementById(id)
    if (!el) return
    gsap.killTweensOf(el, 'x,y,scale')
    gsap.set(el, { x: pos.x, y: pos.y, ...(sceneIdx >= 6 ? { scale: 1 } : {}) })
  })
  ytLockEl.classList.remove('reject')
  document.body.classList.remove('is-puzzle-busy', 'is-puzzle-solved')
  if (puzzleSolved && sceneIdx < 8) {
    gsap.set('#lk-yt .slot', {
      attr: { fill: 'url(#hatch-dense)' },
      strokeDasharray: '3 2',
    })
  }
  puzzleSolved = false
  puzzleMsg.textContent = 'Arrastra una pieza hasta YouTube API.'
  puzzleMsg.className = 'puzzle-msg'
}

function makeDraggable(id, fits) {
  const el = document.getElementById(id)
  if (!el) return
  let dragging = false,
    pointerId = null,
    offset = { x: 0, y: 0 }
  const toLocal = (e) => {
    const pt = sceneEl.createSVGPoint()
    pt.x = e.clientX
    pt.y = e.clientY
    return pt.matrixTransform(el.parentNode.getScreenCTM().inverse())
  }
  const onMove = (e) => {
    if (!dragging || e.pointerId !== pointerId) return
    const p = toLocal(e)
    gsap.set(el, { x: p.x - offset.x, y: p.y - offset.y })
  }
  const endDrag = (e) => {
    if (!dragging || e.pointerId !== pointerId) return
    dragging = false
    pointerId = null
    document.body.classList.remove('is-puzzle-busy')
    removeEventListener('pointermove', onMove)
    removeEventListener('pointerup', endDrag)
    removeEventListener('pointercancel', endDrag)
    try {
      if (el.hasPointerCapture(e.pointerId))
        el.releasePointerCapture(e.pointerId)
    } catch {}
    const cx = gsap.getProperty(el, 'x'),
      cy = gsap.getProperty(el, 'y')
    const near = Math.hypot(cx - ytPos.x, cy - ytPos.y) < 58
    const home = DRAG_HOME[id]
    if (near && fits) {
      puzzleSolved = true
      document.body.classList.add('is-puzzle-solved')
      gsap.to(el, {
        x: ytPos.x,
        y: ytPos.y,
        scale: 0.85,
        duration: 0.25,
        ease: 'power2.out',
        overwrite: 'auto',
      })
      gsap.set('#lk-yt .slot', {
        attr: { fill: CREDS.access.color },
        strokeDasharray: 'none',
      })
      puzzleMsg.textContent =
        '¡Encaja! Solo el access token de Google abre YouTube API.'
      puzzleMsg.className = 'puzzle-msg ok'
    } else if (near && !fits) {
      ytLockEl.classList.add('reject')
      gsap.fromTo(
        ytLockEl,
        { x: ytPos.x - 7 },
        {
          x: ytPos.x,
          duration: 0.45,
          ease: 'elastic.out(1, 0.3)',
          overwrite: 'auto',
          onComplete: () => ytLockEl.classList.remove('reject'),
        },
      )
      gsap.to(el, {
        x: home.x,
        y: home.y,
        duration: 0.6,
        ease: 'elastic.out(1, 0.5)',
        overwrite: 'auto',
      })
      puzzleMsg.textContent =
        'No encaja: el JWT de Nocturne rebota. YouTube no lo reconoce.'
      puzzleMsg.className = 'puzzle-msg err'
    } else {
      gsap.to(el, {
        x: home.x,
        y: home.y,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    }
  }
  el.addEventListener('pointerdown', (e) => {
    if (!document.body.classList.contains('is-puzzle')) return
    e.preventDefault()
    gsap.killTweensOf(el, 'x,y')
    if (el.parentNode.lastElementChild !== el) el.parentNode.appendChild(el)
    dragging = true
    pointerId = e.pointerId
    document.body.classList.add('is-puzzle-busy')
    try {
      el.setPointerCapture(e.pointerId)
    } catch {}
    const p = toLocal(e)
    offset = {
      x: p.x - gsap.getProperty(el, 'x'),
      y: p.y - gsap.getProperty(el, 'y'),
    }
    addEventListener('pointermove', onMove)
    addEventListener('pointerup', endDrag)
    addEventListener('pointercancel', endDrag)
  })
  cancelDrags.push(() => {
    if (!dragging) return
    dragging = false
    pointerId = null
    document.body.classList.remove('is-puzzle-busy')
    removeEventListener('pointermove', onMove)
    removeEventListener('pointerup', endDrag)
    removeEventListener('pointercancel', endDrag)
  })
}
makeDraggable('d-jwt', false)
makeDraggable('d-access', true)

// ── Fase 5 · Epílogo "Ver como…" y navegación con teclado ──────
const WHO = {
  user: 'Usuario: eres tú en Chrome, guardando el JWT en storage.local.',
  google: 'Google: eres un sub con permisos youtube.force-ssl.',
  noct: 'Nocturne: eres un Bearer JWT → USER#sub → userId en SQS.',
}
const epiNav = document.getElementById('epilogue-nav')
const epiMsg = document.getElementById('epilogue-msg')
const EPI_CHIP = { user: 0, google: 1, noct: 2 }
function resetEpilogue() {
  if (!epiNav) return
  epiChip = 0
  epiNav
    .querySelectorAll('button')
    .forEach((x) => x.classList.toggle('on', x.dataset.who === 'user'))
  epiMsg.textContent = WHO.user
  gsap.to('#epi-rot', {
    rotation: '0_short',
    svgOrigin: '0 0',
    duration: reduce ? 0 : 0.45,
    ease: 'power2.out',
    overwrite: 'auto',
  })
}
if (epiNav) {
  epiNav.addEventListener('click', (e) => {
    const b = e.target.closest('button')
    if (!b) return
    epiChip = EPI_CHIP[b.dataset.who] ?? 0
    epiNav
      .querySelectorAll('button')
      .forEach((x) => x.classList.toggle('on', x === b))
    epiMsg.textContent = WHO[b.dataset.who]
    chips.forEach((c, k) => c.classList.toggle('on', k === epiChip))
    gsap.to('#epi-rot', {
      rotation: b.dataset.rot + '_short',
      svgOrigin: '0 0',
      duration: reduce ? 0 : 0.9,
      ease: 'power3.inOut',
      overwrite: 'auto',
    })
  })
}

// ── Carga limpia y reinicio en escena 1 al recargar ──────────────
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
ScrollTrigger.clearScrollMemory && ScrollTrigger.clearScrollMemory()
window.scrollTo(0, 0)

const waitLoad =
  document.readyState === 'complete'
    ? Promise.resolve()
    : new Promise((r) => addEventListener('load', r, { once: true }))
const waitFonts = document.fonts ? document.fonts.ready : Promise.resolve()
const waitMax = new Promise((r) => setTimeout(r, 1200))

Promise.race([Promise.all([waitLoad, waitFonts]), waitMax]).then(() => {
  window.scrollTo(0, 0)
  ScrollTrigger.refresh(true)
  tl.progress(0)
  applyCam()
  requestAnimationFrame(() =>
    document.documentElement.classList.remove('is-loading'),
  )
})
addEventListener('pageshow', (e) => {
  if (e.persisted) {
    window.scrollTo(0, 0)
    ScrollTrigger.refresh(true)
    tl.progress(0)
  }
})
