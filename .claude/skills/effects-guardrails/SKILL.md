---
name: effects-guardrails
description: Guardrails de glass/blur/gradients/sombras de Nebula — materiales premium sin comprometer legibilidad, performance ni el interruptor de tema.
---

# Effects: glass / blur / gradients (con guardrails)

## Reglas

- Todos los efectos se consumen desde tokens (`effects.blur/glass/shadows/gradients` del theme) — nunca valores libres por componente.
- **`effects.glass.enabled` es ley**: un tema puede apagarlo; todo componente glass degrada a superficie sólida semántica cuando está off.
- Blur operativo máximo recomendado: `md` (8px) en superficies comunes; niveles altos solo en overlays puntuales.
- Gradients SOLO desde `effects.gradients.{brand,accent,surface}` (tokens nuevos de Nebula) y como acento — nunca para texto principal ni como fondo dominante en pantallas de precisión operativa.
- Sombras duales: cada token es `{ web: string, native: elevation map }` — nunca definir sombras por plataforma fuera del token.
- Low-end (native): degradar vía `useDeviceTier` (generalización del quality tier de LiquidGlass); efectos Skia bajan de calidad o se apagan; Skia se carga lazy (Tier 3).
- Fallback obligatorio cuando no hay soporte de `backdrop-filter` (web).

## Checklist por PR

- [ ] ¿El efecto respeta `glass.enabled` y reduced-motion (si anima)?
- [ ] ¿El contraste se mantiene con el efecto activo sobre fondos reales (`pnpm check:contrast` si tocaste recetas glass)?
- [ ] ¿Performance aceptable en listas/dashboards densos (sin blur encadenado)?
- [ ] ¿Se usó token existente antes de crear uno nuevo?

## Anti-patterns

- Glass custom por componente con rgba hardcoded.
- Capas múltiples de blur superpuestas en una misma vista.
- Encadenar animación + blur alto + sombra intensa en componentes repetidos.
