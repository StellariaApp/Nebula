# ADR-004 — Motion: `motion` v12 (web) + Reanimated 4 (native)

- **Estado**: aceptada · 2026-07-14 (C2-Q5) · Resuelve la contradicción de Stellaria ("VE + Emotion" en frontend-development-plan.md era una errata: Emotion es CSS-in-JS runtime, contrario al pilar zero-runtime)
- **Contexto**: se requieren springs, layout animations y gestos con motion tokens compartidos entre plataformas. `motion` 12.42 es el sucesor oficial de framer-motion (mismo motor); tfv ya usa `motion` v12. Native ya está en Reanimated 4.5 + Gesture Handler 3 (Stellaria y fonicredito).
- **Decisión**: web `motion` v12 (import por feature); native Reanimated 4 + Gesture Handler 3 + worklets. Los motion tokens del theme (`duration/easing/spring`) alimentan ambos motores con los mismos números.
- **Alternativas**: framer-motion (mismo código, nombre legacy); CSS+WAAPI puro (insuficiente para "motion alto controlado"); react-spring (menor momentum).
- **Consecuencias**: regla de hot paths solo transform/opacity (03 §2); reduced-motion obligatorio en ambos motores; los springs se definen una vez en el theme.
