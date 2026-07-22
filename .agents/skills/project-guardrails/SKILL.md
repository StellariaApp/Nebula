---
name: project-guardrails
description: Guardrails globales del monorepo Nebula — leer antes de cualquier cambio estructural, de dependencias o de API pública.
---

# Guardrails de Nebula

## Contexto

Nebula es una librería UI universal **Web + React Native** con API unificada por componente (`@stellaria/nebula-*`). La personalización se logra **exclusivamente vía temas** — nunca con forks. `docs/` es la fuente de verdad cerrada (decisiones de Checkpoints 1–3 + ADRs).

## Reglas obligatorias

- **Grafo de dependencias de una sola dirección** (docs/01 §2): `tokens` (0 deps) → `hooks`/`themes`/`icons` → `web`/`native` → dominios premium → apps. `web` y `native` NUNCA se importan entre sí.
- **Núcleo libre de dominio**: nada de lógica de negocio (commerce/sales/…) en los paquetes core; los dominios premium se crean cuando su primer módulo se implementa.
- **Toda dependencia nueva o cambio de API pública requiere ADR** en `docs/adr/` ANTES de implementar (ADR-014 regla 6).
- **Prohibido hardcodear valores visuales** (hex, px de spacing/radius, duraciones) fuera de `@stellaria/nebula-tokens`.
- **TS 7 con contingencia activa** (ADR-012): los paquetes compilan con `typescript@7.0.2`; el typed linting parsea con `5.9.3` desde la raíz. NO usar features exclusivas de TS 7 en código de librería.
- Preferir cambios pequeños y reversibles; si algo contradice `docs/`, preguntar con opciones + recomendación (nunca asumir en silencio).

## Criterio de aceptación mínimo

- `pnpm turbo build typecheck lint` verde en todos los workspaces.
- Cero `any` en tokens/hooks/themes/icons; en web/native solo fronteras de framework documentadas.
- Estructura y naming consistentes con docs/01 §2 (`@stellaria/nebula-<x>` en `packages/<x>`).
