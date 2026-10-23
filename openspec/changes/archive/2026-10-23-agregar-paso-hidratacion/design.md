# Design

## Context

El paso se agrega como `src/pasos/hidratacion.js`; el recorrido ya lo incluye y la señalización `hidratacion` ya existe en el avatar. Ver proposal.md para la motivación.

## Goals / Non-Goals

**Goals:**
- Un único archivo de paso, sin tocar el resto de la app.

**Non-Goals:**
- Recomendar marcas o ingredientes más allá del tipo de producto.

## Decisions

- **Brillo como piel hidratada:** `aplicar` llama a `avatar.difuminar('brillo', { guia: 'hidratacion', opacidad })` para que la brocha siga las flechas de la hidratación.
- **Intensidad por tipo de piel:** seca 0.6, normal 0.45, mixta 0.4 y grasa 0.25.
- **Mensaje distinto para piel seca:** el avatar anuncia el sérum y la crema; para los demás tipos, solo la crema.
