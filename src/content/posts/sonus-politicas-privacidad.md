---
title: 'Política de Privacidad — Sonus'
date: 2026-08-14
description: 'Politicas de Privacidad'
---

**Última actualización:** Agosto 2026

### 1. Información que NO recopilamos

Sonus **no recopila, no almacena y no transmite**:

- Grabaciones de audio del micrófono
- Conversaciones ni sonido ambiental
- Datos personales identificables (nombre, email, ubicación)
- Contactos, mensajes o llamadas

### 2. Acceso al audio del dispositivo

La app solicita el permiso `RECORD_AUDIO` exclusivamente para **capturar la señal de audio que se reproduce internamente** y crear efectos visuales que reaccionan a la música.

- **NO se activa el micrófono**
- **NO se graba nada**
- **NO sale audio del dispositivo**

Si el usuario lo rechaza, la app funciona igual, solo que sin efectos visuales.

### 3. Acceso a la biblioteca musical

La app solicita acceso a los archivos de audio almacenados en el dispositivo para reproducirlos. Esta información permanece **local** y no se sube a ningún servidor.

### 4. Análisis de estado de ánimo (IA)

Para la función de "estado de ánimo", la app envía **únicamente los títulos y artistas** de las canciones escuchadas (sin el archivo de audio) a un servicio de inteligencia artificial (DeepSeek) para analizar el patrón de escucha.

Los datos enviados son:

- Título de la canción
- Nombre del artista
- Duración (en milisegundos)
- Momento en que se reprodujo

**No se envía** el archivo de audio, la grabación, ni ningún dato personal.

### 5. Música en streaming

La app reproduce música Creative Commons desde ccMixter. Las búsquedas se realizan directamente con el servicio ccMixter, sin intermediarios.

### 6. Almacenamiento local

El historial de reproducción y las preferencias se guardan **únicamente en el dispositivo** (base de datos local). No se sincroniza con la nube ni se comparte.

### 7. Servicios de terceros

| Servicio        | Uso                                                |
| --------------- | -------------------------------------------------- |
| DeepSeek        | Análisis de estado de ánimo y generación de letras |
| ccMixter        | Búsqueda y streaming de música Creative Commons    |
| LRCLIB / Genius | Búsqueda de letras                                 |

### 8. Seguridad

El backend está protegido con:

- Autenticación mediante API Key
- Límite de velocidad (throttling)
- Acceso mínimo privilegio en la nube

### 9. Contacto

Para cualquier consulta sobre privacidad: uopechris@gmail.com
