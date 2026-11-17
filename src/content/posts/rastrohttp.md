---
title: 'Trazar la ruta, cuidar la frontera'
date: 2026-11-15
description: 'El viaje completo de una petición en Aether, desde el clic con Google hasta el guardado en AWS sin exponer secretos por el camino.'
image: '/images/posts/TRexGor.webp'
imagePosition: '0% 30%'
---

Cuando pulsas **«Continuar con Google»** en Aether y segundos después guardas una obra en la nube, ocurre una conversación silenciosa entre cuatro actores: tu navegador, **Amazon Cognito**, **Google** y la infraestructura _serverless_ de **AWS** (API Gateway, Lambda, DynamoDB y S3).

A simple vista parece un único salto directo. En realidad, es una coreografía de redirecciones, pruebas criptográficas y cabeceras HTTP diseñada para cumplir una regla estricta: **el navegador nunca debe custodiar secretos críticos**, pero cada pieza de la nube debe tener la certeza absoluta de quién eres antes de escribir un solo byte.

<p align="center">
  <a class="rastro-http-image-link" href="/images/posts/monkei.webp" aria-label="Ampliar imagen al 200%">
    <img src="/images/posts/monkei.webp" alt="monkeyhttp" width="100%" style="cursor: zoom-in;" />
  </a>
</p>

<script>
  (() => {
    const imageLink = document.querySelector('.rastro-http-image-link')
    if (!imageLink) return

    const sourceImage = imageLink.querySelector('img')

    const closeZoom = (overlay) => {
      document.body.style.overflow = ''
      overlay.remove()
    }

    imageLink.addEventListener('click', (event) => {
      event.preventDefault()

      const overlay = document.createElement('div')
      overlay.className = 'rastro-http-zoom-overlay'
      overlay.setAttribute('role', 'dialog')
      overlay.setAttribute('aria-modal', 'true')
      overlay.setAttribute('aria-label', 'Imagen ampliada')

      const closeButton = document.createElement('button')
      closeButton.className = 'rastro-http-zoom-close'
      closeButton.type = 'button'
      closeButton.setAttribute('aria-label', 'Cerrar imagen ampliada')
      closeButton.textContent = '×'

      const zoomImage = document.createElement('img')
      zoomImage.src = sourceImage.src
      zoomImage.alt = sourceImage.alt
      zoomImage.style.width = `${sourceImage.getBoundingClientRect().width * 2}px`

      const stage = document.createElement('div')
      stage.className = 'rastro-http-zoom-stage'
      stage.appendChild(zoomImage)
      overlay.append(closeButton, stage)
      document.body.appendChild(overlay)
      document.body.style.overflow = 'hidden'

      closeButton.focus()

      closeButton.addEventListener('click', () => closeZoom(overlay))
      overlay.addEventListener('click', (clickEvent) => {
        if (clickEvent.target === overlay) closeZoom(overlay)
      })
      overlay.addEventListener('keydown', (keyEvent) => {
        if (keyEvent.key === 'Escape') closeZoom(overlay)
      })
    })
  })()
</script>

<style>
  .rastro-http-image-link {
    display: inline-block;
  }

  .rastro-http-zoom-overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;
    overflow: auto;
    background: rgba(247, 243, 237, 0.94);
    cursor: zoom-out;
  }

  .rastro-http-zoom-stage {
    display: grid;
    min-width: max-content;
    min-height: 100%;
    padding: 3rem;
    place-items: center;
  }

  .rastro-http-zoom-stage img {
    display: block;
    max-width: none;
    height: auto;
    cursor: zoom-out;
  }

  .rastro-http-zoom-close {
    position: fixed;
    top: 1rem;
    right: 1.25rem;
    z-index: 1;
    width: 2.25rem;
    height: 2.25rem;
    border: 1px solid var(--color-border);
    border-radius: 50%;
    background: var(--color-bg);
    color: var(--color-text);
    cursor: pointer;
    font-family: var(--font-body);
    font-size: 1.6rem;
    line-height: 1;
  }
</style>

> _Nota: Los fragmentos HTTP y rutas mostradas en el diagrama y a lo largo de este recorrido son ilustrativos (no son una captura de tráfico real), aunque reflejan fielmente la separación de responsabilidades y los endpoints configurados en Aether._

---

### Acto I: El apretón de manos sin secretos (Cognito, PKCE y federación)

Como Aether es una aplicación web que corre directamente en el navegador (una SPA), no puede guardar llaves maestras como el _Google Client Secret_: cualquier dato incrustado en el código del cliente es público. Para resolverlo sin tener que levantar ni mantener un servidor intermedio propio, delegamos esa custodia confidencial en **Amazon Cognito**, apoyando todo el intercambio en el flujo **OAuth 2.0 con PKCE** (_Proof Key for Code Exchange_):

### Acto II: Llamar a la puerta de la nube (Cabeceras y confianza)

Con la sesión iniciada en memoria, llega el momento de sincronizar una obra. Aquí entra en juego la segunda mitad del viaje: el viaje de una petición autenticada desde el navegador hasta la base de datos.Cuando Aether sincroniza, realiza una petición HTTPS contra **Amazon API Gateway** adjuntando el `accessToken` de Cognito dentro de la cabecera estándar

<p align="center">
  <a href="https://christiangohring.com/experiencias/flujo-serverless/index.html" target="_blank" rel="noopener noreferrer" style="color: #0b7893; text-decoration: underline; text-decoration-color: rgba(11, 120, 147, 0.45); text-decoration-thickness: 1px; text-underline-offset: 0.18em; font-weight: 700;">
    FLUJO INMERSIVO HTTP
  </a>
</p>

<p align="center"><img src="/images/posts/mon.webp" alt="Descripción de la imagen" width="50%"></p>

### Vista de Pajáro del flujo completo de cómo viajan las solicitudes HTTP y sus cabeceras desde el navegador hasta AWS.

<div id="aetherFactoryPkceWrapper" style="position: relative; width: min(92vw, 1380px); margin: 2.5rem 0 2.5rem 50%; transform: translateX(-50%); border-radius: 16px; transition: all 0.25s ease; z-index: 10;">
  <svg id="aetherFactoryPkceSvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 960" width="1400" height="960" style="width: 100%; height: auto; background: #D8E2E6; display: block; margin: 0 auto; border-radius: 16px; border: 3px solid #263238; box-shadow: 0 18px 48px rgba(0,0,0,0.45); user-select: none;">
    <defs>
      <!-- GRADIENTES PICTÓRICOS DE NAVE INDUSTRIAL LUMINOSA -->
      <linearGradient id="skyRoof" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#C9DCE3" />
        <stop offset="55%" stop-color="#E7EFEF" />
        <stop offset="100%" stop-color="#C8D3D5" />
      </linearGradient>
      <linearGradient id="sunBeam" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.55" />
        <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.0" />
      </linearGradient>
      <linearGradient id="floorFactory" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#9AA8AC" />
        <stop offset="100%" stop-color="#6E7D82" />
      </linearGradient>
      <linearGradient id="steelMach" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#37474F" />
        <stop offset="50%" stop-color="#607D8B" />
        <stop offset="100%" stop-color="#263238" />
      </linearGradient>
      <linearGradient id="fabricRoll" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#DCE4E7" />
        <stop offset="50%" stop-color="#FFFFFF" />
        <stop offset="100%" stop-color="#B0BEC5" />
      </linearGradient>
      <linearGradient id="goldBrass" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#F6D365" />
        <stop offset="100%" stop-color="#C58B2A" />
      </linearGradient>
      <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#102027" flood-opacity="0.45" />
      </filter>
      <marker id="arrFactoryC" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="#00ACC1" />
      </marker>
      <marker id="arrFactoryA" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="#E69500" />
      </marker>
      <marker id="arrFactoryG" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="#2E7D32" />
      </marker>
      <marker id="arrFactoryP" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="#C2185B" />
      </marker>
      <marker id="arrFactoryV" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="#5E35B1" />
      </marker>
      <style>
        .fac-title { font-family: 'Georgia', 'Times New Roman', serif; font-weight: 800; letter-spacing: 0.02em; }
        .fac-sans { font-family: 'Trebuchet MS', 'Segoe UI', sans-serif; font-weight: 700; }
        .fac-mono { font-family: 'Consolas', 'Courier New', monospace; font-weight: 700; }
        .fac-lifeline { stroke: #263238; stroke-width: 2; stroke-dasharray: 6 6; opacity: 0.65; }
        @keyframes marchFac { to { stroke-dashoffset: -24; } }
        .fac-stream { stroke-dasharray: 9 4; animation: marchFac 1.05s linear infinite; }
        .fac-btn { cursor: pointer; }
        .fac-btn rect.btn-face { transition: filter 0.15s ease, stroke-width 0.15s ease; }
        .fac-btn:hover rect.btn-face { filter: brightness(1.1); stroke-width: 2.5; }
        .fac-step { cursor: pointer; transition: opacity 0.35s ease; }
        .fac-step.dimmed { opacity: 0.28; }
        .fac-step.active-step rect.pill-card { fill: #FFF8DC !important; stroke: #D84315 !important; stroke-width: 2.8 !important; }
      </style>
    </defs>
    <!-- ===================================================================== -->
    <!-- FONDO PICTÓRICO: NAVE TEXTIL INDUSTRIAL EN PERSPECTIVA                -->
    <!-- ===================================================================== -->
    <rect width="1400" height="835" fill="url(#skyRoof)" />
    <!-- Suelo perspectiva -->
    <polygon points="0,560 1400,560 1400,835 0,835" fill="url(#floorFactory)" />
    <line x1="0" y1="560" x2="1400" y2="560" stroke="#455A64" stroke-width="3" />
    <!-- Cerchas y claraboyas de techo en perspectiva -->
    <g stroke="#546E7A" stroke-width="2" fill="none" opacity="0.75">
      <polygon points="120,65 560,235 840,235 1280,65" fill="#EFF6F8" opacity="0.65" />
      <line x1="260" y1="65" x2="610" y2="235" />
      <line x1="420" y1="65" x2="660" y2="235" />
      <line x1="700" y1="65" x2="700" y2="235" />
      <line x1="980" y1="65" x2="740" y2="235" />
      <line x1="1140" y1="65" x2="790" y2="235" />
      <line x1="180" y1="110" x2="1220" y2="110" />
      <line x1="340" y1="165" x2="1060" y2="165" />
      <line x1="480" y1="205" x2="920" y2="205" />
    </g>
    <!-- Ventanales industriales laterales -->
    <g fill="#F4FAFC" stroke="#455A64" stroke-width="2.5" opacity="0.85">
      <rect x="24" y="135" width="95" height="250" />
      <line x1="55" y1="135" x2="55" y2="385" />
      <line x1="88" y1="135" x2="88" y2="385" />
      <line x1="24" y1="215" x2="119" y2="215" />
      <line x1="24" y1="300" x2="119" y2="300" />
      <rect x="1280" y="135" width="95" height="250" />
      <line x1="1312" y1="135" x2="1312" y2="385" />
      <line x1="1345" y1="135" x2="1345" y2="385" />
      <line x1="1280" y1="215" x2="1375" y2="215" />
      <line x1="1280" y1="300" x2="1375" y2="300" />
    </g>
    <!-- Haces de luz cenital -->
    <polygon points="350,120 560,120 440,680 140,680" fill="url(#sunBeam)" />
    <polygon points="840,120 1050,120 1260,680 960,680" fill="url(#sunBeam)" />
    <!-- ===================================================================== -->
    <!-- MAQUINARIA TEXTIL Y RACK DE SERVIDORES EN EL FONDO                    -->
    <!-- ===================================================================== -->
    <!-- Rack de Servidores Central (Cognito <-> Google Back-Channel) -->
    <g transform="translate(615, 425)">
      <rect x="0" y="0" width="170" height="175" rx="6" fill="#263238" stroke="#102027" stroke-width="3" />
      <rect x="12" y="12" width="68" height="150" fill="#37474F" stroke="#102027" stroke-width="1.5" />
      <rect x="90" y="12" width="68" height="150" fill="#37474F" stroke="#102027" stroke-width="1.5" />
      <circle cx="26" cy="30" r="3" fill="#4DD0E1" />
      <circle cx="38" cy="30" r="3" fill="#AED581" />
      <circle cx="26" cy="52" r="3" fill="#FFB74D" />
      <circle cx="104" cy="30" r="3" fill="#4DD0E1" />
      <circle cx="116" cy="30" r="3" fill="#AED581" />
      <line x1="20" y1="75" x2="72" y2="75" stroke="#78909C" stroke-width="2" />
      <line x1="20" y1="95" x2="72" y2="95" stroke="#78909C" stroke-width="2" />
      <line x1="98" y1="75" x2="150" y2="75" stroke="#78909C" stroke-width="2" />
      <line x1="98" y1="95" x2="150" y2="95" stroke="#78909C" stroke-width="2" />
    </g>
    <!-- Telar / Rodillos Izquierda (Estación AETHER Navegador) -->
    <g transform="translate(65, 385)">
      <rect x="20" y="40" width="220" height="295" rx="8" fill="url(#steelMach)" stroke="#102027" stroke-width="3" />
      <!-- Rodillos de tela blanca -->
      <rect x="42" y="65" width="175" height="34" rx="14" fill="url(#fabricRoll)" stroke="#263238" stroke-width="2" />
      <rect x="42" y="125" width="175" height="38" rx="16" fill="url(#fabricRoll)" stroke="#263238" stroke-width="2" />
      <path d="M 65 163 L 52 315 L 195 315 L 185 163 Z" fill="#ECEFF1" stroke="#546E7A" stroke-width="2" />
      <!-- Engranajes laterales -->
      <circle cx="24" cy="115" r="24" fill="#37474F" stroke="#102027" stroke-width="3" />
      <circle cx="24" cy="115" r="10" fill="#90A4AE" />
      <circle cx="26" cy="255" r="36" fill="#263238" stroke="#102027" stroke-width="3.5" />
      <circle cx="26" cy="255" r="16" fill="#78909C" />
    </g>
    <!-- Telar Central Izquierdo (Estación Amazon Cognito) -->
    <g transform="translate(360, 485)">
      <rect x="0" y="30" width="230" height="190" rx="8" fill="url(#steelMach)" stroke="#102027" stroke-width="3" />
      <rect x="22" y="48" width="186" height="36" rx="14" fill="url(#fabricRoll)" stroke="#263238" stroke-width="2" />
      <path d="M 35 84 L 25 185 L 195 185 L 185 84 Z" fill="#F5F7F8" stroke="#546E7A" stroke-width="2" />
      <circle cx="232" cy="145" r="26" fill="#263238" stroke="#102027" stroke-width="3" />
      <circle cx="232" cy="145" r="11" fill="#90A4AE" />
    </g>
    <!-- Telar Central Derecho (Estación Google OAuth) -->
    <g transform="translate(805, 485)">
      <rect x="0" y="30" width="230" height="190" rx="8" fill="url(#steelMach)" stroke="#102027" stroke-width="3" />
      <rect x="22" y="48" width="186" height="36" rx="14" fill="url(#fabricRoll)" stroke="#263238" stroke-width="2" />
      <path d="M 35 84 L 25 185 L 195 185 L 185 84 Z" fill="#F5F7F8" stroke="#546E7A" stroke-width="2" />
    </g>
    <!-- Telar Derecha + Bobina gigante (Estación API Gateway) -->
    <g transform="translate(1080, 385)">
      <rect x="30" y="45" width="220" height="280" rx="8" fill="url(#steelMach)" stroke="#102027" stroke-width="3" />
      <rect x="52" y="75" width="175" height="36" rx="14" fill="url(#goldBrass)" stroke="#263238" stroke-width="2.5" />
      <path d="M 65 111 L 55 290 L 205 290 L 195 111 Z" fill="#ECEFF1" stroke="#546E7A" stroke-width="2" />
      <!-- Bobina inferior derecha -->
      <g transform="translate(165, 295)">
        <ellipse cx="45" cy="10" rx="45" ry="12" fill="#8D6E63" stroke="#102027" stroke-width="2.5" />
        <rect x="6" y="10" width="78" height="62" fill="#EFEBE9" stroke="#102027" stroke-width="2.5" />
        <ellipse cx="45" cy="72" rx="45" ry="12" fill="#6D4C41" stroke="#102027" stroke-width="2.5" />
      </g>
    </g>
    <!-- ===================================================================== -->
    <!-- OPERARIOS GORILAS CON GAFAS Y CASCO EN CADA ESTACIÓN                  -->
    <!-- ===================================================================== -->
    <!-- Gorila 1 (Abajo izquierda, manipulando hilos PKCE) -->
    <g transform="translate(15, 570)">
      <path d="M 28 75 C 18 115 22 175 32 225 L 92 225 C 102 175 104 115 92 75 Z" fill="#8D5524" stroke="#102027" stroke-width="2.5" />
      <path d="M 34 75 L 86 75 L 82 120 L 38 120 Z" fill="#ECEFF1" stroke="#102027" stroke-width="2" />
      <!-- Cabeza gorila + casco -->
      <circle cx="62" cy="46" r="24" fill="#37474F" stroke="#102027" stroke-width="2.5" />
      <ellipse cx="66" cy="52" rx="15" ry="12" fill="#D7B899" stroke="#102027" stroke-width="2" />
      <circle cx="62" cy="44" r="6" fill="none" stroke="#FFB300" stroke-width="2.5" />
      <circle cx="74" cy="44" r="6" fill="none" stroke="#FFB300" stroke-width="2.5" />
      <path d="M 38 34 C 42 14 82 14 86 34 Z" fill="#CFD8DC" stroke="#102027" stroke-width="2.5" />
      <!-- Brazos sosteniendo hilo blanco -->
      <path d="M 88 92 Q 120 105 138 98" fill="none" stroke="#37474F" stroke-width="11" stroke-linecap="round" />
      <path d="M 134 94 Q 152 125 142 152 Q 165 135 162 110" fill="none" stroke="#FFFFFF" stroke-width="3.5" />
    </g>
    <!-- Gorila 2 (Centro izquierda, frente a consola Cognito) -->
    <g transform="translate(475, 565)">
      <path d="M 25 75 C 18 120 22 175 30 220 L 88 220 C 96 175 98 120 90 75 Z" fill="#1E568A" stroke="#102027" stroke-width="2.5" />
      <path d="M 32 75 L 82 75 L 78 118 L 36 118 Z" fill="#ECEFF1" stroke="#102027" stroke-width="2" />
      <circle cx="56" cy="46" r="23" fill="#37474F" stroke="#102027" stroke-width="2.5" />
      <ellipse cx="52" cy="52" rx="14" ry="11" fill="#D7B899" stroke="#102027" stroke-width="2" />
      <circle cx="46" cy="44" r="6" fill="none" stroke="#FFB300" stroke-width="2.5" />
      <circle cx="58" cy="44" r="6" fill="none" stroke="#FFB300" stroke-width="2.5" />
      <path d="M 33 34 C 37 14 76 14 80 34 Z" fill="#CFD8DC" stroke="#102027" stroke-width="2.5" />
    </g>
    <!-- Gorila 3 (Centro derecha, bata de laboratorio en Google OAuth) -->
    <g transform="translate(835, 565)">
      <path d="M 22 72 L 94 72 L 102 220 L 16 220 Z" fill="#E6E1D6" stroke="#102027" stroke-width="2.5" />
      <circle cx="58" cy="44" r="23" fill="#37474F" stroke="#102027" stroke-width="2.5" />
      <ellipse cx="62" cy="50" rx="14" ry="11" fill="#D7B899" stroke="#102027" stroke-width="2" />
      <circle cx="56" cy="42" r="6" fill="none" stroke="#FFB300" stroke-width="2.5" />
      <circle cx="68" cy="42" r="6" fill="none" stroke="#FFB300" stroke-width="2.5" />
      <path d="M 35 32 C 39 12 78 12 82 32 Z" fill="#CFD8DC" stroke="#102027" stroke-width="2.5" />
    </g>
    <!-- Gorila 4 (Arriba derecha, operando poleas de API Gateway) -->
    <g transform="translate(1110, 325)">
      <path d="M 25 68 L 85 68 L 90 145 L 20 145 Z" fill="#37474F" stroke="#102027" stroke-width="2.5" />
      <circle cx="55" cy="42" r="21" fill="#37474F" stroke="#102027" stroke-width="2.5" />
      <ellipse cx="52" cy="47" rx="13" ry="10" fill="#D7B899" stroke="#102027" stroke-width="2" />
      <circle cx="46" cy="40" r="5.5" fill="none" stroke="#FFB300" stroke-width="2.2" />
      <circle cx="57" cy="40" r="5.5" fill="none" stroke="#FFB300" stroke-width="2.2" />
      <path d="M 34 30 C 38 12 72 12 76 30 Z" fill="#CFD8DC" stroke="#102027" stroke-width="2.2" />
      <line x1="25" y1="78" x2="-15" y2="35" stroke="#37474F" stroke-width="9" stroke-linecap="round" />
    </g>
    <!-- Gorila 5 (Abajo derecha, guiando hilo hacia bobina API Gateway) -->
    <g transform="translate(1105, 585)">
      <path d="M 22 72 L 90 72 L 96 205 L 18 205 Z" fill="#D7CFC2" stroke="#102027" stroke-width="2.5" />
      <circle cx="56" cy="44" r="22" fill="#37474F" stroke="#102027" stroke-width="2.5" />
      <ellipse cx="60" cy="50" rx="14" ry="11" fill="#D7B899" stroke="#102027" stroke-width="2" />
      <circle cx="54" cy="42" r="5.5" fill="none" stroke="#FFB300" stroke-width="2.2" />
      <circle cx="65" cy="42" r="5.5" fill="none" stroke="#FFB300" stroke-width="2.2" />
      <path d="M 34 32 C 38 12 74 12 78 32 Z" fill="#CFD8DC" stroke="#102027" stroke-width="2.2" />
    </g>
    <!-- ===================================================================== -->
    <!-- BARRA DE CONTROLES SUPERIOR Y CABECERAS DE ACTORES                    -->
    <!-- ===================================================================== -->
    <g transform="translate(24, 14)">
      <rect width="1352" height="44" rx="10" fill="#1C282E" fill-opacity="0.92" stroke="#455A64" stroke-width="2" />
      <text x="18" y="28" class="fac-sans" font-size="15" fill="#ECEFF1">🏭 FACTORÍA DE IDENTIDAD AETHER · FLUJO OAUTH 2.0 PKCE + API GATEWAY</text>
      <g class="fac-btn" transform="translate(815, 5)" onclick="window.toggleFacAuto()">
        <rect id="btn-fac-auto-bg" class="btn-face" width="142" height="34" rx="17" fill="#006064" stroke="#4DD0E1" stroke-width="1.8" pointer-events="all" />
        <text id="btn-fac-auto-txt" x="71" y="22" class="fac-mono" font-size="11" fill="#E0F7FA" text-anchor="middle" pointer-events="none">⏸ Pausar Auto</text>
      </g>
      <g class="fac-btn" transform="translate(968, 5)" onclick="window.nextFacStep()">
        <rect class="btn-face" width="132" height="34" rx="17" fill="#263238" stroke="#CFD8DC" stroke-width="1.5" pointer-events="all" />
        <text x="66" y="22" class="fac-mono" font-size="11" fill="#FFFFFF" text-anchor="middle" pointer-events="none">Siguiente ➔</text>
      </g>
      <g class="fac-btn" transform="translate(1111, 5)" onclick="window.resetFacFlow()">
        <rect class="btn-face" width="110" height="34" rx="17" fill="#4A142C" stroke="#F48FB1" stroke-width="1.5" pointer-events="all" />
        <text x="55" y="22" class="fac-mono" font-size="11" fill="#F8BBD0" text-anchor="middle" pointer-events="none">↺ Reiniciar</text>
      </g>
      <g class="fac-btn" transform="translate(1232, 5)" onclick="window.toggleFacExpand()">
        <rect id="btn-fac-exp-bg" class="btn-face" width="108" height="34" rx="17" fill="#37474F" stroke="#FFE082" stroke-width="1.5" pointer-events="all" />
        <text id="btn-fac-exp-txt" x="54" y="22" class="fac-mono" font-size="11" fill="#FFE082" text-anchor="middle" pointer-events="none">⛶ Ampliar</text>
      </g>
    </g>
    <!-- LÍNEAS DE VIDA VERTICALES -->
    <g>
      <line class="fac-lifeline" x1="185" y1="128" x2="185" y2="815" />
      <line class="fac-lifeline" x1="535" y1="128" x2="535" y2="815" />
      <line class="fac-lifeline" x1="885" y1="128" x2="885" y2="815" />
      <line class="fac-lifeline" x1="1225" y1="128" x2="1225" y2="815" />
    </g>
    <!-- CARTELES SUPERIORES DE LOS 4 PARTICIPANTES (ESTILO DE LA IMAGEN) -->
    <g filter="url(#softShadow)">
      <g transform="translate(55, 72)">
        <rect width="260" height="54" rx="6" fill="#F7F5EE" stroke="#263238" stroke-width="3" />
        <text x="130" y="35" class="fac-title" font-size="24" fill="#1C262B" text-anchor="middle">AETHER <tspan font-family="Trebuchet MS, sans-serif" font-size="18" font-weight="normal">(Navegador)</tspan></text>
      </g>
      <g transform="translate(405, 72)">
        <rect width="260" height="54" rx="6" fill="#F7F5EE" stroke="#263238" stroke-width="3" />
        <text x="130" y="35" class="fac-title" font-size="24" fill="#1C262B" text-anchor="middle">Amazon Cognito</text>
      </g>
      <g transform="translate(765, 72)">
        <rect width="240" height="54" rx="6" fill="#F7F5EE" stroke="#263238" stroke-width="3" />
        <text x="120" y="35" class="fac-title" font-size="24" fill="#1C262B" text-anchor="middle">Google OAuth</text>
      </g>
      <g transform="translate(1110, 72)">
        <rect width="230" height="54" rx="6" fill="#F7F5EE" stroke="#263238" stroke-width="3" />
        <text x="115" y="35" class="fac-title" font-size="24" fill="#1C262B" text-anchor="middle">API Gateway</text>
      </g>
    </g>
    <!-- ===================================================================== -->
    <!-- ETIQUETA ACTO I                                                       -->
    <!-- ===================================================================== -->
    <g transform="translate(48, 142)">
      <rect width="465" height="26" rx="13" fill="url(#goldBrass)" stroke="#263238" stroke-width="2" />
      <text x="232" y="18" class="fac-sans" font-size="12" fill="#1C262B" text-anchor="middle">ACTO I · EL APRETÓN DE MANOS SIN SECRETOS (PKCE Y FEDERACIÓN)</text>
    </g>
    <!-- ===================================================================== -->
    <!-- LOS 9 PASOS INTERACTIVOS DEL DIAGRAMA                                 -->
    <!-- ===================================================================== -->
    <!-- PASO 1 -->
    <g id="fac-step-0" class="fac-step" onclick="window.selectFacStep(0)">
      <circle cx="185" cy="198" r="13" fill="#4DD0E1" stroke="#1C262B" stroke-width="2" />
      <text x="185" y="203" class="fac-mono" font-size="12" fill="#1C262B" text-anchor="middle">1</text>
      <rect class="pill-card" x="208" y="176" width="315" height="44" rx="8" fill="#F7F5EE" stroke="#263238" stroke-width="2" />
      <text x="365" y="195" class="fac-sans" font-size="12.5" fill="#1C262B" text-anchor="middle">Genera code_verifier + state (RAM)</text>
      <text x="365" y="212" class="fac-mono" font-size="11.5" fill="#37474F" text-anchor="middle">Calcula huella SHA-256 (code_challenge)</text>
    </g>
    <!-- PASO 2 -->
    <g id="fac-step-1" class="fac-step" onclick="window.selectFacStep(1)">
      <circle cx="185" cy="256" r="13" fill="#4DD0E1" stroke="#1C262B" stroke-width="2" />
      <text x="185" y="261" class="fac-mono" font-size="12" fill="#1C262B" text-anchor="middle">2</text>
      <rect class="pill-card" x="215" y="232" width="290" height="22" rx="6" fill="#F7F5EE" stroke="#263238" stroke-width="1.5" />
      <text x="360" y="247" class="fac-sans" font-size="12" fill="#1C262B" text-anchor="middle">Redirect (Client ID + code_challenge + state)</text>
      <line class="fac-stream" x1="198" y1="262" x2="525" y2="262" stroke="#00ACC1" stroke-width="3" marker-end="url(#arrFactoryC)" />
    </g>
    <!-- PASO 3 -->
    <g id="fac-step-2" class="fac-step" onclick="window.selectFacStep(2)">
      <circle cx="535" cy="306" r="13" fill="#FFB300" stroke="#1C262B" stroke-width="2" />
      <text x="535" y="311" class="fac-mono" font-size="12" fill="#1C262B" text-anchor="middle">3</text>
      <rect class="pill-card" x="562" y="282" width="295" height="22" rx="6" fill="#F7F5EE" stroke="#263238" stroke-width="1.5" />
      <text x="709" y="297" class="fac-sans" font-size="12" fill="#1C262B" text-anchor="middle">HTTP 302 ➔ Pantalla Login Google (/idpresponse)</text>
      <line class="fac-stream" x1="548" y1="312" x2="875" y2="312" stroke="#E69500" stroke-width="3" marker-end="url(#arrFactoryA)" />
    </g>
    <!-- PASO 4 -->
    <g id="fac-step-3" class="fac-step" onclick="window.selectFacStep(3)">
      <circle cx="885" cy="362" r="13" fill="#66BB6A" stroke="#1C262B" stroke-width="2" />
      <text x="885" y="367" class="fac-mono" font-size="12" fill="#1C262B" text-anchor="middle">4</text>
      <rect class="pill-card" x="575" y="338" width="270" height="22" rx="6" fill="#F7F5EE" stroke="#263238" stroke-width="1.5" />
      <text x="710" y="353" class="fac-sans" font-size="12" fill="#1C262B" text-anchor="middle">Callback con código temporal de Google</text>
      <line class="fac-stream" x1="872" y1="368" x2="545" y2="368" stroke="#2E7D32" stroke-width="3" marker-end="url(#arrFactoryG)" />
    </g>
    <!-- PASO 5 -->
    <g id="fac-step-4" class="fac-step" onclick="window.selectFacStep(4)">
      <circle cx="535" cy="422" r="13" fill="#EC407A" stroke="#1C262B" stroke-width="2" />
      <text x="535" y="427" class="fac-mono" font-size="12" fill="#FFFFFF" text-anchor="middle">5</text>
      <rect class="pill-card" x="565" y="396" width="290" height="24" rx="12" fill="#FCE4EC" stroke="#C2185B" stroke-width="2" />
      <text x="710" y="412" class="fac-sans" font-size="12" fill="#880E4F" text-anchor="middle">🔒 Canje Server-to-Server (Client Secret)</text>
      <line class="fac-stream" x1="548" y1="428" x2="875" y2="428" stroke="#C2185B" stroke-width="3" marker-end="url(#arrFactoryP)" marker-start="url(#arrFactoryP)" />
    </g>
    <!-- PASO 6 -->
    <g id="fac-step-5" class="fac-step" onclick="window.selectFacStep(5)">
      <circle cx="535" cy="482" r="13" fill="#FFB300" stroke="#1C262B" stroke-width="2" />
      <text x="535" y="487" class="fac-mono" font-size="12" fill="#1C262B" text-anchor="middle">6</text>
      <rect class="pill-card" x="225" y="458" width="270" height="22" rx="6" fill="#F7F5EE" stroke="#263238" stroke-width="1.5" />
      <text x="360" y="473" class="fac-sans" font-size="12" fill="#1C262B" text-anchor="middle">Redirect Callback con Código Cognito</text>
      <line class="fac-stream" x1="522" y1="488" x2="195" y2="488" stroke="#E69500" stroke-width="3" marker-end="url(#arrFactoryA)" />
    </g>
    <!-- PASO 7 -->
    <g id="fac-step-6" class="fac-step" onclick="window.selectFacStep(6)">
      <circle cx="185" cy="542" r="13" fill="#9575CD" stroke="#1C262B" stroke-width="2" />
      <text x="185" y="547" class="fac-mono" font-size="12" fill="#FFFFFF" text-anchor="middle">7</text>
      <rect class="pill-card" x="215" y="518" width="290" height="22" rx="6" fill="#F7F5EE" stroke="#263238" stroke-width="1.5" />
      <text x="360" y="533" class="fac-mono" font-size="11.5" fill="#1C262B" text-anchor="middle">POST /oauth2/token (código + code_verifier)</text>
      <line class="fac-stream" x1="198" y1="548" x2="525" y2="548" stroke="#5E35B1" stroke-width="3" marker-end="url(#arrFactoryV)" />
    </g>
    <!-- PASO 8 -->
    <g id="fac-step-7" class="fac-step" onclick="window.selectFacStep(7)">
      <circle cx="535" cy="604" r="13" fill="#66BB6A" stroke="#1C262B" stroke-width="2" />
      <text x="535" y="609" class="fac-mono" font-size="12" fill="#1C262B" text-anchor="middle">8</text>
      <rect class="pill-card" x="218" y="578" width="285" height="24" rx="12" fill="#E8F5E9" stroke="#2E7D32" stroke-width="2" />
      <text x="360" y="594" class="fac-sans" font-size="12" fill="#1B5E20" text-anchor="middle">✅ 200 OK: JWT Tokens ➔ Solo en RAM</text>
      <line class="fac-stream" x1="522" y1="610" x2="195" y2="610" stroke="#2E7D32" stroke-width="3" marker-end="url(#arrFactoryG)" />
    </g>
    <!-- ===================================================================== -->
    <!-- ETIQUETA ACTO II + PASO 9                                             -->
    <!-- ===================================================================== -->
    <g transform="translate(48, 705)">
      <rect width="465" height="26" rx="13" fill="url(#goldBrass)" stroke="#263238" stroke-width="2" />
      <text x="232" y="18" class="fac-sans" font-size="12" fill="#1C262B" text-anchor="middle">ACTO II · LLAMAR A LA PUERTA DE LA NUBE (CABECERAS Y CONFIANZA)</text>
    </g>
    <g id="fac-step-8" class="fac-step" onclick="window.selectFacStep(8)">
      <circle cx="185" cy="765" r="13" fill="#FFB300" stroke="#1C262B" stroke-width="2" />
      <text x="185" y="770" class="fac-mono" font-size="12" fill="#1C262B" text-anchor="middle">9</text>
      <rect class="pill-card" x="455" y="746" width="500" height="28" rx="14" fill="#F7F5EE" stroke="#263238" stroke-width="2" />
      <text x="705" y="765" class="fac-mono" font-size="12" fill="#1C262B" text-anchor="middle">HTTPS Sync ➔ Authorization: Bearer &lt;access_token_jwt&gt;</text>
      <line class="fac-stream" x1="198" y1="782" x2="1215" y2="782" stroke="#E69500" stroke-width="3.2" marker-end="url(#arrFactoryA)" />
    </g>
    <!-- ===================================================================== -->
    <!-- PANEL NARRADOR INFERIOR (INSPECTOR DE PASO ACTIVO)                    -->
    <!-- ===================================================================== -->
    <g transform="translate(24, 835)">
      <rect width="1352" height="108" rx="12" fill="#1C282E" stroke="#455A64" stroke-width="2.5" />
      <rect x="20" y="12" width="116" height="22" rx="11" fill="#006064" stroke="#4DD0E1" stroke-width="1.2" />
      <text id="facCounter" x="78" y="27" class="fac-mono" font-size="10.5" fill="#E0F7FA" text-anchor="middle">PASO 1 DE 9</text>
      <text id="facTitle" x="150" y="28" class="fac-mono" font-size="13" fill="#4DD0E1">1. AETHER PREPARA EL TERRENO EN LOCAL (PKCE)</text>
      <text id="facDesc1" x="20" y="53" class="fac-sans" font-size="12" fill="#ECEFF1">Al hacer clic en entrar, la aplicación genera en el navegador un código aleatorio secreto de un solo uso (code_verifier) y calcula su huella SHA-256 (code_challenge).</text>
      <text id="facDesc2" x="20" y="74" class="fac-sans" font-size="12" fill="#CFD8DC">También crea un identificador state para reconocer este intento concreto. Ambos valores quedan guardados de forma efímera en el navegador.</text>
      <text id="facDesc3" x="20" y="95" class="fac-mono" font-size="11" fill="#AED581">Seguridad SPA: Aquí no existe ni viaja ningún secreto maestro de Google.</text>
    </g>
  </svg>
</div>
<script is:inline>
(function() {
  var facData = [
    ["1. AETHER PREPARA EL TERRENO EN LOCAL (PKCE)", "Al hacer clic en entrar, la aplicación genera en el navegador un código aleatorio secreto de un solo uso (code_verifier) y calcula su huella SHA-256 (code_challenge).", "También crea un identificador state para reconocer este intento concreto. Ambos valores quedan guardados de forma efímera en el navegador.", "Seguridad SPA: Aquí no existe ni viaja ningún secreto maestro de Google.", "#4DD0E1"],
    ["2. EL SALTO HACIA AMAZON COGNITO", "El navegador redirige hacia el dominio de Amazon Cognito llevando únicamente el identificador público de la aplicación (Cognito App Client ID), el state y la huella code_challenge.", "Cognito verifica que la aplicación y la URL de retorno sean legítimas antes de preparar el puente hacia el proveedor externo.", "Identidad delegada: El code_verifier secreto permanece guardado dentro de la pestaña.", "#4DD0E1"],
    ["3. LA REDIRECCIÓN HTTP 302 HACIA GOOGLE", "Cognito responde con una redirección HTTP 302 que envía el navegador a la pantalla de acceso de Google.", "En la URL de redirección pasa su propio identificador y la ruta de retorno de Cognito (/oauth2/idpresponse).", "Federación OAuth 2.0: Google gestiona la autenticación visual del usuario.", "#FFB300"],
    ["4. GOOGLE AUTENTICA Y DEVUELVE UN CÓDIGO TEMPORAL", "Una vez que confirmas tu identidad en Google, este redirige el navegador de vuelta a Cognito transportando un código de autorización temporal.", "En este punto, AETHER todavía no tiene sesión iniciada ni ha recibido tokens propios.", "Transición segura: El código tiene una vida útil muy corta y un solo uso.", "#AED581"],
    ["5. EL INTERCAMBIO PRIVADO ENTRE SERVIDORES", "Cognito se comunica directamente por HTTPS con los servidores de Google y canjea ese código temporal.", "En esta llamada back-channel presenta el Google Client Secret, que vive a salvo en la configuración de AWS y jamás toca el navegador.", "Aislamiento de secretos: El cliente público nunca conoce la llave privada de Google.", "#F48FB1"],
    ["6. EL REGRESO A AETHER CON CÓDIGO PROPIO", "Confirmada la identidad, Cognito redirige el navegador a la ruta callback de AETHER.", "En esta redirección entrega ahora un código de autorización emitido por el propio Amazon Cognito.", "Preparando verificación: AETHER recupera el code_verifier guardado en el paso 1.", "#FFB300"],
    ["7. LA PRUEBA DE AUTORÍA (CANJE PKCE)", "El navegador envía una petición POST a /oauth2/token entregando el código junto con el code_verifier original.", "Cognito calcula su huella SHA-256 y comprueba que coincide exactamente con el code_challenge recibido en el paso 2.", "Prueba criptográfica: Demuestra que quien canjea el código es la misma pestaña que inició el viaje.", "#B39DDB"],
    ["8. LA ENTREGA DE LAS LLAVES (200 OK)", "Si la huella encaja, Cognito responde con HTTP 200 OK y entrega accessToken, idToken y refreshToken.", "Estos tokens quedan custodiados exclusivamente en la memoria volátil (RAM) de la pestaña, sin tocar localStorage.", "Fin del Acto I: Sesión autenticada y protegida contra persistencia XSS.", "#AED581"],
    ["9. ACTO II: CABECERA AUTHORIZATION HACIA API GATEWAY", "Cuando AETHER sincroniza una obra, realiza una petición HTTPS contra Amazon API Gateway adjuntando el JWT en la cabecera estándar.", "Cabecera enviada: Authorization: Bearer <access_token_jwt>", "Inicio del Acto II: API Gateway validará firma, audiencia y expiración antes de invocar Lambda.", "#FFE082"]
  ];
  var currentFacIdx = 0;
  var facAutoPlaying = true;
  var facTimer = null;
  window.selectFacStep = function(idx) {
    currentFacIdx = idx;
    for (var i = 0; i < 9; i++) {
      var el = document.getElementById('fac-step-' + i);
      if (!el) continue;
      el.classList.remove('active-step', 'dimmed');
      if (i === idx) {
        el.classList.add('active-step');
      } else if (i > idx) {
        el.classList.add('dimmed');
      }
    }
    var info = facData[idx];
    if (info) {
      document.getElementById('facCounter').textContent = 'PASO ' + (idx + 1) + ' DE 9';
      var tEl = document.getElementById('facTitle');
      tEl.textContent = info[0];
      tEl.setAttribute('fill', info[4]);
      document.getElementById('facDesc1').textContent = info[1];
      document.getElementById('facDesc2').textContent = info[2];
      document.getElementById('facDesc3').textContent = info[3];
    }
  };
  window.nextFacStep = function() {
    var next = (currentFacIdx + 1) % 9;
    window.selectFacStep(next);
  };
  window.resetFacFlow = function() {
    window.selectFacStep(0);
  };
  function startFacInterval() {
    if (facTimer) clearInterval(facTimer);
    facTimer = setInterval(function() {
      if (facAutoPlaying) {
        window.nextFacStep();
      }
    }, 2400);
  }
  window.toggleFacAuto = function() {
    facAutoPlaying = !facAutoPlaying;
    var txt = document.getElementById('btn-fac-auto-txt');
    var bg = document.getElementById('btn-fac-auto-bg');
    if (facAutoPlaying) {
      if (txt) { txt.textContent = '⏸ Pausar Auto'; txt.setAttribute('fill', '#E0F7FA'); }
      if (bg) { bg.setAttribute('fill', '#006064'); bg.setAttribute('stroke', '#4DD0E1'); }
      startFacInterval();
    } else {
      if (txt) { txt.textContent = '▶ Reanudar'; txt.setAttribute('fill', '#FFE082'); }
      if (bg) { bg.setAttribute('fill', '#3E2723'); bg.setAttribute('stroke', '#FFB300'); }
      if (facTimer) clearInterval(facTimer);
    }
  };
  window.isFacExpanded = false;
  window.toggleFacExpand = function() {
    var wrap = document.getElementById('aetherFactoryPkceWrapper');
    var svg = document.getElementById('aetherFactoryPkceSvg');
    var txt = document.getElementById('btn-fac-exp-txt');
    var bg = document.getElementById('btn-fac-exp-bg');
    if (!wrap || !svg) return;
    window.isFacExpanded = !window.isFacExpanded;
    if (window.isFacExpanded) {
      wrap.style.position = 'fixed';
      wrap.style.inset = '0';
      wrap.style.zIndex = '99999';
      wrap.style.width = '100vw';
      wrap.style.margin = '0';
      wrap.style.transform = 'none';
      wrap.style.padding = '20px';
      wrap.style.background = 'rgba(16, 24, 28, 0.94)';
      wrap.style.backdropFilter = 'blur(8px)';
      wrap.style.display = 'flex';
      wrap.style.alignItems = 'center';
      wrap.style.justifyContent = 'center';
      wrap.style.borderRadius = '0';
      svg.style.width = '95vw';
      svg.style.maxWidth = '1550px';
      svg.style.maxHeight = '92vh';
      svg.style.boxShadow = '0 25px 60px rgba(0, 0, 0, 0.9)';
      if (txt) txt.textContent = '✕ Cerrar';
      if (bg) bg.setAttribute('stroke', '#F48FB1');
    } else {
      wrap.style.position = 'relative';
      wrap.style.inset = 'auto';
      wrap.style.zIndex = '10';
      wrap.style.width = 'min(92vw, 1380px)';
      wrap.style.margin = '2.5rem 0 2.5rem 50%';
      wrap.style.transform = 'translateX(-50%)';
      wrap.style.padding = '0';
      wrap.style.background = 'transparent';
      wrap.style.backdropFilter = 'none';
      wrap.style.display = 'block';
      wrap.style.borderRadius = '16px';
      svg.style.width = '100%';
      svg.style.maxWidth = 'none';
      svg.style.maxHeight = 'none';
      svg.style.boxShadow = '0 18px 48px rgba(0,0,0,0.45)';
      if (txt) txt.textContent = '⛶ Ampliar';
      if (bg) bg.setAttribute('stroke', '#FFE082');
    }
  };
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && window.isFacExpanded) {
      window.toggleFacExpand();
    }
  });
  window.selectFacStep(0);
  startFacInterval();
})();
</script>

### Lo que queda tras seguir el rastro

Con esta vista de pájaro he querido aterrizar esas abstracciones que a veces resultan difíciles de visualizar cuando todo ocurre detrás de escena, para entender con claridad cómo Aether procesa las solicitudes HTTP, las redirecciones y sus cabeceras. No es el único diseño posible para resolver este problema —en arquitectura casi nunca hay un solo camino—, pero sí es el que elegí con intención para mantener este proyecto ligero, seguro y fiel a su propósito.
