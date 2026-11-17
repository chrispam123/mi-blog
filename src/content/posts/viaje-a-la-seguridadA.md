---
title: 'El viaje de auditar lo propio, proteger el espacio'
date: 2026-11-17
description: 'Por qué saqué los tokens de sesión de localStorage en Aether sabiendo que en seguridad ningún patrón es invulnerable.'
image: '/images/posts/Gorila.webp'
imagePosition: '0% 30%'
---

## El viaje de la seguridad en Aether: por qué sacar los tokens de `localStorage` (aunque ningún patrón sea 100 % invulnerable)

Cuando terminas de construir una aplicación y por fin funciona en producción, llega una segunda etapa igual de importante pero mucho menos divertida: **auditar tus propias decisiones**.

Al revisar con calma la arquitectura actual de Aether, puse sobre la mesa dos frentes abiertos que necesitaban evolucionar:

1. **Seguridad de sesión:** Hoy los tokens de Amazon Cognito —incluido el _refresh token_— se guardan en `localStorage`. Si mañana se cuela un script malicioso (XSS), puede leerlos y suplantar la sesión, dificil pero en el mundo digital siempre existe una posibilidad.
2. **Sincronización no durable ni atómica:** Aunque invertí el orden con un _Two-Phase Commit_ en el cliente (`init → subida a S3 → complete`), sigue siendo el navegador quien coordina el baile. Si se cierra la pestaña justo en medio, aún pueden quedar archivos huérfanos en S3 o subidas concurrentes sin control de versiones.

En este ensayo voy a abordar el primer problema —**la seguridad de sesión**— desde una premisa que conviene asumir desde el principio: **en seguridad informática no existe el patrón 100 % invulnerable**. Todo son compromisos entre superficie de ataque, experiencia de usuario y complejidad de infraestructura.

---

### El punto de partida: lo que cualquiera puede ver en `localStorage`

Actualmente, cuando inicias sesión en Aether, el navegador guarda un objeto bajo la clave `aether_auth_tokens` y lo vuelve a cargar cada vez que abres la aplicación. Si abres las herramientas de desarrollo del navegador (_DevTools_), ahí está todo a la vista:

<p align="center"><img src="/images/posts/tokengorila.webp" alt="Descripción de la imagen" width="70%"</p>

Mirando ese cuadro con frialdad, hay una confusión muy habitual que conviene aclarar primero: ver `expiresIn: 3600` **no significa que la sesión completa caduque en una hora**. Además, conviene dejar claro qué es exactamente lo que aparece ahí: esos tokens pertenecen a **Amazon Cognito**, el servicio de AWS que actúa como gestor de cuentas y sesiones propias de Aether. Aunque el usuario entre mediante inicio de sesión social con Google, **aquí no hay ninguna credencial ni token interno de su cuenta de Google expuesto**; son únicamente los tokens emitidos por Cognito para operar dentro de la aplicación.

Dentro de ese flujo OAuth / Cognito, cada pieza tiene una vida y un propósito distintos:

- **`accessToken`:** Es la llave que autoriza las llamadas a la API de Aether. Ese `3600` indica que esta llave dura 3.600 segundos (una hora).
- **`idToken`:** Contiene los atributos básicos de identidad del usuario autenticado dentro de Cognito, pero no es la credencial que autoriza operaciones contra el backend.
- **`refreshToken`:** Es la pieza realmente delicada. Tiene su propio tiempo de validez configurado aparte en Cognito (días o semanas) y sirve para solicitar nuevos tokens de acceso silenciosamente, sin obligar al usuario a volver a iniciar sesión.

### Por qué es un riesgo real (y cuál es su alcance exacto)

`localStorage` es un almacenamiento persistente asociado al origen del sitio. Sobrevive cuando cierras la pestaña o apagas el ordenador, y **cualquier código JavaScript que se ejecute dentro de tu página puede leerlo sin restricciones**.

Esto no significa que tener los tokens ahí implique un robo automático, pero sí abre una puerta innecesaria: si una vulnerabilidad XSS o una librería de terceros comprometida logra ejecutar JavaScript en el origen de Aether, puede leer `aether_auth_tokens` y exfiltrarlo. Con el `accessToken` tendría vía libre durante una hora; con un `refreshToken` válido, podría renovar la sesión en silencio durante mucho más tiempo.

Ahora bien, conviene acotar con total honestidad cuál es el **radio de impacto real** de ese escenario: el daño queda estrictamente limitado a **la superficie de ataque que Aether expone al autenticarse**, es decir, los documentos y metadatos sincronizados en la nube dentro de esta aplicación. Aquí **no se compromete la cuenta de Google del usuario**, ni su correo, ni ningún otro servicio externo: un atacante jamás podría salir de las fronteras de lo que los propios permisos de Aether autorizan. Aun así, proteger esos textos y notas merece cerrar cualquier puerta abierta por comodidad.

Además, hay un detalle operativo que suele pasarse por alto cuando ocurre un incidente: **volver a iniciar sesión en la app no expulsa al atacante**. Hacer _login_ de nuevo genera una sesión nueva, pero deja viva la anterior. Si sospechas un robo real, el orden prudente es:

1. **Revocar explícitamente** la sesión comprometida (o todas las sesiones del usuario en Cognito si no puedes aislarla).
2. **Cerrar sesión** en la aplicación local.
3. **Volver a autenticarte**, teniendo siempre presente que cualquier `accessToken` JWT ya emitido seguirá siendo válido hasta que cumpla su hora de vida si el backend solo valida firma y expiración sin consultar una lista de revocación.

### El dilema de diseño: ¿BFF completo o tokens en memoria?

Llegados a este punto, tenía dos caminos claros para endurecer Aether:

1. **La protección máxima — Patrón BFF (_Backend For Frontend_):**  
   Sacar por completo los tokens del navegador. Un servidor intermedio gestiona el intercambio con Cognito, guarda los tokens en backend y entrega al navegador únicamente una cookie `HttpOnly`, `Secure` y `SameSite`. Así JavaScript jamás puede tocar los tokens. El precio: introduces estado o una capa intermedia de servidor en una arquitectura que nació _serverless_ y ligera.
2. **La mitigación pragmática — Mantener los tokens solo en memoria (RAM):**  
   Dejar de escribir en `localStorage` y conservar los tokens exclusivamente dentro de una propiedad privada en memoria (`this.tokens`) en el servicio de autenticación mientras la pestaña esté abierta.

Para esta etapa de Aether elegí el **segundo camino: tokens solo en memoria**.

<p align="center"><img src="/images/posts/tokensmemoria.webp" alt="Descripción de la imagen" width="100%"></p>

¿Por qué este compromiso tiene todo el sentido aquí? Primero, porque **elimina por completo la persistencia en disco**: en cuanto cierras la pestaña o recargas la página, los tokens desaparecen. Segundo, porque encaja de forma natural con la filosofía **Local-First** de Aether: puedes abrir la aplicación, escribir y trabajar en IndexedDB sin estar logueado, y autenticarte únicamente cuando decides sincronizar con la nube.

Al mismo tiempo, es honesto reconocer sus límites: **mantener los tokens en memoria no protege frente a un script malicioso activo mientras la sesión está abierta** (un XSS en ejecución seguiría compartiendo el mismo entorno JavaScript de la pestaña). No es una bala de plata, pero reduce drásticamente la ventana de exposición sin sacrificar la simplicidad _serverless_ del proyecto.
**<p> Vista de pajáro del nuevo diseño tokens en memoria:</p>**

<div id="aetherPopArtWrapper" style="position: relative; width: min(92vw, 1380px); margin: 2.5rem 0 2.5rem 50%; transform: translateX(-50%); border-radius: 16px; transition: all 0.25s ease; z-index: 10;">
  <svg id="aetherPopArtSvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 980" width="1400" height="980" style="width: 100%; height: auto; background: #F5E6C4; display: block; margin: 0 auto; border-radius: 16px; border: 4px solid #14110F; box-shadow: 10px 10px 0px #14110F; user-select: none;">
    <defs>
      <pattern id="dotsBlue" width="12" height="12" patternUnits="userSpaceOnUse">
        <rect width="12" height="12" fill="#4BA3C7" />
        <circle cx="6" cy="6" r="2.7" fill="#1B4D6E" />
      </pattern>
      <pattern id="dotsPink" width="11" height="11" patternUnits="userSpaceOnUse">
        <rect width="11" height="11" fill="#F294A5" />
        <circle cx="5.5" cy="5.5" r="2.4" fill="#B83B5E" />
      </pattern>
      <pattern id="dotsCream" width="14" height="14" patternUnits="userSpaceOnUse">
        <rect width="14" height="14" fill="#F6E5BE" />
        <circle cx="7" cy="7" r="2.2" fill="#E39D6B" />
      </pattern>
      <pattern id="dotsRoyal" width="10" height="10" patternUnits="userSpaceOnUse">
        <rect width="10" height="10" fill="#2B74B8" />
        <circle cx="5" cy="5" r="2.2" fill="#0F2D4A" />
      </pattern>
      <pattern id="dotsOrange" width="10" height="10" patternUnits="userSpaceOnUse">
        <rect width="10" height="10" fill="#D94E28" />
        <circle cx="5" cy="5" r="2.2" fill="#6E1D09" />
      </pattern>
      <pattern id="stripesGold" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
        <rect width="14" height="14" fill="#FAD28C" />
        <rect width="6" height="14" fill="#E89B48" />
      </pattern>
      <radialGradient id="domeGrad" cx="35%" cy="28%" r="70%">
        <stop offset="0%" stop-color="#88E0EF" stop-opacity="0.78" />
        <stop offset="55%" stop-color="#3A316B" stop-opacity="0.92" />
        <stop offset="100%" stop-color="#1E183D" stop-opacity="0.98" />
      </radialGradient>
      <marker id="inkArrow" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="8" markerHeight="8" orient="auto">
        <path d="M 0 1 L 12 6 L 0 11 L 3 6 z" fill="#14110F" />
      </marker>
      <style>
        .comic-title { font-family: 'Impact', 'Arial Black', sans-serif; letter-spacing: 0.03em; }
        .comic-sans { font-family: 'Trebuchet MS', 'Segoe UI', sans-serif; font-weight: 800; }
        .comic-mono { font-family: 'Consolas', 'Courier New', monospace; font-weight: 700; }
        .pop-btn { cursor: pointer; }
        .pop-btn rect.btn-face { transition: filter 0.15s ease, stroke-width 0.15s ease; }
        .pop-btn:hover rect.btn-face { filter: brightness(1.1); stroke-width: 3.2; }
        .pop-step { transition: opacity 0.35s ease; cursor: pointer; }
        .pop-step.dimmed { opacity: 0.22; }
        .pop-step.active-step rect.pill-bg { fill: #FFE600 !important; stroke: #D9381E !important; stroke-width: 3.5 !important; }
        .pop-step.active-step polygon.burst-bg { fill: #FFE600 !important; stroke: #D9381E !important; stroke-width: 4 !important; }
        .pop-step.active-step text.burst-text { fill: #D9381E !important; }
        .pop-step.active-step line, .pop-step.active-step path.flow-line { stroke: #D9381E !important; stroke-width: 4.5 !important; }
        @keyframes dashComic { to { stroke-dashoffset: -28; } }
        .comic-dash { stroke-dasharray: 9 5; animation: dashComic 0.9s linear infinite; }
      </style>
    </defs>
    <rect width="1400" height="980" fill="url(#dotsCream)" />
    <polygon points="0,0 245,0 245,235 0,255" fill="url(#dotsPink)" stroke="#14110F" stroke-width="4" />
    <polygon points="0,255 245,235 245,625 0,655" fill="url(#dotsBlue)" stroke="#14110F" stroke-width="4" />
    <polygon points="0,655 245,625 245,865 0,865" fill="url(#dotsPink)" stroke="#14110F" stroke-width="4" />
    <polygon points="940,0 1120,0 820,420 740,420" fill="#6EC4DB" opacity="0.55" />
    <polygon points="1180,0 1320,0 950,420 880,420" fill="#6EC4DB" opacity="0.45" />
    <polygon points="1220,20 1400,20 1400,320 1220,320" fill="url(#dotsBlue)" stroke="#14110F" stroke-width="3" />
    <path d="M 790 420 Q 810 310 920 320 Q 980 250 1090 295 Q 1195 275 1235 375 Q 1340 390 1330 490 L 790 490 Z" fill="#F8E7C1" stroke="#14110F" stroke-width="3.5" />
    <rect x="245" y="795" width="1155" height="70" fill="#F29F3D" stroke="#14110F" stroke-width="3.5" />
    <g transform="translate(22, 14)">
      <rect x="4" y="4" width="1352" height="48" rx="10" fill="#14110F" />
      <rect x="0" y="0" width="1352" height="48" rx="10" fill="#FFE600" stroke="#14110F" stroke-width="3.5" />
      <text x="18" y="31" class="comic-title" font-size="22" fill="#14110F">💥 FLUJO DE SESIÓN EN MEMORIA (COGNITO + PKCE)</text>
      <g class="pop-btn" transform="translate(790, 7)" onclick="window.togglePopAuto()">
        <rect x="3" y="3" width="145" height="34" rx="17" fill="#14110F" pointer-events="none" />
        <rect id="btn-pop-auto-bg" class="btn-face" width="145" height="34" rx="17" fill="#4BA3C7" stroke="#14110F" stroke-width="2.5" pointer-events="all" />
        <text id="btn-pop-auto-txt" x="72" y="22" class="comic-sans" font-size="13" fill="#14110F" text-anchor="middle" pointer-events="none">⏸ Pausar Auto</text>
      </g>
      <g class="pop-btn" transform="translate(948, 7)" onclick="window.nextPopStep()">
        <rect x="3" y="3" width="140" height="34" rx="17" fill="#14110F" pointer-events="none" />
        <rect class="btn-face" width="140" height="34" rx="17" fill="#FFFFFF" stroke="#14110F" stroke-width="2.5" pointer-events="all" />
        <text x="70" y="22" class="comic-sans" font-size="13" fill="#14110F" text-anchor="middle" pointer-events="none">Siguiente ➔</text>
      </g>
      <g class="pop-btn" transform="translate(1100, 7)" onclick="window.resetPopFlow()">
        <rect x="3" y="3" width="110" height="34" rx="17" fill="#14110F" pointer-events="none" />
        <rect class="btn-face" width="110" height="34" rx="17" fill="#F294A5" stroke="#14110F" stroke-width="2.5" pointer-events="all" />
        <text x="55" y="22" class="comic-sans" font-size="13" fill="#14110F" text-anchor="middle" pointer-events="none">↺ Reiniciar</text>
      </g>
      <g class="pop-btn" transform="translate(1222, 7)" onclick="window.togglePopExpand()">
        <rect x="3" y="3" width="116" height="34" rx="17" fill="#14110F" pointer-events="none" />
        <rect id="btn-pop-exp-bg" class="btn-face" width="116" height="34" rx="17" fill="#D94E28" stroke="#14110F" stroke-width="2.5" pointer-events="all" />
        <text id="btn-pop-exp-txt" x="58" y="22" class="comic-sans" font-size="13" fill="#FFFFFF" text-anchor="middle" pointer-events="none">⛶ Ampliar</text>
      </g>
    </g>
    <g transform="translate(15, 225)">
      <polygon points="0,30 22,12 35,28 62,5 68,28 96,22 82,45 102,62 76,68 82,92 55,80 38,98 28,76 4,82 16,58" fill="#FFE600" stroke="#14110F" stroke-width="3" />
      <text x="48" y="57" class="comic-title" font-size="22" fill="#D9381E" stroke="#14110F" stroke-width="1" text-anchor="middle" transform="rotate(-14 48 57)">POP!</text>
    </g>
    <g transform="translate(115, 415)">
      <polygon points="0,35 72,22 68,5 128,36 78,76 74,56 8,68" fill="#E86F2C" stroke="#14110F" stroke-width="3.5" />
    </g>
    <line x1="68" y1="145" x2="68" y2="795" stroke="#14110F" stroke-width="4" />
    <!-- PERSONAJE GORILA CREATIVO POP ART -->
    <g transform="translate(10, 470)">
      <!-- Cúpula de cristal creativa -->
      <path d="M 38 112 C 32 45 78 12 128 24 C 175 35 196 82 182 128 Z" fill="url(#domeGrad)" stroke="#14110F" stroke-width="3.5" />
      <path d="M 52 72 C 56 42 84 26 112 30" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" opacity="0.7" />
      <ellipse cx="145" cy="48" rx="14" ry="8" transform="rotate(28 145 48)" fill="#FFFFFF" opacity="0.55" />
      <!-- Elementos dentro de la cúpula: ondas, clave de sol, corchea, paleta y pincel -->
      <path d="M 46 98 Q 66 80 86 98 T 126 98" fill="none" stroke="#FFE600" stroke-width="2.5" />
      <path d="M 46 105 Q 66 87 86 105 T 126 105" fill="none" stroke="#FFE600" stroke-width="2" opacity="0.8" />
      <text x="76" y="78" font-family="Georgia, serif" font-size="34" font-weight="bold" fill="#FFE600" stroke="#14110F" stroke-width="0.8">𝄞</text>
      <text x="108" y="62" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#FFE600">♫</text>
      <circle cx="98" cy="48" r="2.2" fill="#FFFFFF" />
      <circle cx="62" cy="58" r="2" fill="#FFE600" />
      <circle cx="155" cy="88" r="2.2" fill="#FFFFFF" />
      <!-- Paleta de pintor -->
      <ellipse cx="132" cy="86" rx="22" ry="14" transform="rotate(-12 132 86)" fill="#F3C677" stroke="#14110F" stroke-width="2" />
      <circle cx="122" cy="83" r="3.2" fill="#D9381E" />
      <circle cx="131" cy="79" r="3.2" fill="#4BA3C7" />
      <circle cx="141" cy="82" r="3.2" fill="#39FF14" />
      <circle cx="128" cy="91" r="3.2" fill="#FFE600" />
      <!-- Pincel atravesando -->
      <path d="M 142 98 L 166 64 L 173 69 L 149 103 Z" fill="#D97B29" stroke="#14110F" stroke-width="2" />
      <path d="M 136 108 C 138 98 145 96 150 102 C 147 110 140 113 136 108 Z" fill="#FFE600" stroke="#14110F" stroke-width="2" />
      <!-- Hombros / Armadura dorada izquierda -->
      <path d="M 10 250 C 16 215 48 202 88 214 L 122 252 L 10 282 Z" fill="#D98A2B" stroke="#14110F" stroke-width="3.5" />
      <path d="M 14 264 C 24 234 52 222 86 232" fill="none" stroke="#FFE600" stroke-width="3.5" />
      <path d="M 18 278 C 30 248 56 238 88 246" fill="none" stroke="#14110F" stroke-width="3" />
      <!-- Melena / Pelaje gris azulado oscuro del gorila -->
      <path d="M 36 122 C 20 130 16 148 28 158 C 12 172 16 196 34 202 C 24 220 38 242 62 240 C 78 258 115 264 142 252 C 175 248 202 224 206 192 C 218 176 214 148 196 138 C 194 114 168 100 142 108 C 124 98 94 102 82 114 C 62 106 42 112 36 122 Z" fill="#2E3F4F" stroke="#14110F" stroke-width="3.5" />
      <!-- Mechones internos de pelaje -->
      <path d="M 42 135 Q 64 122 88 128 M 126 122 Q 152 112 176 124 M 44 196 L 58 214 M 62 204 L 74 224 M 184 188 L 196 206" fill="none" stroke="#6B8299" stroke-width="2.5" stroke-linecap="round" />
      <!-- Oreja izquierda redonda -->
      <circle cx="44" cy="176" r="18" fill="#E3B98F" stroke="#14110F" stroke-width="3.2" />
      <path d="M 40 170 C 36 176 40 184 47 182" fill="none" stroke="#14110F" stroke-width="2.5" />
      <!-- Rostro / Frente beige claro -->
      <path d="M 68 138 C 72 122 98 118 114 130 C 130 116 162 118 172 136 C 184 152 182 178 168 192 L 74 192 C 62 178 62 154 68 138 Z" fill="#EED0B0" stroke="#14110F" stroke-width="3" />
      <!-- Cejas marcadas -->
      <path d="M 74 142 Q 94 132 112 142 M 124 140 Q 146 128 166 138" fill="none" stroke="#14110F" stroke-width="4" stroke-linecap="round" />
      <!-- Ojos expresivos -->
      <ellipse cx="96" cy="156" rx="13" ry="10" fill="#FFFFFF" stroke="#14110F" stroke-width="2.5" />
      <circle cx="99" cy="156" r="6" fill="#7A4419" stroke="#14110F" stroke-width="1.5" />
      <circle cx="101" cy="154" r="2.2" fill="#FFFFFF" />
      <ellipse cx="146" cy="152" rx="12" ry="9.5" fill="#FFFFFF" stroke="#14110F" stroke-width="2.5" />
      <circle cx="149" cy="152" r="5.5" fill="#7A4419" stroke="#14110F" stroke-width="1.5" />
      <circle cx="151" cy="150" r="2" fill="#FFFFFF" />
      <!-- Gafas redondas doradas / bronce -->
      <line x1="56" y1="168" x2="74" y2="161" stroke="#D98A2B" stroke-width="5" />
      <line x1="56" y1="168" x2="74" y2="161" stroke="#14110F" stroke-width="1.8" />
      <circle cx="96" cy="157" r="23" fill="none" stroke="#14110F" stroke-width="7" />
      <circle cx="96" cy="157" r="23" fill="none" stroke="#D98A2B" stroke-width="4" />
      <circle cx="147" cy="152" r="21" fill="none" stroke="#14110F" stroke-width="7" />
      <circle cx="147" cy="152" r="21" fill="none" stroke="#D98A2B" stroke-width="4" />
      <path d="M 118 153 Q 123 148 127 152" fill="none" stroke="#14110F" stroke-width="5.5" />
      <path d="M 118 153 Q 123 148 127 152" fill="none" stroke="#D98A2B" stroke-width="3" />
      <!-- Hocico / Boca sonriente -->
      <path d="M 78 202 C 74 182 104 174 128 176 C 154 174 184 180 184 202 C 184 228 156 244 128 244 C 98 244 76 226 78 202 Z" fill="#E3B98F" stroke="#14110F" stroke-width="3.2" />
      <!-- Fosas nasales -->
      <path d="M 114 184 Q 121 178 127 184 Q 133 178 140 184" fill="none" stroke="#14110F" stroke-width="3" stroke-linecap="round" />
      <ellipse cx="120" cy="187" rx="4.5" ry="3" fill="#14110F" />
      <ellipse cx="135" cy="187" rx="4.5" ry="3" fill="#14110F" />
      <!-- Sonrisa cálida -->
      <path d="M 96 208 Q 132 222 168 202" fill="none" stroke="#14110F" stroke-width="3.5" stroke-linecap="round" />
      <path d="M 93 205 L 98 212 M 166 199 L 170 205" stroke="#14110F" stroke-width="2.5" stroke-linecap="round" />
      <!-- Mano pensativa apoyada en el mentón -->
      <path d="M 136 254 C 142 238 164 234 184 242 C 198 248 202 264 190 276 L 132 282 Z" fill="#E3B98F" stroke="#14110F" stroke-width="3.2" />
      <path d="M 152 246 Q 168 246 180 254 M 148 258 Q 166 258 178 266" fill="none" stroke="#14110F" stroke-width="2.5" stroke-linecap="round" />
    </g>
    <g transform="translate(105, 818)">
      <text x="4" y="4" class="comic-title" font-size="38" fill="#14110F">USUARIO</text>
      <text x="0" y="0" class="comic-title" font-size="38" fill="#FFE600" stroke="#14110F" stroke-width="2.5">USUARIO</text>
    </g>
    <rect x="348" y="138" width="24" height="657" fill="url(#dotsBlue)" stroke="#14110F" stroke-width="3.5" />
    <rect x="638" y="138" width="24" height="657" fill="url(#dotsPink)" stroke="#14110F" stroke-width="3.5" />
    <rect x="878" y="138" width="24" height="657" fill="url(#dotsRoyal)" stroke="#14110F" stroke-width="3.5" />
    <rect x="1078" y="138" width="24" height="657" fill="url(#dotsOrange)" stroke="#14110F" stroke-width="3.5" />
    <rect x="1273" y="138" width="24" height="657" fill="url(#stripesGold)" stroke="#14110F" stroke-width="3.5" />
    <g transform="translate(26, 76)">
      <rect x="5" y="5" width="84" height="72" fill="#14110F" />
      <rect width="84" height="72" fill="#FDE0C8" stroke="#14110F" stroke-width="3.5" />
      <circle cx="42" cy="25" r="13" fill="#2E3F4F" stroke="#14110F" stroke-width="2.5" />
      <circle cx="38" cy="25" r="4.5" fill="none" stroke="#FFE600" stroke-width="1.8" />
      <circle cx="46" cy="25" r="4.5" fill="none" stroke="#FFE600" stroke-width="1.8" />
      <path d="M 24 48 Q 42 38 60 48" fill="#D98A2B" stroke="#14110F" stroke-width="2.5" />
      <rect x="6" y="48" width="72" height="20" fill="#F6E5BE" stroke="#14110F" stroke-width="2" />
      <text x="42" y="62" class="comic-sans" font-size="12" fill="#14110F" text-anchor="middle">Usuario</text>
    </g>
    <g transform="translate(265, 80)">
      <rect x="6" y="6" width="190" height="58" fill="#14110F" />
      <rect width="190" height="58" fill="#5CB2D6" stroke="#14110F" stroke-width="3.5" />
      <text x="95" y="34" class="comic-sans" font-size="15" fill="#14110F" text-anchor="middle">AETHER en el navegador</text>
    </g>
    <g transform="translate(555, 80)">
      <rect x="6" y="6" width="190" height="58" fill="#14110F" />
      <rect width="190" height="58" fill="#F294A5" stroke="#14110F" stroke-width="3.5" />
      <text x="95" y="34" class="comic-sans" font-size="15" fill="#14110F" text-anchor="middle">Memoria de la pestaña</text>
    </g>
    <g transform="translate(815, 80)">
      <rect x="6" y="6" width="150" height="58" fill="#14110F" />
      <rect width="150" height="58" fill="#2B74B8" stroke="#14110F" stroke-width="3.5" />
      <text x="75" y="34" class="comic-sans" font-size="16" fill="#14110F" text-anchor="middle">Cognito</text>
    </g>
    <g transform="translate(1010, 80)">
      <rect x="6" y="6" width="160" height="58" fill="#14110F" />
      <rect width="160" height="58" fill="#D94E28" stroke="#14110F" stroke-width="3.5" />
      <text x="80" y="34" class="comic-sans" font-size="15" fill="#14110F" text-anchor="middle">API Gateway</text>
    </g>
    <g transform="translate(1210, 80)">
      <rect x="6" y="6" width="150" height="58" fill="#14110F" />
      <rect width="150" height="58" fill="#FAD28C" stroke="#14110F" stroke-width="3.5" />
      <text x="75" y="34" class="comic-sans" font-size="16" fill="#14110F" text-anchor="middle">Lambda</text>
    </g>
    <g id="pop-step-0" class="pop-step" onclick="window.selectPopStep(0)">
      <rect class="pill-bg" x="115" y="152" width="190" height="28" rx="4" fill="#FFFDF5" stroke="#14110F" stroke-width="2.5" />
      <text x="210" y="171" class="comic-sans" font-size="13" fill="#14110F" text-anchor="middle">Inicia sesión con Google</text>
      <line x1="70" y1="190" x2="342" y2="190" stroke="#14110F" stroke-width="4" marker-end="url(#inkArrow)" />
    </g>
    <g id="pop-step-1" class="pop-step" onclick="window.selectPopStep(1)">
      <rect class="pill-bg" x="515" y="202" width="225" height="28" rx="4" fill="#FFFDF5" stroke="#14110F" stroke-width="2.5" />
      <text x="627" y="221" class="comic-sans" font-size="13" fill="#14110F" text-anchor="middle">Authorization Code + PKCE</text>
      <line x1="372" y1="240" x2="872" y2="240" stroke="#14110F" stroke-width="4" marker-end="url(#inkArrow)" />
    </g>
    <g id="pop-step-2" class="pop-step" onclick="window.selectPopStep(2)">
      <rect class="pill-bg" x="485" y="254" width="285" height="28" rx="4" fill="#FFFDF5" stroke="#14110F" stroke-width="2.5" />
      <text x="627" y="273" class="comic-sans" font-size="13" fill="#14110F" text-anchor="middle">ID token, access token y refresh token</text>
      <line class="comic-dash" x1="878" y1="292" x2="378" y2="292" stroke="#14110F" stroke-width="4" marker-end="url(#inkArrow)" />
    </g>
    <g id="pop-step-3" class="pop-step" onclick="window.selectPopStep(3)">
      <rect class="pill-bg" x="392" y="304" width="225" height="26" rx="4" fill="#FFFDF5" stroke="#14110F" stroke-width="2.5" />
      <text x="504" y="322" class="comic-sans" font-size="12.5" fill="#14110F" text-anchor="middle">Conserva tokens solo en memoria</text>
      <line x1="372" y1="338" x2="632" y2="338" stroke="#14110F" stroke-width="4" marker-end="url(#inkArrow)" />
    </g>
    <g id="pop-step-4" class="pop-step" onclick="window.selectPopStep(4)">
      <rect x="330" y="355" width="352" height="36" fill="#14110F" />
      <rect class="pill-bg" x="325" y="350" width="352" height="36" fill="#F9E79F" stroke="#14110F" stroke-width="3" />
      <text x="501" y="373" class="comic-sans" font-size="14" fill="#14110F" text-anchor="middle">No los guarda en localStorage</text>
    </g>
    <g id="pop-step-5" class="pop-step" onclick="window.selectPopStep(5)">
      <rect class="pill-bg" x="470" y="400" width="315" height="28" rx="4" fill="#FFFDF5" stroke="#14110F" stroke-width="2.5" />
      <text x="627" y="419" class="comic-sans" font-size="13" fill="#14110F" text-anchor="middle">Renueva tokens al acercarse el vencimiento</text>
      <line x1="372" y1="438" x2="872" y2="438" stroke="#14110F" stroke-width="4" marker-end="url(#inkArrow)" />
    </g>
    <g id="pop-step-6" class="pop-step" onclick="window.selectPopStep(6)">
      <rect class="pill-bg" x="520" y="452" width="215" height="28" rx="4" fill="#FFFDF5" stroke="#14110F" stroke-width="2.5" />
      <text x="627" y="471" class="comic-sans" font-size="13" fill="#14110F" text-anchor="middle">Nuevos ID y access tokens</text>
      <line class="comic-dash" x1="878" y1="490" x2="378" y2="490" stroke="#14110F" stroke-width="4" marker-end="url(#inkArrow)" />
    </g>
    <g id="pop-step-7" class="pop-step" onclick="window.selectPopStep(7)">
      <rect class="pill-bg" x="615" y="502" width="220" height="28" rx="4" fill="#FFFDF5" stroke="#14110F" stroke-width="2.5" />
      <text x="725" y="521" class="comic-sans" font-size="13" fill="#14110F" text-anchor="middle">Petición con token Cognito</text>
      <line x1="372" y1="538" x2="1072" y2="538" stroke="#14110F" stroke-width="4" marker-end="url(#inkArrow)" />
    </g>
    <g id="pop-step-8" class="pop-step" onclick="window.selectPopStep(8)">
      <rect class="pill-bg" x="1095" y="544" width="95" height="26" rx="4" fill="#FFFDF5" stroke="#14110F" stroke-width="2.5" />
      <text x="1142" y="562" class="comic-sans" font-size="12.5" fill="#14110F" text-anchor="middle">Valida JWT</text>
      <path class="flow-line" d="M 1102 574 C 1148 574 1148 602 1108 602" fill="none" stroke="#14110F" stroke-width="4" marker-end="url(#inkArrow)" />
      <rect class="pill-bg" x="1125" y="608" width="135" height="26" rx="4" fill="#FFFDF5" stroke="#14110F" stroke-width="2.5" />
      <text x="1192" y="626" class="comic-sans" font-size="12.5" fill="#14110F" text-anchor="middle">Si el JWT es válido</text>
      <line x1="1102" y1="642" x2="1267" y2="642" stroke="#14110F" stroke-width="4" marker-end="url(#inkArrow)" />
    </g>
    <g id="pop-step-9" class="pop-step" onclick="window.selectPopStep(9)">
      <rect class="pill-bg" x="725" y="646" width="200" height="28" rx="4" fill="#FFFDF5" stroke="#14110F" stroke-width="2.5" />
      <text x="825" y="665" class="comic-sans" font-size="13" fill="#14110F" text-anchor="middle">Resultado de la operación</text>
      <line class="comic-dash" x1="1273" y1="682" x2="378" y2="682" stroke="#14110F" stroke-width="4" marker-end="url(#inkArrow)" />
    </g>
    <g id="pop-step-10" class="pop-step" onclick="window.selectPopStep(10)">
      <polygon class="burst-bg" points="250,715 310,692 355,710 415,672 455,705 520,682 555,708 640,692 670,715 755,708 720,738 765,764 680,766 650,794 565,772 510,796 455,772 385,796 350,770 270,784 298,752 240,742" fill="#F9E79F" stroke="#14110F" stroke-width="3.5" />
      <text class="comic-sans burst-text" x="505" y="747" font-size="13.5" fill="#14110F" text-anchor="middle">Recargar, cerrar la pestaña o cerrar el navegador elimina los tokens de memoria</text>
      <rect class="pill-bg" x="92" y="762" width="248" height="26" rx="4" fill="#FFFDF5" stroke="#14110F" stroke-width="2.5" />
      <text x="216" y="780" class="comic-sans" font-size="12" fill="#14110F" text-anchor="middle">La app requiere autenticación de nuevo</text>
      <line class="comic-dash" x1="348" y1="794" x2="76" y2="794" stroke="#14110F" stroke-width="4" marker-end="url(#inkArrow)" />
    </g>
    <g transform="translate(26, 795)">
      <rect x="5" y="5" width="76" height="66" fill="#14110F" />
      <rect width="76" height="66" fill="#FAD28C" stroke="#14110F" stroke-width="3.5" />
      <circle cx="38" cy="18" r="7" fill="none" stroke="#14110F" stroke-width="2.5" />
      <line x1="38" y1="25" x2="38" y2="39" stroke="#14110F" stroke-width="2.5" />
      <line x1="26" y1="31" x2="50" y2="31" stroke="#14110F" stroke-width="2.5" />
      <line x1="38" y1="39" x2="30" y2="48" stroke="#14110F" stroke-width="2.5" />
      <line x1="38" y1="39" x2="46" y2="48" stroke="#14110F" stroke-width="2.5" />
      <text x="38" y="61" class="comic-sans" font-size="11" fill="#14110F" text-anchor="middle">Usuario</text>
    </g>
    <g transform="translate(265, 795)">
      <rect x="6" y="6" width="190" height="58" fill="#14110F" />
      <rect width="190" height="58" fill="#5CB2D6" stroke="#14110F" stroke-width="3.5" />
      <text x="95" y="34" class="comic-sans" font-size="15" fill="#14110F" text-anchor="middle">AETHER en el navegador</text>
    </g>
    <g transform="translate(555, 795)">
      <rect x="6" y="6" width="190" height="58" fill="#14110F" />
      <rect width="190" height="58" fill="#F294A5" stroke="#14110F" stroke-width="3.5" />
      <text x="95" y="34" class="comic-sans" font-size="15" fill="#14110F" text-anchor="middle">Memoria de la pestaña</text>
    </g>
    <g transform="translate(815, 795)">
      <rect x="6" y="6" width="150" height="58" fill="#14110F" />
      <rect width="150" height="58" fill="#2B74B8" stroke="#14110F" stroke-width="3.5" />
      <text x="75" y="34" class="comic-sans" font-size="16" fill="#14110F" text-anchor="middle">Cognito</text>
    </g>
    <g transform="translate(1010, 795)">
      <rect x="6" y="6" width="160" height="58" fill="#14110F" />
      <rect width="160" height="58" fill="#D94E28" stroke="#14110F" stroke-width="3.5" />
      <text x="80" y="34" class="comic-sans" font-size="15" fill="#14110F" text-anchor="middle">API Gateway</text>
    </g>
    <g transform="translate(1210, 795)">
      <rect x="6" y="6" width="150" height="58" fill="#14110F" />
      <rect width="150" height="58" fill="#FAD28C" stroke="#14110F" stroke-width="3.5" />
      <text x="75" y="34" class="comic-sans" font-size="16" fill="#14110F" text-anchor="middle">Lambda</text>
    </g>
    <g transform="translate(22, 875)">
      <rect x="5" y="5" width="1352" height="86" rx="12" fill="#14110F" />
      <rect width="1352" height="86" rx="12" fill="#FFFDF5" stroke="#14110F" stroke-width="3.5" />
      <rect x="16" y="12" width="130" height="24" rx="12" fill="#D9381E" stroke="#14110F" stroke-width="2" />
      <text id="popStepCounter" x="81" y="28" class="comic-sans" font-size="12" fill="#FFFFFF" text-anchor="middle">PASO 1 DE 11</text>
      <text id="popNarTitle" x="162" y="29" class="comic-title" font-size="19" fill="#14110F">INICIO DE SESIÓN FEDERADO CON GOOGLE OAUTH</text>
      <text id="popNarDesc1" x="18" y="54" class="comic-sans" font-size="13.5" fill="#1E293B">El autor pulsa el acceso a La Bóveda en AETHER y se redirige al proveedor de identidad externo (Google) sin gestionar contraseñas propias.</text>
      <text id="popNarDesc2" x="18" y="74" class="comic-mono" font-size="12" fill="#B83B5E">Haz clic en cualquier flecha del cómic para saltar a ese momento o deja correr la reproducción automática.</text>
    </g>
  </svg>
</div>
<script is:inline>
(function() {
  var popNarratives = [
    ["INICIO DE SESIÓN FEDERADO CON GOOGLE OAUTH", "El autor pulsa el acceso a La Bóveda en AETHER y se redirige al proveedor externo de Google sin que AETHER gestione contraseñas.", "Paso 1/11 · Inicio de autenticación federada."],
    ["INTERCAMBIO AUTHORIZATION CODE + PKCE", "AETHER envía el código de autorización junto con el verificador criptográfico (Code Verifier) hacia Amazon Cognito.", "Paso 2/11 · Seguridad PKCE contra interceptación de código en SPA."],
    ["EMISIÓN DE TOKENS JWT POR COGNITO", "Cognito valida la identidad federada y devuelve al navegador el ID token, access token y refresh token.", "Paso 3/11 · Credenciales firmadas criptográficamente."],
    ["AISLAMIENTO EN MEMORIA VOLÁTIL DE LA PESTAÑA", "AETHER almacena los tokens exclusivamente en variables en RAM dentro del contexto de ejecución de la pestaña activa.", "Paso 4/11 · Aislamiento estricto por pestaña."],
    ["POLÍTICA ZERO-LOCALSTORAGE (PROTECCIÓN XSS)", "Los tokens jamás se escriben en localStorage ni sessionStorage, eliminando la superficie de robo persistente mediante scripts maliciosos.", "Paso 5/11 · Decisión de arquitectura de seguridad."],
    ["RENOVACIÓN SILENCIOSA ANTES DEL VENCIMIENTO", "Cuando el token está próximo a caducar, AETHER solicita automáticamente una renovación a Cognito usando el refresh token en memoria.", "Paso 6/11 · Continuidad de sesión transparente para el escritor."],
    ["RECEPCIÓN DE NUEVOS ID Y ACCESS TOKENS", "Cognito emite credenciales frescas sin interrumpir el flujo de escritura ni obligar al autor a volver a iniciar sesión mientras trabaja.", "Paso 7/11 · Actualización en RAM."],
    ["PETICIÓN AUTENTICADA CON BEARER JWT", "Al sincronizar obras con La Bóveda, el cliente envía el ID token de Cognito en la cabecera Authorization: Bearer hacia API Gateway.", "Paso 8/11 · Llamada segura a la API serverless."],
    ["VALIDACIÓN EN EL BORDE (JWT AUTHORIZER)", "API Gateway verifica la firma, audiencia y expiración del JWT antes de invocar AWS Lambda; si es válido, autoriza la ejecución.", "Paso 9/11 · Zero coste de cómputo Lambda ante tokens inválidos."],
    ["EJECUCIÓN Y RESPUESTA DE LA OPERACIÓN", "Lambda procesa la operación autorizada en la bóveda (eu-south-2) y devuelve el resultado seguro al cliente en el navegador.", "Paso 10/11 · Sincronización completada."],
    ["PURGA AUTOMÁTICA AL CERRAR O RECARGAR (F5)", "Al recargar la página o cerrar la pestaña, la RAM se libera por completo: los tokens desaparecen y la app exige autenticarse de nuevo.", "Paso 11/11 · Efimeridad garantizada al finalizar la sesión."]
  ];
  var currentPopIdx = 0;
  var popAutoPlaying = true;
  var popTimer = null;
  window.selectPopStep = function(idx) {
    currentPopIdx = idx;
    for (var i = 0; i < 11; i++) {
      var el = document.getElementById('pop-step-' + i);
      if (!el) continue;
      el.classList.remove('active-step', 'dimmed');
      if (i === idx) {
        el.classList.add('active-step');
      } else if (i > idx) {
        el.classList.add('dimmed');
      }
    }
    var info = popNarratives[idx];
    if (info) {
      document.getElementById('popStepCounter').textContent = 'PASO ' + (idx + 1) + ' DE 11';
      document.getElementById('popNarTitle').textContent = info[0];
      document.getElementById('popNarDesc1').textContent = info[1];
      document.getElementById('popNarDesc2').textContent = info[2];
    }
  };
  window.nextPopStep = function() {
    var next = (currentPopIdx + 1) % 11;
    window.selectPopStep(next);
  };
  window.resetPopFlow = function() {
    window.selectPopStep(0);
  };
  function startPopInterval() {
    if (popTimer) clearInterval(popTimer);
    popTimer = setInterval(function() {
      if (popAutoPlaying) {
        window.nextPopStep();
      }
    }, 2200);
  }
  window.togglePopAuto = function() {
    popAutoPlaying = !popAutoPlaying;
    var txt = document.getElementById('btn-pop-auto-txt');
    var bg = document.getElementById('btn-pop-auto-bg');
    if (popAutoPlaying) {
      if (txt) txt.textContent = '⏸ Pausar Auto';
      if (bg) bg.setAttribute('fill', '#4BA3C7');
      startPopInterval();
    } else {
      if (txt) txt.textContent = '▶ Reanudar';
      if (bg) bg.setAttribute('fill', '#FFE600');
      if (popTimer) clearInterval(popTimer);
    }
  };
  window.isPopExpanded = false;
  window.togglePopExpand = function() {
    var wrap = document.getElementById('aetherPopArtWrapper');
    var svg = document.getElementById('aetherPopArtSvg');
    var txt = document.getElementById('btn-pop-exp-txt');
    var bg = document.getElementById('btn-pop-exp-bg');
    if (!wrap || !svg) return;
    window.isPopExpanded = !window.isPopExpanded;
    if (window.isPopExpanded) {
      wrap.style.position = 'fixed';
      wrap.style.inset = '0';
      wrap.style.zIndex = '99999';
      wrap.style.width = '100vw';
      wrap.style.margin = '0';
      wrap.style.transform = 'none';
      wrap.style.padding = '20px';
      wrap.style.background = 'rgba(20, 17, 15, 0.94)';
      wrap.style.backdropFilter = 'blur(8px)';
      wrap.style.display = 'flex';
      wrap.style.alignItems = 'center';
      wrap.style.justifyContent = 'center';
      wrap.style.borderRadius = '0';
      svg.style.width = '95vw';
      svg.style.maxWidth = '1550px';
      svg.style.maxHeight = '92vh';
      if (txt) txt.textContent = '✕ Cerrar';
      if (bg) bg.setAttribute('fill', '#14110F');
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
      if (txt) txt.textContent = '⛶ Ampliar';
      if (bg) bg.setAttribute('fill', '#D94E28');
    }
  };
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && window.isPopExpanded) {
      window.togglePopExpand();
    }
  });
  window.selectPopStep(0);
  startPopInterval();
})();
</script>

### El resultado en producción: menos rastro, reglas claras

El cambio ya está aplicado y Aether funciona hoy bajo este nuevo modelo de sesión. En la práctica, el comportamiento de la aplicación queda definido por cuatro reglas muy concretas:

- **Sesión volátil en memoria:** Aether mantiene los tokens exclusivamente en memoria mientras la pestaña está abierta; ya no los escribe ni los restaura desde `localStorage`, por lo que dejan de estar expuestos a simple vista en el almacenamiento del navegador al abrir las herramientas de desarrollo (`F12`).
- **Limpieza de rastros anteriores:** Al arrancar, la aplicación elimina de forma explícita las claves antiguas `aether_auth_tokens` y `aether_auth_author` que pudieran haber quedado almacenadas en el navegador de versiones previas.
- **Flujo PKCE intacto:** Sigue utilizando `sessionStorage` de manera estrictamente temporal para guardar `state` y `code_verifier`, dos valores efímeros de un solo uso con muy bajo riesgo que se limpian en cuanto finaliza el intercambio del _callback_ OAuth/PKCE.
- **Cierre limpio al salir:** Al recargar o cerrar la pestaña, la sesión local desaparece por completo y el usuario vuelve a iniciar sesión cuando quiera sincronizar (un proceso rápido si Google conserva su propia sesión activa en el navegador).

Conviene cerrar este punto con la misma honestidad con la que escribo mis ideas: mantener los tokens en memoria reduce drásticamente la persistencia en disco, aunque no protege frente a un script XSS activo mientras la pestaña permanece abierta.

En seguridad no existen soluciones absolutas, sino decisiones conscientes sobre qué riesgos estás dispuesto a asumir y cuáles prefieres cortar de raíz. Sacar los tokens de `localStorage` era el paso lógico y limpio para mantener Aether fiel a su arquitectura ligera. El siguiente frente en esta auditoría ya tiene nombre: endurecer la sincronización en la nube para que sea verdaderamente durable y atómica entre S3 y DynamoDB, pero eso llegará cuando se implemente y será historia para otro ensayo.

<p align="center"><img src="/images/posts/govalejo.webp" alt="Descripción de la imagen" width="70%"</p>
