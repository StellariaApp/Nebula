# ADR-008 — Iconos: lucide dual-plataforma + registry extensible

- **Estado**: aceptada · 2026-07-14 (C2-Q3)
- **Contexto**: tfv tiene set SVG propio (Icon + IconsKeys); fonicredito usa @expo/vector-icons — dos mundos incompatibles. Nebula necesita `icon="nombre"` unificado W/N con tree-shaking. Verificado: lucide-react y lucide-react-native ambos en 1.24 (paridad exacta de set y versión).
- **Decisión**: `@stellaria/nebula-icons` publica el componente `Icon` + un **registry** tipado: lucide como set base y API `registerIcons({...})` para que cada app/marca añada sus SVG propios (los de tfv se registran ahí). El tipo `IconName` se amplía por module augmentation.
- **Alternativas**: set propio (proyecto completo de diseño/build/versionado); sets distintos por plataforma (rompe API unificada y paridad visual); @tabler/icons (solo web de primera clase).
- **Consecuencias**: los componentes core referencian iconos por nombre del registry (nunca importan lucide directamente); el registry hace resolución perezosa para conservar tree-shaking; los playgrounds muestran la galería del registry activo.
