---
title: 'Politicas-NocturneYouTube-Extensiones'
date: 2026-07-16
description: 'Politicas de Privacidad'
---

Políticas de Privacidad: NocturneYouTube-Extensiones

Última actualización: 17 de julio de 2026

En The Nocturne, nos tomamos la seguridad de tu "patrimonio digital" con el máximo rigor técnico. Esta política explica cómo manejamos tus datos
a través de nuestra infraestructura descentralizada en AWS.

1. Información que Recopilamos
   Para llevar a cabo el ritual de migración (importación/exportación), solicitamos acceso a los siguientes datos mediante Google OAuth2:

- Identidad básica: Tu dirección de correo electrónico y ID de usuario (para vincular tu sesión con tus trabajos en nuestro búnker digital).
- Datos de YouTube: Información sobre tus suscripciones y listas de reproducción (playlists).

2. Uso de los Datos
   Utilizamos la información recolectada exclusivamente para:

- Exportación: Leer tus suscripciones actuales para generar un respaldo cifrado.
- Importación: Recrear tus suscripciones y listas de reproducción en la cuenta de destino que tú elijas.
- Gobernanza: Gestionar las cuotas de la API de YouTube para asegurar la continuidad del servicio.

Nocturne NO vende, ni alquila, ni comparte tus datos con terceros para fines publicitarios o comerciales.

3. Almacenamiento y Seguridad (Grado Militar)
   Tu privacidad está protegida por una arquitectura de "Desacoplamiento Total" en AWS:

- Cifrado en Reposo: Los tokens de acceso (Refresh Tokens) nunca se almacenan en texto plano. Se cifran inmediatamente mediante AWS KMS (Key
  Management Service).
- Identidad Silenciosa: En tu navegador solo se almacena un identificador anónimo (userId). Las credenciales reales residen en nuestro backend
  seguro, aisladas del acceso público.
- Eficiencia de Datos: Solo conservamos la información necesaria para completar el proceso de migración. Puedes solicitar la eliminación de tus
  datos de nuestra base de datos en cualquier momento.

4. Permisos de Google (Scopes)
   Solicitamos permisos específicos para interactuar con la API de YouTube:

- youtube.readonly: Para leer tus suscripciones actuales.
- youtube.force-ssl: Necesario para realizar acciones de escritura (suscribirte a canales y crear playlists) durante el proceso de importación.

5. Control del Usuario
   Tú tienes el control total. Puedes revocar el acceso de The Nocturne a tu cuenta de Google en cualquier momento a través de la Configuración de
   Seguridad de Google (https://myaccount.google.com/permissions).

6. Contacto
   Para cualquier duda sobre el manejo de tus sombras digitales o para solicitar la eliminación de tus datos, puedes contactarnos en:
   uopechris@gmail.com
