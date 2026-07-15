# ADR-010 — Estado de compound components: Jotai Provider + createStore (interno)

- **Estado**: aceptada · 2026-07-14 (ratifica decisión de Stellaria en ui-native-components-progress.md)
- **Contexto**: los compuestos (Grid, Group, List, Accordion, Tabs, ThemeSwitch, LiquidGlass…) necesitan estado compartido entre Root y Subs sin re-render en cascada. Stellaria validó Jotai `Provider` + `createStore()` en 5 compuestos; ambos consumidores ya incluyen jotai en su bundle.
- **Decisión**: Jotai 2.20 como mecanismo interno de estado de compuestos en `@stellaria/nebula-web` y `@stellaria/nebula-native` (atoms por instancia vía store scoped). Es detalle de implementación: **el consumidor no interactúa con Jotai** ni lo necesita en su app.
- **Alternativas**: React Context (re-renders en cascada en compuestos grandes); Zustand (no atómico por campo); estado local + callbacks (prop drilling en compuestos profundos).
- **Consecuencias**: +~4 kB en el bundle base de cada plataforma; los overlays por id (useSheet/useModal de FC) se re-implementan sobre atom-family interna con API pública imperativa (`nebulaOverlays.open(id)`)/hooks.
