# ADR-003 — React Aria hooks como capa de comportamiento/a11y web

- **Estado**: aceptada · 2026-07-14 · **Supersede** la decisión "Sin Radix UI: HTML nativo + ARIA manual" de `phase-3-ui-web-components.md` (aprobado explícitamente por el propietario)
- **Contexto**: WCAG 2.2 AA estricto con ~40 componentes de overlay/combobox/menu/grid por construir desde cero, la librería web parte de código cero, y el consumidor web actual (tfv) delega hoy TODA su a11y en Mantine. Implementar focus management, roving tabindex y patrones APG a mano es el mayor riesgo de a11y del proyecto.
- **Decisión**: hooks de React Aria (react-aria 3.50; por-hook, tree-shakeable) como motor de comportamiento y ARIA. Sin estilos ni DOM impuesto → identidad visual 100% propia con VE + motion. HTML nativo (`<dialog>`, `<details>`) donde baste; Floating UI llega vía los propios hooks.
- **Alternativas**: (a) headless propio + Floating UI — control y bundle máximos, coste/riesgo AA inaceptable a esta escala; (b) Base UI (equipo Radix/MUI) — styleless pero impone DOM y es más joven; (c) Radix — estilos neutros pero componentes completos, menos control.
- **Consecuencias**: la "capa de comportamiento" de la anatomía web (01 §4) es React Aria; los tests de teclado validan contra APG; se mantiene el espíritu de la decisión original (sin kit visual de terceros).
