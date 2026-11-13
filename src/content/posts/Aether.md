---
title: 'Aether — El Santuario Digital donde las Ideas se Cristalizan'
date: 2026-11-09
description: 'Presentación oficial de Aether, un editor y santuario digital introspectivo diseñado para estructurar el pensamiento y cristalizar ideas.'
image: '/images/posts/aether1.webp'
imagePosition: '50% 50%'
---

### Aether — Donde las Ideas se Cristalizan

Aether es una aplicación web y entorno de escritura diseñado como un santuario digital introspectivo. Su propósito fundamental es ofrecer un espacio minimalista, libre de distracciones y enfocado en la claridad mental, permitiendo a los usuarios reflexionar, organizar sus pensamientos y cristalizar ideas profundas.

**Acceso a la Aplicación:**
Puedes utilizar la versión oficial de Aether directamente desde tu navegador.

**Acceder a Aether**

Características Principales
Santuario Reflexivo: Una interfaz limpia y monocromática inspirada en la calma mineral, diseñada para la concentración pura.
Preguntas Introspectivas: Disparadores de pensamiento dinámicos para desbloquear el flujo creativo.
Persistencia Segura: Tus notas y reflexiones se sincronizan de forma privada y encriptada en la nube.
Experiencia Multiplataforma: Optimizado para escritorio, tablets y dispositivos móviles con soporte PWA.
Seguridad, Privacidad y Autenticación

**La seguridad y la privacidad de los datos de los usuarios son la máxima prioridad en Aether:**

Autenticación Oficial con Google: Integramos Google OAuth 2.0 mediante AWS Cognito para garantizar un inicio de sesión seguro, sin almacenar contraseñas en nuestros servidores.
Infraestructura Cloud Segura: Todo el procesamiento y almacenamiento se aloja en centros de datos de AWS en la Unión Europea (eu-south-2, España), cumpliendo estrictamente con el Reglamento General de Protección de Datos (RGPD / GDPR).
Cifrado de Extremo a Extremo: Toda la comunicación se realiza mediante HTTPS con TLS 1.3 y cifrado en reposo para los datos guardados.
Sin Venta de Datos: Aether no comparte, vende ni utiliza la información personal o los textos de los usuarios para publicidad ni entrenamiento de modelos de terceros.
Políticas Legales

Para consultar todos los detalles sobre el tratamiento de datos y tus derechos de privacidad:

📄 Política de Privacidad de Aether

✉️ Contacto de soporte y asistencia: uopechris@gmail.com

<div id="aetherAppMapWrapper" style="position: relative; width: min(92vw, 1320px); margin: 2.5rem 0 2.5rem 50%; transform: translateX(-50%); border-radius: 16px; transition: all 0.25s ease; z-index: 10;">
  <div id="aetherAppMapContainer" style="background: #08111c; border: 1px solid #294158; border-radius: 16px; padding: 24px; color: #edf5fb; font-family: Inter, ui-sans-serif, system-ui, sans-serif; box-shadow: 0 18px 48px rgba(0,0,0,0.45); overflow: hidden; box-sizing: border-box;">
    <style>
      #aetherAppMapContainer * { box-sizing: border-box; }
      #aetherAppMapContainer button { font: inherit; color: inherit; }
      #aetherAppMapContainer .shell { max-width: 1500px; margin: auto; padding: 0; }
      #aetherAppMapContainer .eyebrow { color: #65d9ec; font-size: .76rem; font-weight: 800; letter-spacing: .15em; text-transform: uppercase; }
      #aetherAppMapContainer .top { display: grid; grid-template-columns: 1fr auto; gap: 24px; align-items: end; margin-bottom: 24px; }
      #aetherAppMapContainer .top h2 { font-size: clamp(1.6rem, 2.8vw, 2.4rem); line-height: 1.08; letter-spacing: -.04em; margin: 8px 0 10px; color: #ffffff; }
      #aetherAppMapContainer .lead { color: #a8bbcb; max-width: 820px; margin: 0; font-size: .95rem; }
      #aetherAppMapContainer .stamp { border: 1px solid #31506a; border-radius: 14px; padding: 10px 14px; color: #d3e5f3; background: #101e2c; white-space: nowrap; font-size: .82rem; }
      #aetherAppMapContainer .toolbar { display: flex; flex-wrap: wrap; gap: 8px; padding: 12px 0 16px; border-top: 1px solid #1e3246; }
      #aetherAppMapContainer .tab, #aetherAppMapContainer .control { border: 1px solid #294158; background: #122131; border-radius: 999px; padding: 8px 14px; cursor: pointer; transition: .18s; font-size: .85rem; }
      #aetherAppMapContainer .tab:hover, #aetherAppMapContainer .control:hover { border-color: #65d9ec; transform: translateY(-1px); }
      #aetherAppMapContainer .tab[aria-selected=true] { background: #173749; border-color: #65d9ec; color: #eaffff; box-shadow: 0 0 0 2px #65d9ec1a; }
      #aetherAppMapContainer .control { margin-left: auto; }
      #aetherAppMapContainer .control.secondary { margin-left: 0; }
      #aetherAppMapContainer .layout { display: grid; grid-template-columns: minmax(0,1fr) 310px; gap: 18px; align-items: start; }
      #aetherAppMapContainer .mapwrap, #aetherAppMapContainer .detail, #aetherAppMapContainer .legend, #aetherAppMapContainer .journey { border: 1px solid #25394d; border-radius: 18px; background: linear-gradient(160deg,#111f2e,#0c1723); }
      #aetherAppMapContainer .mapwrap { overflow: hidden; }
      #aetherAppMapContainer .maphead { display: flex; justify-content: space-between; gap: 12px; align-items: center; padding: 14px 18px; border-bottom: 1px solid #22364a; }
      #aetherAppMapContainer .maphead strong { font-size: .95rem; }
      #aetherAppMapContainer .maphead span { color: #a8bbcb; font-size: .8rem; }
      #aetherAppMapContainer .canvas { padding: 14px; overflow-x: auto; }
      #aetherAppMapContainer .flow { min-width: 820px; position: relative; padding: 4px 0 12px; }
      #aetherAppMapContainer .zone { border: 1px solid #345068; border-radius: 16px; background: #0c1926e8; margin: 0 0 14px; padding: 13px 14px 15px; position: relative; }
      #aetherAppMapContainer .zone.client { border-color: #2b8191; }
      #aetherAppMapContainer .zone.aws { border-color: #a9672c; background: linear-gradient(120deg,#171c29,#101a26); }
      #aetherAppMapContainer .zone.data { border-color: #395f86; }
      #aetherAppMapContainer .zonehead { display: flex; align-items: center; gap: 10px; margin: 0 0 12px; font-weight: 800; letter-spacing: .02em; font-size: .95rem; color: #ffffff; }
      #aetherAppMapContainer .zonehead .tag { margin-left: auto; font-size: .72rem; color: #a8bbcb; font-weight: 600; }
      #aetherAppMapContainer .row { display: flex; align-items: stretch; gap: 10px; min-height: 84px; }
      #aetherAppMapContainer .node { flex: 1; min-width: 115px; max-width: 240px; align-self: stretch; text-align: left; border: 1px solid #344e65; border-radius: 12px; padding: 10px 12px; background: linear-gradient(145deg,#172a3d,#112131); cursor: pointer; position: relative; transition: .18s; }
      #aetherAppMapContainer .node:hover, #aetherAppMapContainer .node.active { border-color: #65d9ec; transform: translateY(-2px); box-shadow: 0 0 0 2px #65d9ec25; }
      #aetherAppMapContainer .node .icon { display: block; font-size: 1.2rem; margin-bottom: 3px; }
      #aetherAppMapContainer .node b { display: block; font-size: .88rem; line-height: 1.22; color: #edf5fb; }
      #aetherAppMapContainer .node small { display: block; color: #a8bbcb; font-size: .73rem; line-height: 1.32; margin-top: 4px; }
      #aetherAppMapContainer .arrow { align-self: center; flex: 0 0 72px; text-align: center; color: #65d9ec; font-size: .7rem; line-height: 1.22; position: relative; padding-top: 18px; }
      #aetherAppMapContainer .arrow:before { content: ""; position: absolute; left: 4px; right: 12px; top: 8px; height: 2px; background: linear-gradient(90deg,#41778a,#65d9ec); }
      #aetherAppMapContainer .arrow:after { content: ""; position: absolute; right: 5px; top: 3px; width: 9px; height: 9px; border-top: 2px solid #65d9ec; border-right: 2px solid #65d9ec; transform: rotate(45deg); }
      #aetherAppMapContainer .arrow.purple { color: #b6a0ff; }
      #aetherAppMapContainer .arrow.purple:before { background: linear-gradient(90deg,#675c9a,#b6a0ff); }
      #aetherAppMapContainer .arrow.purple:after { border-color: #b6a0ff; }
      #aetherAppMapContainer .arrow.orange { color: #ffad57; }
      #aetherAppMapContainer .arrow.orange:before { background: linear-gradient(90deg,#8e603c,#ffad57); }
      #aetherAppMapContainer .arrow.orange:after { border-color: #ffad57; }
      #aetherAppMapContainer .arrow.green { color: #75dda5; }
      #aetherAppMapContainer .arrow.green:before { background: linear-gradient(90deg,#367957,#75dda5); }
      #aetherAppMapContainer .arrow.green:after { border-color: #75dda5; }
      #aetherAppMapContainer .vflow { margin: 11px auto 0; max-width: 740px; border-top: 1px dashed #40576d; padding-top: 11px; }
      #aetherAppMapContainer .branch { border-left: 2px dashed #4b7181; margin: 8px 0 0 24px; padding: 3px 0 3px 16px; color: #d1e0ea; font-size: .8rem; }
      #aetherAppMapContainer .branch span { color: #a8bbcb; }
      #aetherAppMapContainer .eventline { display: flex; align-items: center; justify-content: center; gap: 10px; color: #a8bbcb; font-size: .78rem; margin: 8px 0 0; }
      #aetherAppMapContainer .eventline:before, #aetherAppMapContainer .eventline:after { content: ""; height: 1px; background: #31485d; flex: 1; }
      #aetherAppMapContainer .detail { padding: 18px; position: sticky; top: 20px; }
      #aetherAppMapContainer .detail h3 { font-size: 1.1rem; margin: 5px 0 7px; color: #edf5fb; }
      #aetherAppMapContainer .detail p { color: #c5d4df; margin: 0 0 14px; font-size: .88rem; }
      #aetherAppMapContainer .detail .kind { color: #65d9ec; font-size: .7rem; text-transform: uppercase; letter-spacing: .13em; font-weight: 800; }
      #aetherAppMapContainer .fact { border-top: 1px solid #25394d; padding: 10px 0; }
      #aetherAppMapContainer .fact b { display: block; font-size: .75rem; color: #94cce0; margin-bottom: 3px; }
      #aetherAppMapContainer .fact span { font-size: .82rem; color: #d4e1e9; }
      #aetherAppMapContainer .hint { background: #101e2b; border: 1px dashed #3b586e; border-radius: 12px; padding: 10px 12px; font-size: .78rem; color: #b8cad7; margin-top: 10px; }
      #aetherAppMapContainer .legend { margin-top: 14px; padding: 12px 16px; display: flex; flex-wrap: wrap; gap: 10px 20px; color: #a8bbcb; font-size: .76rem; }
      #aetherAppMapContainer .key { display: inline-flex; align-items: center; gap: 7px; }
      #aetherAppMapContainer .dot { width: 9px; height: 9px; border-radius: 50%; display: inline-block; }
      #aetherAppMapContainer .journey { margin-top: 14px; padding: 16px; }
      #aetherAppMapContainer .journeyhead { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
      #aetherAppMapContainer .journey h3 { font-size: 1rem; margin: 0; color: #edf5fb; }
      #aetherAppMapContainer .journey p { color: #a8bbcb; margin: 4px 0 0; font-size: .82rem; }
      #aetherAppMapContainer .steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-top: 14px; }
      #aetherAppMapContainer .step { border: 1px solid #2b4055; border-radius: 10px; background: #0e1a27; padding: 10px; min-height: 82px; cursor: pointer; text-align: left; opacity: .55; transition: .2s; }
      #aetherAppMapContainer .step b { font-size: .78rem; display: block; color: #edf5fb; }
      #aetherAppMapContainer .step small { font-size: .7rem; color: #a8bbcb; }
      #aetherAppMapContainer .step.done { opacity: 1; border-color: #3f8a77; }
      #aetherAppMapContainer .step.current { opacity: 1; border-color: #65d9ec; box-shadow: 0 0 0 2px #65d9ec25; }
      #aetherAppMapContainer .progress { height: 5px; border-radius: 8px; background: #203448; margin-top: 12px; overflow: hidden; }
      #aetherAppMapContainer .progress i { height: 100%; width: 0; display: block; background: linear-gradient(90deg,#65d9ec,#b6a0ff); transition: width .35s; }
      #aetherAppMapContainer .foot { color: #8ea2b3; font-size: .75rem; margin: 14px 3px 0; display: flex; justify-content: space-between; gap: 16px; }
      #aetherAppMapContainer .only { display: none; }
      #aetherAppMapContainer .only.show { display: block; }
      #aetherAppMapContainer .node.selected { outline: 2px solid #65d9ec; outline-offset: 2px; }
      @media(max-width:1050px){
        #aetherAppMapContainer .layout { grid-template-columns: 1fr; }
        #aetherAppMapContainer .detail { position: static; }
        #aetherAppMapContainer .top { grid-template-columns: 1fr; }
      }
      @media(max-width:650px){
        #aetherAppMapContainer .steps { grid-template-columns: repeat(2,1fr); }
        #aetherAppMapContainer .control { margin-left: 0; }
      }
    </style>
    <div class="shell">
      <div class="top">
        <div>
          <div class="eyebrow">Mapa interactivo · arquitectura de ejecución</div>
          <h2>Cómo funciona Aether</h2>
          <p class="lead">Recorre el viaje de una obra: desde la edición en el navegador y su guardado local, hasta la sincronización autenticada con AWS y el regreso de los datos a la aplicación.</p>
        </div>
        <div style="display:flex; flex-direction:column; gap:8px; align-items:flex-end;">
          <div class="stamp">Basado en el código del proyecto<br><strong>Flujo actual · eu-south-2</strong></div>
          <button id="btnAppMapExpand" type="button" onclick="window.toggleAppMapExpand()" style="background: #173749; border: 1.5px solid #65d9ec; color: #eaffff; padding: 7px 14px; border-radius: 999px; font-family: monospace; font-size: 12px; font-weight: bold; cursor: pointer;">⛶ Ampliar Mapa</button>
        </div>
      </div>
      <div class="toolbar">
        <button class="tab" type="button" data-view="all" aria-selected="true">Vista completa</button>
        <button class="tab" type="button" data-view="local">Edición y guardado local</button>
        <button class="tab" type="button" data-view="auth">Autenticación</button>
        <button class="tab" type="button" data-view="sync">Sincronización</button>
        <button class="tab" type="button" data-view="download">Descarga y aplicación local</button>
        <button class="control" type="button" id="playAppMap">▶ Recorrer flujo</button>
        <button class="control secondary" type="button" id="resetAppMap">Reiniciar</button>
      </div>
      <div class="layout">
        <div>
          <div class="mapwrap">
            <div class="maphead"><strong id="mapTitle">Vista completa del flujo de datos</strong><span id="mapSub">Pulsa cualquier componente para ver su función</span></div>
            <div class="canvas"><div class="flow" id="flowAppMap">
              <div class="zone client" data-zone="client">
                <div class="zonehead">🖥️ CLIENTE · navegador <span class="tag">offline-first para edición local</span></div>
                <div class="row">
                  <button class="node clientnode" type="button" data-id="user"><span class="icon">✍️</span><b>Autor</b><small>Escribe, crea ideas y modifica una obra</small></button>
                  <div class="arrow">interacción</div>
                  <button class="node clientnode" type="button" data-id="frontend"><span class="icon">🌌</span><b>Frontend Aether</b><small>TypeScript + Vite · Canvas 2D · DOM · Web Audio</small></button>
                  <div class="arrow">cambios al grafo<br>o al editor</div>
                  <button class="node clientnode" type="button" data-id="storage"><span class="icon">⚙️</span><b>StorageManager</b><small>Debounce de 400 ms y armado del paquete de obra</small></button>
                  <div class="arrow">paquete local</div>
                  <button class="node dbnode" type="button" data-id="indexed"><span class="icon">🗄️</span><b>IndexedDB</b><small>Documento, nodos, puentes, descartes, estado y catálogo</small></button>
                </div>
                <div class="eventline">Guardar explícitamente o sincronizar también fuerza un guardado inmediato</div>
              </div>
              <div class="zone aws" data-zone="auth">
                <div class="zonehead">☁️ AWS · eu-south-2 <span class="tag">identidad, API y bóveda</span></div>
                <div class="row">
                  <button class="node authnode" type="button" data-id="google"><span class="icon">🔐</span><b>Google OAuth</b><small>Proveedor de identidad externo</small></button>
                  <div class="arrow purple">OAuth 2.0<br>Authorization Code + PKCE</div>
                  <button class="node authnode" type="button" data-id="cognito"><span class="icon">🪪</span><b>Amazon Cognito</b><small>User Pool · sesión y tokens JWT</small></button>
                  <div class="arrow purple">ID token<br>Bearer</div>
                  <button class="node apinode" type="button" data-id="api"><span class="icon">🚪</span><b>API Gateway</b><small>HTTP API v2 · JWT Authorizer</small></button>
                  <div class="arrow orange">evento HTTP<br>autorizado</div>
                  <button class="node lambdanode" type="button" data-id="lambda"><span class="icon">λ</span><b>Lambda sync-vault</b><small>Node.js 20 · arm64 · lógica de bóveda</small></button>
                </div>
                <div class="branch"><b>El navegador obtiene y guarda tokens</b> <span>en la sesión; Cognito verifica identidad durante el flujo OAuth. El JWT viaja en Authorization: Bearer en llamadas a la API.</span></div>
              </div>
              <div class="zone data" data-zone="data">
                <div class="zonehead">📦 Persistencia de la bóveda <span class="tag">metadata separada del contenido completo</span></div>
                <div class="row">
                  <button class="node dbnode" type="button" data-id="dynamo"><span class="icon">🔷</span><b>Amazon DynamoDB</b><small>Catálogo por userId + workId; título, fechas, checksum y s3Key</small></button>
                  <div class="arrow orange">Lambda consulta<br>y guarda metadata</div>
                  <button class="node s3node" type="button" data-id="s3"><span class="icon">🪣</span><b>Amazon S3 · bóveda privada</b><small>Paquete JSON .aether por autor y obra · versionado · cifrado</small></button>
                </div>
                <div class="eventline">Lambda firma URLs temporales; el navegador transfiere el archivo directamente a S3</div>
              </div>
              <div class="zone client" data-zone="sync">
                <div class="zonehead">🔄 Sincronización bidireccional <span class="tag">iniciada al autenticar o desde la Bóveda</span></div>
                <div class="row">
                  <button class="node dbnode" type="button" data-id="indexed"><span class="icon">🗄️</span><b>Paquete local</b><small>La app fuerza autosave y lee obras de IndexedDB</small></button>
                  <div class="arrow">GET catálogo<br>con JWT</div>
                  <button class="node apinode" type="button" data-id="api"><span class="icon">🚪</span><b>API Gateway</b><small>GET /vault/works</small></button>
                  <div class="arrow orange">JWT verificado<br>por Cognito</div>
                  <button class="node lambdanode" type="button" data-id="lambda"><span class="icon">λ</span><b>Lambda</b><small>Consulta catálogo por identidad del token</small></button>
                  <div class="arrow orange">Query<br>userId = sub</div>
                  <button class="node dbnode" type="button" data-id="dynamo"><span class="icon">🔷</span><b>DynamoDB</b><small>Lista metadata remota para comparar con obras locales</small></button>
                </div>
                <div class="vflow">
                  <div class="row">
                    <button class="node clientnode" type="button" data-id="checksum"><span class="icon">⚖️</span><b>Comparación de checksums</b><small>Local actual · último sincronizado · remoto</small></button>
                    <div class="arrow">decide<br>push / pull</div>
                    <button class="node apinode" type="button" data-id="api"><span class="icon">🔑</span><b>POST /vault/sync/init</b><small>Envía metadata + JWT</small></button>
                    <div class="arrow orange">guarda metadata<br>y firma PUT</div>
                    <button class="node lambdanode" type="button" data-id="lambda"><span class="icon">λ</span><b>Lambda → DynamoDB</b><small>Registra checksum, tamaño, título y fecha</small></button>
                  </div>
                  <div class="row" style="margin-top:10px">
                    <button class="node clientnode" type="button" data-id="frontend"><span class="icon">📤</span><b>Navegador</b><small>Sube JSON con PUT y URL prefirmada</small></button>
                    <div class="arrow green">PUT directo<br>sin pasar por Lambda</div>
                    <button class="node s3node" type="button" data-id="s3"><span class="icon">🪣</span><b>S3 · archivo .aether</b><small>Objeto privado en authors/{userId}/{workId}</small></button>
                    <div class="arrow">marca como<br>sincronizado</div>
                    <button class="node dbnode" type="button" data-id="indexed"><span class="icon">🗄️</span><b>IndexedDB</b><small>Actualiza checksum sincronizado y estado limpio</small></button>
                  </div>
                </div>
              </div>
              <div class="zone client" data-zone="download">
                <div class="zonehead">📥 Descarga y retorno a la aplicación <span class="tag">pull automático según comparación o manual</span></div>
                <div class="row">
                  <button class="node clientnode" type="button" data-id="frontend"><span class="icon">🧭</span><b>CloudSyncManager</b><small>Decide descargar; usuario también puede forzar pull</small></button>
                  <div class="arrow">GET download<br>con JWT</div>
                  <button class="node apinode" type="button" data-id="api"><span class="icon">🚪</span><b>API Gateway</b><small>GET /vault/works/{id}/download</small></button>
                  <div class="arrow orange">autoriza y<br>firma GET</div>
                  <button class="node lambdanode" type="button" data-id="lambda"><span class="icon">λ</span><b>Lambda</b><small>Lee metadata y genera URL de descarga</small></button>
                  <div class="arrow green">GET directo<br>URL prefirmada</div>
                  <button class="node s3node" type="button" data-id="s3"><span class="icon">🪣</span><b>S3 privado</b><small>Devuelve el paquete .aether al navegador</small></button>
                </div>
                <div class="vflow"><div class="row">
                  <button class="node clientnode" type="button" data-id="checksum"><span class="icon">✅</span><b>Validar checksum</b><small>La metadata remota se aplica al paquete descargado</small></button>
                  <div class="arrow">aplicar paquete<br>en local</div>
                  <button class="node dbnode" type="button" data-id="indexed"><span class="icon">🗄️</span><b>IndexedDB</b><small>Guarda paquete; si es la obra activa, actualiza stores locales</small></button>
                  <div class="arrow">hidrata interfaz</div>
                  <button class="node clientnode" type="button" data-id="frontend"><span class="icon">🌌</span><b>Frontend Aether</b><small>Restaura documento, grafo, descartes y vista activa</small></button>
                </div></div>
              </div>
              <div class="zone" data-zone="conflict">
                <div class="zonehead">🧩 Decisión de sincronización cuando hay diferencias</div>
                <div class="row">
                  <button class="node clientnode" type="button" data-id="checksum"><span class="icon">☯️</span><b>Checksums iguales</b><small>Coincidencia: conserva y marca la base sincronizada</small></button>
                  <button class="node clientnode" type="button" data-id="push"><span class="icon">⬆️</span><b>Solo cambios locales</b><small>Fast-forward push hacia la bóveda</small></button>
                  <button class="node clientnode" type="button" data-id="pull"><span class="icon">⬇️</span><b>Solo cambios remotos</b><small>Fast-forward pull y actualización local</small></button>
                  <button class="node clientnode" type="button" data-id="conflict"><span class="icon">🛟</span><b>Cambios en ambos lados</b><small>Compara updatedAt; puede bifurcar borrador local antes del pull remoto</small></button>
                </div>
              </div>
            </div></div>
          </div>
          <div class="journey">
            <div class="journeyhead">
              <div>
                <h3 id="journeyTitle">Recorrido guiado · una edición hasta la nube y de vuelta</h3>
                <p id="journeyDesc">Avanza para seguir el orden de las llamadas y el movimiento de los datos.</p>
              </div>
              <button class="control" type="button" id="nextAppMap">Siguiente paso →</button>
            </div>
            <div class="steps" id="stepsAppMap"></div>
            <div class="progress"><i id="progressAppMap"></i></div>
          </div>
          <div class="legend">
            <span class="key"><i class="dot" style="background:#65d9ec"></i>Acción local / dato de aplicación</span>
            <span class="key"><i class="dot" style="background:#b6a0ff"></i>Autenticación</span>
            <span class="key"><i class="dot" style="background:#ffad57"></i>API / lógica Lambda / metadata</span>
            <span class="key"><i class="dot" style="background:#75dda5"></i>Transferencia directa de archivo a S3</span>
          </div>
        </div>
        <div class="detail" id="detailAppMap">
          <div class="kind">Explora el diagrama</div>
          <h3>Selecciona un componente</h3>
          <p>Haz clic sobre los bloques del mapa para ver qué responsabilidad tienen y qué información reciben o envían.</p>
          <div class="fact"><b>Cómo leer las flechas</b><span>Las flechas indican dirección de la llamada o de los datos. El texto sobre cada flecha describe el tipo de operación.</span></div>
          <div class="fact"><b>Local y nube</b><span>La obra se guarda en el navegador. Cuando se sincroniza, el catálogo y el archivo completo viajan por caminos distintos.</span></div>
          <div class="hint">Este mapa refleja el comportamiento del código revisado: el flujo está funcionando actualmente.</div>
        </div>
      </div>
      <div class="foot">
        <span>Aether · flujo de datos de la aplicación</span>
        <span>Arquitectura actual · AWS eu-south-2 · visualización explicativa</span>
      </div>
    </div>
  </div>
</div>
<script is:inline>
(function() {
  var appInfo={
    user:{kind:'Actor',title:'Autor',desc:'La persona interactúa con Aether desde el navegador.',facts:[['Inicia','Escritura, creación de nodos, conexiones y acciones de sincronización.'],['Envía','Cambios al frontend mediante interacción con la interfaz.']]},
    frontend:{kind:'Cliente',title:'Frontend Aether',desc:'Aplicación TypeScript/Vite que coordina el editor, el grafo, el almacenamiento local, la sesión y la sincronización.',facts:[['UI','Canvas 2D y DOM; Web Audio API para sonido procedural.'],['Piezas clave','main.ts, StorageManager, CognitoAuthService y CloudSyncManager.'],['Red','Llama a Cognito y a la API usando fetch; carga o descarga objetos directamente desde S3 cuando recibe URLs prefirmadas.']]},
    storage:{kind:'Persistencia local',title:'StorageManager',desc:'Conecta los cambios de edición con IndexedDB y construye un paquete integral de la obra.',facts:[['Autosave','Tras cambios, debounce de 400 ms.'],['Contenido','Documento, nodos, puentes, descartes, fase, cámara, atmósfera y metadatos.'],['Sincronización','Antes de sincronizar fuerza saveImmediately() para tener un paquete local actual.']]},
    indexed:{kind:'Base local',title:'IndexedDB · aether_knowledge_v1',desc:'Persistencia del navegador organizada en object stores y paquetes de obra.',facts:[['Stores','documents, thought_nodes, connection_bridges y workspace_state.'],['Catálogo','works_catalog y un work_pkg_{id} por obra, además del identificador de obra activa.'],['Rol','Fuente local para seguir trabajando y punto de comparación para sincronizar.']]},
    google:{kind:'Identidad',title:'Google OAuth',desc:'Proveedor externo usado para que el autor inicie sesión.',facts:[['Protocolo','Authorization Code con PKCE iniciado desde Cognito Hosted UI.'],['Resultado','Cognito recibe la identidad de Google y emite tokens para el cliente.']]},
    cognito:{kind:'Identidad AWS',title:'Amazon Cognito · User Pool',desc:'Gestiona la sesión de la aplicación y emite tokens JWT aceptados por la API.',facts:[['Google','Configurado como Identity Provider.'],['Tokens','El frontend conserva los tokens y usa el ID token como Bearer para llamadas de bóveda.'],['Disparador','Al observar autenticación, CloudSyncManager inicia syncVault().']]},
    api:{kind:'Entrada de backend',title:'API Gateway · HTTP API v2',desc:'Puerta de entrada para operaciones del catálogo y emisión de URLs prefirmadas.',facts:[['Autorización','JWT Authorizer verifica el token de Cognito antes de invocar Lambda.'],['Rutas','GET /vault/works · POST /vault/sync/init · GET /vault/works/{workId}/download · DELETE /vault/works/{workId}.'],['Importante','El payload del archivo no atraviesa la API; el navegador usa URL prefirmada con S3.']]},
    lambda:{kind:'Backend',title:'AWS Lambda · sync-vault',desc:'Procesa las solicitudes autorizadas, accede a DynamoDB y firma operaciones de S3.',facts:[['Runtime','Node.js 20, arquitectura arm64, 256 MB y timeout de 15 s declarados.'],['Catálogo','Consulta, crea o elimina metadata de obra por identidad del JWT.'],['Archivos','Genera URLs firmadas PUT/GET; para borrado elimina también el objeto S3.']]},
    dynamo:{kind:'Base de datos cloud',title:'Amazon DynamoDB · works catalog',desc:'Almacena una fila por usuario y obra, usada para listar y comparar el estado remoto.',facts:[['Clave','userId (partition key) + workId (sort key).'],['Metadata','Título, updatedAt, wordCount, activePhase, sizeBytes, checksum y s3Key.'],['Protección declarada','PAY_PER_REQUEST, cifrado de servidor y point-in-time recovery.']]},
    s3:{kind:'Almacenamiento de objetos',title:'Amazon S3 · bóveda privada',desc:'Guarda el paquete JSON completo de cada obra bajo una ruta asociada al usuario y a la obra.',facts:[['Objeto','authors/{userId}/{workId}/archive.aether.'],['Carga','El navegador hace PUT directo usando URL prefirmada de 15 minutos.'],['Descarga','El navegador hace GET directo usando URL prefirmada de 15 minutos.'],['Bucket','Bloqueo público, versionado y cifrado AES256 declarados en Terraform.']]},
    checksum:{kind:'Regla de sincronización',title:'Comparación de checksums',desc:'CloudSyncManager compara contenido local, checksum de la última sincronización y checksum remoto.',facts:[['Iguales','Se marca la obra como sincronizada.'],['Cambió solo local','Se hace fast-forward push.'],['Cambió solo nube','Se hace fast-forward pull.'],['Divergencia','Compara updatedAt; si la nube es más reciente, bifurca el borrador local antes de descargar.']]},
    push:{kind:'Decisión',title:'Fast-forward push',desc:'Se envían cambios locales si la nube sigue en la última base compartida.',facts:[['Secuencia','Calcular checksum → POST init → actualizar catálogo → PUT directo a S3 → actualizar marca local.']]},
    pull:{kind:'Decisión',title:'Fast-forward pull',desc:'Se descarga una versión remota cuando el paquete local no cambió desde la última base.',facts:[['Secuencia','Solicitar URL de descarga → GET desde S3 → guardar paquete en IndexedDB → hidratar UI si está activa.']]},
    conflict:{kind:'Decisión',title:'Divergencia de cambios',desc:'Si ambas copias cambiaron desde la base conocida, el flujo compara fechas de actualización.',facts:[['Local más reciente','Sube el paquete local a la bóveda.'],['Remota más reciente','Crea un borrador local bifurcado y después descarga/aplica la versión remota.'],['Resultado','La intención del código es conservar el borrador local antes de reemplazar la obra activa.']]}
  };
  var appJourneys={
    all:{title:'Recorrido guiado · una edición hasta la nube y de vuelta',desc:'Avanza para seguir el orden de las llamadas y el movimiento de los datos.',steps:[['1 · Editar','Autor cambia el texto o el grafo.','user'],['2 · Autosave','Frontend avisa al StorageManager.','storage'],['3 · Local','Paquete íntegro queda en IndexedDB.','indexed'],['4 · Autenticar','Google → Cognito; el frontend recibe JWT.','cognito'],['5 · Comparar','Se lista el catálogo y se comparan checksums.','checksum'],['6 · Preparar','API autoriza; Lambda guarda metadata y firma PUT.','lambda'],['7 · Transferir','Navegador carga el JSON directo a S3.','s3'],['8 · Cerrar ciclo','Marca local sincronizada; luego puede hacerse pull.','frontend']]},
    local:{title:'Recorrido · edición y guardado local',desc:'La edición persiste localmente sin necesitar una petición de red.',steps:[['1 · Entrada','Autor modifica texto, ideas o conexiones.','user'],['2 · Aplicación','Frontend refleja cambios en editor/grafo.','frontend'],['3 · Escucha','StorageManager escucha cambios reactivos.','storage'],['4 · Espera breve','Debounce de 400 ms desde el último cambio.','storage'],['5 · Empaqueta','Reúne documento, grafo y estado de obra.','storage'],['6 · Guarda','IndexedDB almacena stores y paquete de obra.','indexed']]},
    auth:{title:'Recorrido · inicio de sesión',desc:'El flujo OAuth se realiza mediante Cognito y habilita llamadas autorizadas a la bóveda.',steps:[['1 · Acceso','Autor inicia Google OAuth.','user'],['2 · Proveedor','Google valida la identidad del usuario.','google'],['3 · Cognito','Cognito Hosted UI completa PKCE.','cognito'],['4 · Tokens','Frontend conserva tokens de sesión.','frontend'],['5 · API','ID token viaja como Bearer en llamadas.','api'],['6 · Sync','Estado autenticado dispara sincronización.','lambda']]},
    sync:{title:'Recorrido · sincronización de cambios',desc:'El catálogo se consulta por API; el contenido completo se transfiere directamente entre navegador y S3.',steps:[['1 · Guardar','syncVault fuerza guardado local inmediato.','storage'],['2 · Listar','GET /vault/works con JWT.','api'],['3 · Leer catálogo','Lambda consulta DynamoDB por userId.','dynamo'],['4 · Comparar','Decide igualdad, push, pull o divergencia.','checksum'],['5 · Registrar','POST sync/init; Lambda guarda metadata y devuelve URL PUT.','lambda'],['6 · Cargar objeto','Navegador PUT directo al bucket S3.','s3'],['7 · Sellar local','IndexedDB actualiza checksum sincronizado.','indexed']]},
    download:{title:'Recorrido · descargar y aplicar una obra',desc:'La app pide autorización y URL a Lambda; el archivo viaja directamente de S3 al navegador.',steps:[['1 · Solicitar','Pull automático o acción manual desde la Bóveda.','frontend'],['2 · Autorizar','GET download con JWT.','api'],['3 · Firmar','Lambda devuelve URL prefirmada GET.','lambda'],['4 · Descargar','Navegador obtiene el JSON directamente de S3.','s3'],['5 · Aplicar','StorageManager persiste WorkPackage en IndexedDB.','indexed'],['6 · Hidratar','Si corresponde a la activa, actualiza editor y grafo.','frontend']]}
  };
  var currentView='all', currentStep=-1, playTimer=null;
  var nodes=Array.prototype.slice.call(document.querySelectorAll('#aetherAppMapContainer .node'));
  var tabs=Array.prototype.slice.call(document.querySelectorAll('#aetherAppMapContainer .tab'));
  window.isAppMapExpanded = false;
  window.toggleAppMapExpand = function() {
    var wrap = document.getElementById('aetherAppMapWrapper');
    var card = document.getElementById('aetherAppMapContainer');
    var btn = document.getElementById('btnAppMapExpand');
    if (!wrap || !card) return;
    window.isAppMapExpanded = !window.isAppMapExpanded;
    if (window.isAppMapExpanded) {
      wrap.style.position = 'fixed';
      wrap.style.inset = '0';
      wrap.style.zIndex = '99999';
      wrap.style.width = '100vw';
      wrap.style.margin = '0';
      wrap.style.transform = 'none';
      wrap.style.padding = '20px';
      wrap.style.background = 'rgba(4, 6, 12, 0.94)';
      wrap.style.backdropFilter = 'blur(8px)';
      wrap.style.display = 'flex';
      wrap.style.alignItems = 'center';
      wrap.style.justifyContent = 'center';
      wrap.style.borderRadius = '0';
      wrap.style.overflowY = 'auto';
      card.style.width = '95vw';
      card.style.maxWidth = '1600px';
      card.style.maxHeight = '92vh';
      card.style.overflowY = 'auto';
      card.style.boxShadow = '0 25px 60px rgba(0, 0, 0, 0.9)';
      card.style.border = '1px solid #334155';
      if (btn) { btn.textContent = '✕ Cerrar Mapa'; btn.style.borderColor = '#FF007F'; }
    } else {
      wrap.style.position = 'relative';
      wrap.style.inset = 'auto';
      wrap.style.zIndex = '10';
      wrap.style.width = 'min(92vw, 1320px)';
      wrap.style.margin = '2.5rem 0 2.5rem 50%';
      wrap.style.transform = 'translateX(-50%)';
      wrap.style.padding = '0';
      wrap.style.background = 'transparent';
      wrap.style.backdropFilter = 'none';
      wrap.style.display = 'block';
      wrap.style.borderRadius = '16px';
      wrap.style.overflowY = 'visible';
      card.style.width = 'auto';
      card.style.maxWidth = 'none';
      card.style.maxHeight = 'none';
      card.style.overflowY = 'hidden';
      card.style.boxShadow = '0 18px 48px rgba(0,0,0,0.45)';
      card.style.border = '1px solid #294158';
      if (btn) { btn.textContent = '⛶ Ampliar Mapa'; btn.style.borderColor = '#65d9ec'; }
    }
  };
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && window.isAppMapExpanded) {
      window.toggleAppMapExpand();
    }
  });
  function renderJourney(){
    var j=appJourneys[currentView];
    document.getElementById('journeyTitle').textContent=j.title;
    document.getElementById('journeyDesc').textContent=j.desc;
    document.getElementById('stepsAppMap').innerHTML=j.steps.map(function(s,i){return '<button type="button" class="step '+(i<currentStep?'done':'')+' '+(i===currentStep?'current':'')+'" data-step="'+i+'"><b>'+s[0]+'</b><small>'+s[1]+'</small></button>';}).join('');
    document.getElementById('progressAppMap').style.width=(currentStep<0?0:((currentStep+1)/j.steps.length*100))+'%';
    document.getElementById('nextAppMap').textContent=currentStep>=j.steps.length-1?'↺ Reiniciar recorrido':'Siguiente paso →';
    Array.prototype.slice.call(document.querySelectorAll('#aetherAppMapContainer .step')).forEach(function(el){el.onclick=function(){goStep(+el.dataset.step);};});
  }
  function setView(v){
    currentView=v; currentStep=-1;
    tabs.forEach(function(t){t.setAttribute('aria-selected',String(t.dataset.view===v));});
    Array.prototype.slice.call(document.querySelectorAll('#aetherAppMapContainer [data-zone]')).forEach(function(z){
      var zName = z.getAttribute('data-zone');
      var hide = v!=='all' && zName!==v && !(v==='sync' && ['client','auth','data','sync','download','conflict'].indexOf(zName)!==-1);
      z.classList.toggle('only', hide);
    });
    document.getElementById('mapTitle').textContent=({all:'Vista completa del flujo de datos',local:'Edición y persistencia local',auth:'Identidad y autorización',sync:'Sincronización de obra local a nube',download:'Descarga desde la nube al navegador'})[v];
    document.getElementById('mapSub').textContent=v==='all'?'Pulsa cualquier componente para ver su función':'Las demás zonas permanecen atenuadas para orientar el recorrido';
    nodes.forEach(function(n){n.classList.remove('active','selected');});
    renderJourney();
  }
  function showInfo(id){
    var d=appInfo[id]; if(!d)return;
    nodes.forEach(function(n){n.classList.toggle('selected',n.dataset.id===id);});
    document.getElementById('detailAppMap').innerHTML='<div class="kind">'+d.kind+'</div><h3>'+d.title+'</h3><p>'+d.desc+'</p>'+d.facts.map(function(f){return '<div class="fact"><b>'+f[0]+'</b><span>'+f[1]+'</span></div>';}).join('')+'<div class="hint">El componente está descrito según el flujo actual revisado.</div>';
  }
  function goStep(i){
    var j=appJourneys[currentView];
    currentStep=Math.max(0,Math.min(i,j.steps.length-1));
    var id=j.steps[currentStep][2];
    renderJourney();
    nodes.forEach(function(n){n.classList.toggle('active',n.dataset.id===id);});
    showInfo(id);
    var target=document.querySelector('#aetherAppMapContainer .node.active');
    if(target) target.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});
  }
  nodes.forEach(function(n){n.addEventListener('click',function(){showInfo(n.dataset.id);});});
  tabs.forEach(function(t){t.addEventListener('click',function(){setView(t.dataset.view);});});
  document.getElementById('nextAppMap').onclick=function(){
    var j=appJourneys[currentView];
    if(currentStep>=j.steps.length-1){
      currentStep=-1; nodes.forEach(function(n){n.classList.remove('active');}); renderJourney();
    } else {
      goStep(currentStep+1);
    }
  };
  document.getElementById('resetAppMap').onclick=function(){
    clearInterval(playTimer); playTimer=null;
    document.getElementById('playAppMap').textContent='▶ Recorrer flujo';
    currentStep=-1; nodes.forEach(function(n){n.classList.remove('active','selected');}); renderJourney();
    document.getElementById('detailAppMap').innerHTML='<div class="kind">Explora el diagrama</div><h3>Selecciona un componente</h3><p>Haz clic sobre los bloques del mapa para ver qué responsabilidad tienen y qué información reciben o envían.</p><div class="fact"><b>Cómo leer las flechas</b><span>Las flechas indican dirección de la llamada o de los datos. El texto sobre cada flecha describe el tipo de operación.</span></div><div class="hint">Este mapa refleja el comportamiento del código revisado: el flujo está funcionando actualmente.</div>';
  };
  document.getElementById('playAppMap').onclick=function(){
    if(playTimer){
      clearInterval(playTimer); playTimer=null;
      document.getElementById('playAppMap').textContent='▶ Recorrer flujo';
      return;
    }
    var j=appJourneys[currentView];
    if(currentStep>=j.steps.length-1) currentStep=-1;
    document.getElementById('playAppMap').textContent='⏸ Pausar';
    playTimer=setInterval(function(){
      if(currentStep>=j.steps.length-1){
        clearInterval(playTimer); playTimer=null;
        document.getElementById('playAppMap').textContent='▶ Recorrer flujo';
        return;
      }
      goStep(currentStep+1);
    },1700);
  };
  renderJourney();
})();
</script>
