# ADR-002 — Styling: Vanilla Extract (web) + Unistyles 3 (native)

- **Estado**: aceptada · 2026-07-14 (ratifica decisión de Stellaria)
- **Contexto**: pilar de performance = zero-runtime en web y theming runtime eficiente en native. tfv ya usa VE (híbrido con Mantine); Stellaria native ya usa Unistyles 3 con Collector pattern probado en 39 componentes; fonicredito usa Unistyles 3.
- **Decisión**: web con `@vanilla-extract/css` 1.21 + `recipes` (variantes) + `sprinkles` (style props de Layout), tematizado por CSS vars (`createThemeContract`). Native con `react-native-unistyles` 3.3 (`StyleSheet.create((theme)=>…)` + `useVariants`).
- **Alternativas**: Panda CSS (similar, ecosistema menor para theme contracts duales); StyleX (theming runtime limitado); Tailwind/NativeWind (utility classes contrarias al modelo de tokens tipados); CSS Modules (sin variantes tipadas).
- **Consecuencias**: los temas se materializan como CSS vars (web) y objetos Unistyles (native) desde el MISMO JSON (ADR-006). El Collector de Stellaria se conserva en native; su equivalente web son sprinkles.
