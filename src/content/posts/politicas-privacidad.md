---
title: 'Política de Privacidad — Nocturne'
date: 2026-07-16
description: 'Politicas de Privacidad'
---

Última actualización: 17 de julio de 2026

Esta política explica cómo Nocturne maneja tus datos a través de nuestra
infraestructura en AWS.

1. Información que Recopilamos

Para realizar la migración (importación/exportación) de tu contenido,
solicitamos acceso a los siguientes datos mediante Google OAuth2:

- Identidad básica: tu dirección de correo electrónico e ID de usuario,
  para vincular tu sesión con tus procesos en nuestro sistema.
- Datos de YouTube: información sobre tus suscripciones y listas de
  reproducción (playlists).

2. Uso de los Datos

Utilizamos la información recolectada exclusivamente para:

- Exportación: leer tus suscripciones actuales para generar un respaldo
  cifrado.
- Importación: recrear tus suscripciones y listas de reproducción en la
  cuenta de destino que elijas.
- Gobernanza: gestionar las cuotas de la API de YouTube para asegurar la
  continuidad del servicio.

Nocturne no vende, alquila ni comparte tus datos con terceros para fines
publicitarios o comerciales.

3. Almacenamiento y Seguridad

Tu privacidad está protegida por una arquitectura desacoplada en AWS:

- Cifrado en reposo: los tokens de acceso (refresh tokens) nunca se
  almacenan en texto plano. Se cifran mediante AWS KMS (Key Management
  Service).
- Identificador anónimo: en tu navegador solo se almacena un identificador
  anónimo (userId). Las credenciales reales residen en nuestro backend,
  aisladas del acceso público.
- Minimización de datos: solo conservamos la información necesaria para
  completar el proceso de migración. Puedes solicitar la eliminación de
  tus datos en cualquier momento.

4. Permisos de Google (Scopes)

Solicitamos permisos específicos para interactuar con la API de YouTube:

- youtube.readonly: para leer tus suscripciones actuales.
- youtube.force-ssl: necesario para realizar acciones de escritura
  (suscribirte a canales y crear playlists) durante el proceso de
  importación.

5. Control del Usuario

Puedes revocar el acceso de Nocturne a tu cuenta de Google en cualquier
momento desde la Configuración de Seguridad de Google:
https://myaccount.google.com/permissions

6. Contacto

Para cualquier duda sobre el manejo de tus datos o para solicitar su
eliminación, contáctanos en: uopechris@gmail.com
