# ADR-011 — Charts: Recharts (web) + victory-native XL (native)

- **Estado**: aceptada · 2026-07-14 (C2-Q7)
- **Contexto**: P3 fija Recharts (tfv ya lo usa); P2 dejaba "Victory Native / Skia" abierto. Verificado: victory-native 41 (XL) está construido sobre Skia + Reanimated — exactamente el stack native de Nebula, sin motor de render adicional.
- **Decisión**: wrappers de Nebula con **contrato de props unificado de charts** (`data/series/axes/tooltip/legend` + theming por tokens) sobre Recharts 3.9 (web) y victory-native 41 (native). Ambos aislados en subpaths (`@stellaria/nebula-web/charts`, `@stellaria/nebula-native/charts`) para no tocar el bundle base.
- **Alternativas**: Skia puro (control total; meses de trabajo en ejes/escala/tooltips); gifted-charts (menos flexible); unificar en un solo motor (no existe uno bueno cross-platform).
- **Consecuencias**: la API pública es de Nebula — cambiar el motor subyacente en el futuro no rompe consumidores; SparkLine/TrendIndicator se implementan ligeros (sin arrastrar el motor completo).
