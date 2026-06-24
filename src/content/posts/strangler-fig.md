---
title: 'Patrón Strangler Fig'
date: 2026-06-24
descripción: 'No migras porque el Java esté mal — migras porque necesitas una capacidad nueva'
---

Nivel 0: ¿Qué problema real resuelve Strangler Fig aquí?
Antes de diagramar nada, fijemos el problema de negocio en términos concretos, porque esto determina todas las decisiones técnicas posteriores:

Restricción dura: el sistema Java procesa "cientos de consultas diarias" — no es mucho volumen, pero es el sistema de producción real de una empresa que vive de eso. Un "big bang rewrite" (apagar Java, encender Python) es la antítesis del pensamiento de arquitecto: alto riesgo, sin rollback fácil, sin validación incremental.
Lo que cambia: la capacidad de comprensión del lenguaje (de reglas rígidas a NLU vía LLM).
Lo que NO debe cambiar (todavía): la interfaz que ve el cliente, la disponibilidad del sistema, la base de datos de mascotas que ya funciona.

Esto es exactamente la situación para la que Martin Fowler diseñó el patrón: un sistema legacy que funciona, no que está roto. No migras porque el Java esté mal escrito — migras porque necesitas una capacidad nueva (NLU) sin apostar la continuidad del negocio en una reescritura total.
¿Por qué no otros patrones?
Vale la pena descartar alternativas explícitamente, porque eso es lo que separa "elegir el patrón de moda" de razonar Nivel 0:
-Strangler Fig ✅Te permite enrutar tráfico incrementalmente entre el sistema viejo y el nuevo, con el viejo como red de seguridad, hasta "ahogar" (strangle) el legacy por completo.
-SidecarSirve para añadir capacidades (logging, observabilidad) sin tocar el flujo principal — pero aquí el flujo principal de respuesta SÍ cambia (de reglas a IA).
-Branch by AbstractionEs para cambios dentro del mismo codebase/deploy. Aquí estás cambiando de Java a Python como servicio separado, no refactorizando in-place.
Big Bang RewriteRiesgo total concentrado en un solo "switch". Si el chatbot nuevo falla el día 1, no hay vuelta atrás fácil.
Vamos a mapear el patrón Strangler Fig con el escenario concreto antes de bajar a la implementación con Terraform y Bedrock.
