---
name: architecture-decisions
description: Cuándo y cómo escribir un ADR en Nebula — obligatorio para dependencias nuevas, cambios de API pública y de contratos.
---

# Architecture Decisions (ADR)

Los ADRs viven en `docs/adr/ADR-XXX-<slug>.md` (15 existentes — seguir su numeración y estilo).

## Cuándo es OBLIGATORIO un ADR (antes de implementar)

- Toda dependencia de runtime nueva en el core (ADR-014 regla 6) — incluye subir una peer o convertir dep en peer.
- Cambio de API pública de cualquier paquete `@stellaria/nebula-*` o del contrato `NebulaTheme`.
- Cambio de librería principal (styling, motion, forms, charts…), de estructura del monorepo o de estrategia de estado/publicación.
- Aplicar o retirar una contingencia (p.ej. el pin TS 5.9.3 de ADR-012).

## Formato (el de los ADRs existentes)

```markdown
# ADR-0XX — Título

- **Estado**: propuesta | aceptada · fecha
- **Contexto**: qué problema y qué restricciones.
- **Decisión**: qué se decide (imperativo, verificable).
- **Alternativas**: qué se evaluó y por qué se descartó.
- **Consecuencias**: costes asumidos y reglas derivadas.
```

## Reglas

- Si la decisión afecta a más de un paquete o al contrato compartido, ADR primero, código después.
- Un ADR que cambia algo dicho en `docs/0X-*.md` debe actualizar ese doc en el mismo PR.
- Los veredictos de spikes se documentan como sección nueva del ADR correspondiente (patrón ADR-012).
