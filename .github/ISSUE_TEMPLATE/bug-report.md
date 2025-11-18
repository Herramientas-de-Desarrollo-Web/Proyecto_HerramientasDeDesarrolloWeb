---
name: Bug Report
about: Reporta un error o comportamiento inesperado en la aplicación
title: "ERROR al Hacer clic en “Semana anterior” genera una reserva automáticamente"
labels: bug, frontend, priority: high, incidente:frontend
assignees: ''
---

## Descripción del bug

Al usar el calendario en `reserva.html`, cuando el usuario selecciona una fecha y luego hace clic en el botón **“Semana anterior”**, el sistema **crea la reserva automáticamente** sin que el usuario presione el botón de confirmar.

## Pasos para reproducir

1. Ir a `/reservas`.  
2. Seleccionar una fecha cualquiera.  
3. Hacer clic en **Semana anterior**.  
4. La reserva aparece creada automáticamente.

## Comportamiento esperado

El botón **“Semana anterior”** solo debe cambiar la fecha visible en el calendario, **NO enviar el formulario**.

## Impacto

Los usuarios terminan creando reservas por error → saturación y datos incorrectos.
