---
name: tokens-governance
description: Gobernanza de @stellaria/nebula-tokens — contrato NebulaTheme cerrado, paletas generadas, roles semánticos y checklist de PR de tokens.
---

# Gobernanza de tokens (`@stellaria/nebula-tokens`)

## Reglas

- Toda decisión visual base nace en `@stellaria/nebula-tokens`; el contrato `NebulaTheme` (docs/02 §2) es **cerrado** — cualquier cambio de forma requiere ADR.
- Separación estricta **primitivas vs roles semánticos**: las paletas (`palettes.*`) son identidad; los componentes SOLO leen roles (`colors.surface.raised`, `colors.text.muted`, `sizes.control.md`, `motion.spring.default`).
- Las paletas 50–950 **se generan, no se editan**: `pnpm gen:palette regen` (OKLCH, ADR-009). `palettes.ts` lleva header de "archivo generado" — tocarlo a mano está prohibido.
- No hardcodear colores, spacing, radius, sombras ni duraciones fuera de tokens (regla de lint propia en fases posteriores).
- Token nuevo ⇒ nombre semántico claro + uso esperado documentado; breaking de naming ⇒ ADR.
- `@stellaria/nebula-tokens` mantiene **cero dependencias de runtime** (ADR-014) — el Zod schema vive en `nebula-themes`.

## Checklist por PR de tokens

- [ ] ¿El cambio vive en `packages/tokens` y no en web/native/app?
- [ ] ¿`src/__checks__/contract.test-d.ts` sigue verde (Keys* ≡ keyof Props; tema de ejemplo compila)?
- [ ] ¿`pnpm check:contrast` sigue verde?
- [ ] ¿Los temas oficiales/presets (light/dark/sober/playful) siguen consistentes?
- [ ] ¿Sin aliases redundantes para el mismo token?
- [ ] ¿Exportado en el barrel correspondiente con especificador ESM `.js`?

## Anti-patterns

- Crear variantes visuales por componente cuando el problema es de token o de `variantMap`.
- Tokens ad-hoc sin categoría (`newBlue`, `hover2`).
- Duplicar tokens equivalentes para web y native (las sombras duales viven en UN token `DualShadow`).
