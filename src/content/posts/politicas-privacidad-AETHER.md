---
title: 'Política de Privacidad — Aether'
date: 2026-11-09
description: 'Politicas de Privacidad'
---

## 1. Declaración de Principios y Filosofía del Producto

Aether («Donde las Ideas se Cristalizan») ha sido concebido bajo una premisa fundamental: el texto y el pensamiento de un autor son sagrados y le pertenecen de forma exclusiva.

A diferencia del software comercial convencional que monetiza la telemetría, entrena modelos de inteligencia artificial con los borradores de sus usuarios o secuestra sus datos en formatos cerrados, Aether está construido bajo una arquitectura soberana y Local-First.

Esta Política de Privacidad describe de manera transparente qué datos se procesan, dónde se almacenan y las garantías que protegen tu intimidad creativa conforme al Reglamento General de Protección de Datos (RGPD) de la Unión Europea y la Ley Orgánica de Protección de Datos (LOPDGDD).

## 2. Los Dos Modos de Uso de Aether

Aether permite dos modalidades de trabajo con tratamientos de datos claramente diferenciados:

A. Modo Local Anónimo (Sin Cuenta)
Custodia 100% en tu dispositivo: Si utilizas Aether sin iniciar sesión, la totalidad de tus obras, fragmentos y notas se almacenan exclusivamente en el motor de base de datos interno de tu propio navegador web (IndexedDB).
Cero telemetría en la nube: En este modo, ningún texto, borrador o dato personal viaja a ningún servidor externo. Si no creas una cuenta, para Aether eres totalmente anónimo.
B. Modo Bóveda Sincronizada (Con Cuenta de Autor)
Si decides conectar tu identidad para sincronizar tus obras entre distintos ordenadores o dispositivos, tus textos se respaldan bajo cifrado soberano en nuestra infraestructura de Bóveda en la nube.

## 3. Datos que Recopilamos y Finalidad

Cuando decides iniciar sesión voluntariamente mediante Google OAuth 2.0, Aether solicita exclusivamente los permisos mínimos e indispensables (scopes openid, email y profile):

Dirección de Correo Electrónico: Utilizada de forma exclusiva como identificador unívoco de tu cuenta de autor para garantizar que solo tú puedas sincronizar y acceder a tus obras.
Nombre Público y Fotografía de Perfil: Utilizados únicamente para personalizar la cabecera y el avatar de tu espacio de trabajo en la aplicación.
Contenido de las Obras y Metadatos de Edición: El texto de tus obras, marcas temporales de edición y sumas de verificación (checksums) criptográficas necesarias para resolver conflictos de sincronización entre dispositivos.

Lo que NUNCA recopilamos ni solicitamos:

No tenemos acceso a tus contraseñas (la autenticación se realiza de forma delegada y segura a través de Google).
No solicitamos acceso a tus archivos de Google Drive, contactos, correos de Gmail ni calendarios.
No solicitamos datos bancarios ni información financiera.

## 4. Soberanía Territorial y Almacenamiento en AWS España

Todos los datos procesados en el Modo Bóveda se encuentran alojados físicamente dentro del territorio de la Unión Europea:

Región Geográfica: AWS Europa (España) — identificador técnico eu-south-2 (Aragón / Madrid).
Gestión de Identidades: Amazon Cognito (User Pool en eu-south-2).
Catálogo de Obras: Amazon DynamoDB bajo cifrado en reposo.
Archivos y Textos: Amazon S3 bajo cifrado en reposo con estándar industrial AES-256 (aws:kms / SSE-S3).
Tránsito Cifrado: Todas las comunicaciones entre tu navegador y la Bóveda viajan exclusivamente a través de conexiones seguras HTTPS con cifrado TLS 1.3 de extremo a extremo.

## 5. Compromiso Ético con la Inteligencia Artificial y Publicidad

Cero Entrenamiento de Modelos de IA: Tus textos, ensayos, borradores y notas personales NUNCA serán utilizados, leídos, cedidos ni procesados para entrenar modelos de Inteligencia Artificial (LLMs), ni propios ni de terceros.
Cero Publicidad y Cero Venta de Datos: Aether no vende, no alquila y no comparte tu información con intermediarios de datos (data brokers), anunciantes comerciales ni redes de publicidad.

## 6. Política de Cookies y Almacenamiento Local

Aether mantiene una política de cero rastreo comercial:

No utilizamos cookies publicitarias ni de seguimiento: No existen píxeles de Meta/Facebook, Google Analytics, herramientas de mapas de calor ni rastreadores de terceros.
Almacenamiento Técnico Imprescindible: La aplicación utiliza exclusivamente mecanismos de almacenamiento local de tu navegador (localStorage e IndexedDB) con fines estrictamente funcionales: recordar el modo de foco activo, guardar la caché de tus textos para permitir la escritura sin conexión a internet y mantener tu sesión activa.

## 7. Tus Derechos y Derecho al Olvido (Eliminación de Cuenta)

De acuerdo con el RGPD, mantienes en todo momento el control absoluto sobre tus datos:

Derecho de Portabilidad y Exportación: Puedes exportar tus obras en cualquier momento en formatos abiertos y estándar (archivos nativos .aether, texto plano o impresión PDF/física mediante la función Prensa).
Derecho de Supresión (Eliminación Definitiva de Cuenta): Si deseas eliminar tu cuenta de autor y purgar todos los registros y textos alojados en la Bóveda de AWS España, basta con enviar un correo electrónico a:
👉 uopechris@gmail.com
indicando en el asunto "Eliminación de cuenta Aether" y enviando el mensaje desde la misma dirección de correo vinculada a tu cuenta.
Procederemos a la eliminación irreversible de tus credenciales en Amazon Cognito y de todas tus obras en la base de datos y almacenamiento en un plazo máximo de 72 horas, confirmándote la ejecución por correo.
Derecho de Acceso y Rectificación: Puedes solicitar una copia de los datos vinculados a tu identidad o corregir cualquier información contactando al mismo correo de soporte.

## 8. Modificaciones a esta Política

Podremos actualizar esta política si incorporamos nuevas capacidades técnicas al editor o si la legislación así lo requiere. Cualquier modificación sustancial mantendrá siempre el espíritu de soberanía del autor y será publicada en este mismo enlace con la fecha de revisión actualizada.

## 9. Contacto

Para cualquier duda, sugerencia sobre el tratamiento de datos o ejercicio de tus derechos, puedes contactar directamente al responsable del proyecto:

Christian Gohring

Correo de contacto: uopechris@gmail.com

Sitio web: https://christiangohring.com
