---
title: 'POLITICA DE PRIVACIDAD'
date: 2026-05-15
description: 'Vista integral por capas de The Nocturne'
---

Aquí puedes escribir cualquier texto introductorio en Markdown normal antes del diagrama.

<div class="arch-container-clean">
<style>
/* Eliminamos el modificador global '*' y el body para no romper los estilos de tu blog Astro */
.arch-wrap {
  font-family: var(--font-sans), system-ui, -apple-system, sans-serif;
  padding: 24px 16px 32px;
  max-width: 900px;
  margin: 0 auto;
}

.arch-title {
font-size: 13px;
font-weight: 500;
color: var(--color-text-secondary, #666);
letter-spacing: 0.08em;
text-align: center;
margin-bottom: 6px;
text-transform: uppercase;
}
.arch-subtitle {
font-size: 18px;
font-weight: 500;
color: var(--color-text-primary, #111);
text-align: center;
margin-bottom: 28px;
}

/_ LAYER CONTAINERS _/
.layer {
border: 1px solid var(--color-border-tertiary, #eee);
border-radius: var(--border-radius-lg, 8px);
padding: 14px 16px 16px;
margin-bottom: 10px;
position: relative;
background: var(--color-background-secondary, #fafafa);
}
.layer-label {
position: absolute;
top: -10px;
left: 16px;
font-size: 10px;
font-weight: 500;
letter-spacing: 0.1em;
text-transform: uppercase;
padding: 2px 8px;
border-radius: 4px;
border: 1px solid var(--color-border-secondary, #ddd);
background: var(--color-background-primary, #fff);
}

/_ LAYER COLORS _/
.layer-frontend .layer-label { color: #534AB7; border-color: #AFA9EC; }
.layer-gateway .layer-label { color: #0F6E56; border-color: #5DCAA5; }
.layer-security .layer-label { color: #854F0B; border-color: #EF9F27; }
.layer-queue .layer-label { color: #185FA5; border-color: #85B7EB; }
.layer-compute .layer-label { color: #993C1D; border-color: #F0997B; }
.layer-data .layer-label { color: #3B6D11; border-color: #97C459; }
.layer-monitor .layer-label { color: #993556; border-color: #ED93B1; }

.layer-frontend { border-color: #AFA9EC33; background: #EEEDFE22; }
.layer-gateway { border-color: #5DCAA533; background: #E1F5EE22; }
.layer-security { border-color: #EF9F2733; background: #FAEEDA22; }
.layer-queue { border-color: #85B7EB33; background: #E6F1FB22; }
.layer-compute { border-color: #F0997B33; background: #FAECE722; }
.layer-data { border-color: #97C45933; background: #EAF3DE22; }
.layer-monitor { border-color: #ED93B133; background: #FBEAF022; }

/_ NODES _/
.nodes-row {
display: flex;
flex-wrap: wrap;
gap: 10px;
align-items: flex-start;
margin-top: 6px;
}
.node {
border: 1px solid var(--color-border-secondary, #ddd);
border-radius: var(--border-radius-md, 6px);
padding: 10px 14px;
background: var(--color-background-primary, #fff);
cursor: pointer;
transition: transform 0.15s, box-shadow 0.15s;
flex: 1;
min-width: 160px;
}
.node:hover {
transform: translateY(-2px);
box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}
.node-icon {
font-size: 18px;
margin-bottom: 4px;
line-height: 1;
}
.node-name {
font-size: 13px;
font-weight: 500;
color: var(--color-text-primary, #111);
margin-bottom: 2px;
}
.node-desc {
font-size: 11px;
color: var(--color-text-secondary, #666);
line-height: 1.4;
}
.node-tag {
display: inline-block;
font-size: 10px;
font-weight: 500;
padding: 2px 6px;
border-radius: 4px;
margin-top: 6px;
}

/_ TAG VARIANTS _/
.tag-purple { background: #EEEDFE; color: #3C3489; }
.tag-teal { background: #E1F5EE; color: #085041; }
.tag-amber { background: #FAEEDA; color: #633806; }
.tag-blue { background: #E6F1FB; color: #0C447C; }
.tag-coral { background: #FAECE7; color: #4A1B0C; }
.tag-green { background: #EAF3DE; color: #173404; }
.tag-pink { background: #FBEAF0; color: #4B1528; }
.tag-red { background: #FCEBEB; color: #501313; }
.tag-gray { background: #F1EFE8; color: #2C2C2A; }

@media (prefers-color-scheme: dark) {
.tag-purple { background: #26215C; color: #CECBF6; }
.tag-teal { background: #04342C; color: #9FE1CB; }
.tag-amber { background: #412402; color: #FAC775; }
.tag-blue { background: #042C53; color: #B5D4F4; }
.tag-coral { background: #4A1B0C; color: #F5C4B3; }
.tag-green { background: #173404; color: #C0DD97; }
.tag-pink { background: #4B1528; color: #F4C0D1; }
.tag-red { background: #501313; color: #F7C1C1; }
.tag-gray { background: #2C2C2A; color: #D3D1C7; }
.layer-frontend { background: #26215C18; }
.layer-gateway { background: #04342C18; }
.layer-security { background: #41240218; }
.layer-queue { background: #042C5318; }
.layer-compute { background: #4A1B0C18; }
.layer-data { background: #17340418; }
.layer-monitor { background: #4B152818; }
}

/_ ARROWS BETWEEN LAYERS _/
.flow-arrow {
display: flex;
justify-content: center;
align-items: center;
gap: 8px;
margin: 2px 0;
color: var(--color-text-tertiary, #999);
font-size: 11px;
}
.flow-arrow svg { flex-shrink: 0; }

/_ FLOWS SECTION _/
.flows-grid {
display: grid;
grid-template-columns: 1fr 1fr;
gap: 12px;
margin-top: 8px;
}
@media (max-width: 600px) {
.flows-grid { grid-template-columns: 1fr; }
}
.flow-card {
border: 1px solid var(--color-border-tertiary, #eee);
border-radius: var(--border-radius-md, 6px);
padding: 12px 14px;
background: var(--color-background-secondary, #fafafa);
}
.flow-card-title {
font-size: 12px;
font-weight: 500;
color: var(--color-text-primary, #111);
margin-bottom: 8px;
display: flex;
align-items: center;
gap: 6px;
}
.flow-step {
display: flex;
align-items: flex-start;
gap: 8px;
margin-bottom: 5px;
font-size: 11px;
color: var(--color-text-secondary, #666);
line-height: 1.4;
}
.flow-num {
width: 18px;
height: 18px;
border-radius: 50%;
display: flex;
align-items: center;
justify-content: center;
font-size: 10px;
font-weight: 500;
flex-shrink: 0;
}

/_ DETAIL PANEL (Ajustado para no flotar por todo el monitor si tu layout es encajonado) _/
.detail-panel {
position: fixed;
bottom: 0; left: 0; right: 0;
background: var(--color-background-primary, #fff);
border-top: 2px solid var(--color-border-secondary, #ddd);
padding: 16px 20px;
font-size: 13px;
color: var(--color-text-primary, #111);
display: none;
z-index: 9999;
line-height: 1.5;
box-shadow: 0 -4px 20px rgba(0,0,0,0.15);
}
.detail-panel.visible { display: flex; gap: 12px; align-items: flex-start; }
.detail-close {
cursor: pointer;
color: var(--color-text-secondary, #666);
font-size: 22px;
line-height: 1;
padding: 0 4px;
flex-shrink: 0;
}

.section-title {
font-size: 12px;
font-weight: 500;
color: var(--color-text-secondary, #666);
letter-spacing: 0.06em;
text-transform: uppercase;
margin: 20px 0 8px;
}

.node-special {
border: 1.5px dashed var(--color-border-secondary, #ddd);
}
</style>

<div class="arch-wrap">
  <div class="arch-title">The Nocturne</div>
  <div class="arch-subtitle">Arquitectura EDA-Serverless · Vista integral por capas</div>

  <div class="layer layer-frontend">
    <span class="layer-label">Capa 1 · Cliente</span>
    <div class="nodes-row">
      <div class="node" onclick="showDetail('ext','Chrome Extension','React 19 + Vite. Tres fases: AuthPhase (OIDC login con Google), ActionPhase (inicio del ritual de exportación) y StatusPhase (monitoreo de progreso en tiempo real mediante polling).')">
        <div class="node-icon">🧩</div>
        <div class="node-name">Chrome Extension</div>
        <div class="node-desc">AuthPhase · ActionPhase · StatusPhase</div>
        <span class="node-tag tag-purple">React 19 + Vite</span>
      </div>
    </div>
  </div>

  <div class="flow-arrow">
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2v10M4 9l3 3 3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    <span>(1) Login OIDC · (2) Start Ritual · (6) Polling de estado · (8.1) POST /upload-url</span>
  </div>

  <div class="layer layer-gateway">
    <span class="layer-label">Capa 2 · Entrada API</span>
    <div class="nodes-row">
      <div class="node" onclick="showDetail('gw','API Gateway v2','Punto de entrada HTTP. Enruta el tráfico entrante hacia las Lambdas correspondientes: Dispatcher para inicio de jobs, Lambda Status para polling de progreso, Lambda Upload-URL para generar presigned URLs.')">
        <div class="node-icon">🔀</div>
        <div class="node-name">API Gateway v2</div>
        <div class="node-desc">POST /start · GET /status · POST /upload-url</div>
        <span class="node-tag tag-teal">HTTP API</span>
      </div>
      <div class="node" onclick="showDetail('disp','API Dispatcher','Guardián del portal. Intercambia el código OIDC de Google por un Access + Refresh Token, cifra el token con KMS antes de almacenarlo, y crea el registro inicial del Job en DynamoDB con estado PENDING.')">
        <div class="node-icon">🛡️</div>
        <div class="node-name">API Dispatcher</div>
        <div class="node-desc">Gestión identidad · cifrado KMS · creación Job</div>
        <span class="node-tag tag-teal">Lambda · Ingesta</span>
      </div>
    </div>
  </div>

  <div class="flow-arrow">
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2v10M4 9l3 3 3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    <span>(1.2) Cifrado token · (4.1) Decrypt token</span>
  </div>

  <div class="layer layer-security">
    <span class="layer-label">Capa 3 · Seguridad</span>
    <div class="nodes-row">
      <div class="node" onclick="showDetail('kms','AWS KMS','Cifra y descifra tokens de Google con clave asimétrica. Ningún secreto se almacena en texto plano. Se usa también para cifrar datos sensibles en DynamoDB.')">
        <div class="node-icon">🔐</div>
        <div class="node-name">AWS KMS</div>
        <div class="node-desc">Cifrado asimétrico de tokens y secretos</div>
        <span class="node-tag tag-amber">Key Management</span>
      </div>
      <div class="node" onclick="showDetail('ssm','AWS SSM Parameter Store','Almacén seguro de configuración y secretos de la aplicación (API keys, ARNs, configuración de entornos). Accesible solo desde las Lambdas con los permisos IAM correctos.')">
        <div class="node-icon">🗝️</div>
        <div class="node-name">SSM Parameter Store</div>
        <div class="node-desc">Configuración y secretos de aplicación</div>
        <span class="node-tag tag-amber">Secrets</span>
      </div>
    </div>
  </div>

  <div class="flow-arrow">
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2v10M4 9l3 3 3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    <span>(3) Mensaje encolado · (4) Trigger Worker tras 3 reintentos → DLQ</span>
  </div>

  <div class="layer layer-queue">
    <span class="layer-label">Capa 4 · Mensajería</span>
    <div class="nodes-row">
      <div class="node" onclick="showDetail('sqs','SQS Job Queue','Autopista principal de eventos. Desacopla el Dispatcher del Worker. Garantiza al menos una entrega del mensaje. Si el Worker falla 3 veces consecutivas, el mensaje es enviado automáticamente a la DLQ.')">
        <div class="node-icon">🚀</div>
        <div class="node-name">SQS Job Queue</div>
        <div class="node-desc">Cola principal · entrega garantizada · decoupling</div>
        <span class="node-tag tag-blue">Autopista principal</span>
      </div>
      <div class="node node-special" onclick="showDetail('dlq','SQS Dead Letter Queue (DLQ)','Cementerio de sombras. Recibe mensajes que fallaron 3+ veces en el Worker (errores de código, datos corruptos, timeouts irrecuperables). Permite inspección manual sin bloquear la cola principal ni afectar a otros usuarios.')">
        <div class="node-icon">💀</div>
        <div class="node-name">SQS DLQ</div>
        <div class="node-desc">Mensajes fallidos ×3 · auditoría · aislamiento</div>
        <span class="node-tag tag-red">Dead Letter Queue</span>
      </div>
    </div>
  </div>

  <div class="flow-arrow">
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2v10M4 9l3 3 3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    <span>(4.3) YouTube API · (5.1) Re-inject a cola · (5.0) EventBridge Cron</span>
  </div>

  <div class="layer layer-compute">
    <span class="layer-label">Capa 5 · Cómputo</span>
    <div class="nodes-row">
      <div class="node" onclick="showDetail('worker','Worker Processor','Motor de ejecución. Lee el mensaje de SQS, descifra el token con KMS, procesa suscripciones/playlists item a item. Time-Awareness: si queda poco tiempo de Lambda, se auto-reencola (relay). Idempotente: verifica estado antes de operar.')">
        <div class="node-icon">⚙️</div>
        <div class="node-name">Worker Processor</div>
        <div class="node-desc">Lógica de negocio · idempotencia · Time-Aware relay</div>
        <span class="node-tag tag-coral">Lambda · Motor</span>
      </div>
      <div class="node" onclick="showDetail('resumer','Lambda Resumer','Resucitador de jobs pausados. Activado por EventBridge a las 09:05 AM (hora Madrid, 1 minuto tras el reset de cuota de YouTube). Busca jobs en estado PAUSED_QUOTA en DynamoDB y los re-inyecta en la SQS Job Queue.')">
        <div class="node-icon">⏰</div>
        <div class="node-name">Lambda Resumer</div>
        <div class="node-desc">EventBridge 09:05 AM · detecta reset cuota · re-inyecta</div>
        <span class="node-tag tag-coral">Lambda · Scheduler</span>
      </div>
      <div class="node" onclick="showDetail('upload','Lambda Upload-URL','Facilitador de ofrendas. Genera Presigned URLs de S3 con TTL corto para que la extensión suba archivos de importación (JSON) directamente al bucket. Evita pasar datos pesados por las Lambdas, ahorrando coste y tiempo.')">
        <div class="node-icon">📤</div>
        <div class="node-name">Lambda Upload-URL</div>
        <div class="node-desc">Genera presigned URLs · direct upload a S3</div>
        <span class="node-tag tag-coral">Lambda · S3 Gate</span>
      </div>
      <div class="node" onclick="showDetail('yt','YouTube Data API v3','API externa de Google. Consumida por el Worker para leer suscripciones y playlists. Quota-Heavy: tiene límite diario de unidades. El Worker consulta el QuotaLedger en DynamoDB antes de cada llamada. Si no hay cuota, pausa el job.')">
        <div class="node-icon">📺</div>
        <div class="node-name">YouTube Data API v3</div>
        <div class="node-desc">Suscripciones · playlists · quota-aware</div>
        <span class="node-tag tag-gray">API Externa · Quota</span>
      </div>
    </div>
  </div>

  <div class="flow-arrow">
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2v10M4 9l3 3 3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    <span>(4.2) Update state · (7.2) Query progress · (8.2) Presigned URL · (8.3) Direct upload PUT</span>
  </div>

  <div class="layer layer-data">
    <span class="layer-label">Capa 6 · Persistencia</span>
    <div class="nodes-row">
      <div class="node" onclick="showDetail('dynamo','DynamoDB (Global State)','Cerebro persistente. Almacena: identidades de usuario, estado de cada Job (PENDING/RUNNING/PAUSED_QUOTA/DONE/FAILED), contadores atómicos (doneCount, failedCount) para la barra de progreso, QuotaLedger por usuario y mappings de IDs.')">
        <div class="node-icon">🧠</div>
        <div class="node-name">DynamoDB</div>
        <div class="node-desc">Estado de Jobs · contadores atómicos · QuotaLedger</div>
        <span class="node-tag tag-green">Global State · KV</span>
      </div>
      <div class="node" onclick="showDetail('s3','S3 Bunker','Almacén de reliquias. Guarda los JSON de exportación e importación. Direct upload desde el cliente via Presigned URL. Políticas de ciclo de vida para expirar objetos antiguos y reducir coste. Acceso solo a través de URLs firmadas.')">
        <div class="node-icon">🏛️</div>
        <div class="node-name">S3 Bunker</div>
        <div class="node-desc">JSON export/import · presigned access · lifecycle</div>
        <span class="node-tag tag-green">Object Storage</span>
      </div>
    </div>
  </div>

  <div class="flow-arrow">
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2v10M4 9l3 3 3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    <span>(7.1) GET /status · Lambda Status lee DynamoDB · responde % progreso al cliente</span>
  </div>

  <div class="layer layer-monitor">
    <span class="layer-label">Capa 7 · Observabilidad</span>
    <div class="nodes-row">
      <div class="node" onclick="showDetail('status','Lambda Status','Oráculo de progreso. Lambda optimizada (mínima memoria). Solo consulta DynamoDB para devolver doneCount, failedCount y estado actual del Job. Llamada por la extensión cada X segundos (polling) para pintar la barra de progreso.')">
        <div class="node-icon">📡</div>
        <div class="node-name">Lambda Status</div>
        <div class="node-desc">Lee doneCount/failedCount · responde % progreso</div>
        <span class="node-tag tag-pink">Read-only · Low mem</span>
      </div>
      <div class="node" onclick="showDetail('eb','EventBridge Cron','Scheduler serverless. Dispara la Lambda Resumer exactamente a las 09:05 AM hora de Madrid (Europe/Madrid), 1 minuto después de que YouTube resetea su cuota diaria.')">
        <div class="node-icon">⚡</div>
        <div class="node-name">EventBridge Cron</div>
        <div class="node-desc">09:05 AM Madrid · dispara Lambda Resumer</div>
        <span class="node-tag tag-pink">Scheduler · Cron</span>
      </div>
    </div>
  </div>

  <div class="section-title">Flujos de datos end-to-end</div>
  <div class="flows-grid">
    <div class="flow-card">
      <div class="flow-card-title">
        <span class="node-tag tag-blue" style="margin:0">📥 Importación (S3 Direct)</span>
      </div>
      <div class="flow-step"><span class="flow-num tag-blue">1</span>Extensión solicita URL de subida a Lambda Upload-URL</div>
      <div class="flow-step"><span class="flow-num tag-blue">2</span>Extensión sube JSON directamente a S3 via PUT (presigned URL)</div>
      <div class="flow-step"><span class="flow-num tag-blue">3</span>Extensión llama al Dispatcher con el s3Key del archivo subido</div>
    </div>
    <div class="flow-card">
      <div class="flow-card-title">
        <span class="node-tag tag-coral" style="margin:0">⚙️ Ejecución (Idempotente)</span>
      </div>
      <div class="flow-step"><span class="flow-num tag-coral">1</span>Worker lee SQS, descarga archivo de S3, procesa item a item</div>
      <div class="flow-step"><span class="flow-num tag-coral">2</span>Si queda poco tiempo → auto-reencola (relay sin pérdida)</div>
      <div class="flow-step"><span class="flow-num tag-coral">3</span>Fallo crítico ×3 → mensaje va a DLQ para auditoría</div>
    </div>
    <div class="flow-card">
      <div class="flow-card-title">
        <span class="node-tag tag-amber" style="margin:0">📊 Gobernanza (Quota-Aware)</span>
      </div>
      <div class="flow-step"><span class="flow-num tag-amber">1</span>Antes de cada llamada YouTube, Worker consulta QuotaLedger</div>
      <div class="flow-step"><span class="flow-num tag-amber">2</span>Sin cuota → estado cambia a PAUSED_QUOTA</div>
      <div class="flow-step"><span class="flow-num tag-amber">3</span>09:05 AM → Resumer detecta reset y re-inyecta en cola activa</div>
    </div>
    <div class="flow-card">
      <div class="flow-card-title">
        <span class="node-tag tag-pink" style="margin:0">📡 Monitoreo (Real-Time)</span>
      </div>
      <div class="flow-step"><span class="flow-num tag-pink">1</span>Extensión hace polling cada X segundos a Lambda Status</div>
      <div class="flow-step"><span class="flow-num tag-pink">2</span>Lambda lee contadores atómicos de DynamoDB</div>
      <div class="flow-step"><span class="flow-num tag-pink">3</span>Pinta barra de progreso con doneCount y failedCount</div>
    </div>
  </div>
</div>

<div class="detail-panel" id="detail-panel">
  <div style="flex:1">
    <div style="font-weight:600; margin-bottom:4px; font-size:14px;" id="detail-name"></div>
    <div style="font-size:12px; color:var(--color-text-secondary, #444)" id="detail-body"></div>
  </div>
  <div class="detail-close" onclick="closeDetail()">×</div>
</div>

<script is:inline>
// Añadimos 'is:inline' para que Astro no intente procesar o mover este script fuera del contexto del post
function showDetail(id, name, body) {
  document.getElementById('detail-name').textContent = name;
  document.getElementById('detail-body').textContent = body;
  document.getElementById('detail-panel').classList.add('visible');
}
function closeDetail() {
  document.getElementById('detail-panel').classList.remove('visible');
}
</script>
</div>

Sigue escribiendo tu contenido en Markdown aquí abajo de forma normal...
