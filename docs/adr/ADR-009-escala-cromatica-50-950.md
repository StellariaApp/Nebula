# ADR-009 — Escala cromática 50–950 (11 pasos)

- **Estado**: aceptada · 2026-07-14 (C2-Q4) · Resuelve la contradicción docs (50–950) vs código Stellaria (100–900)
- **Contexto**: `style-system-research.md` cerró 50–950, pero `tokens/colors.ts` implementó 100–900 en 16 paletas. Los extremos 50/950 son valiosos para superficies sutiles en light/dark; 11 pasos es el estándar de facto (Tailwind/Radix).
- **Decisión**: Nebula adopta **50–950**. Las 16 paletas se regeneran con `tools/palette-gen` (OKLCH, a partir de color semilla); el Theme Creator usa el mismo generador.
- **Alternativas**: mantener 100–900 (cero rework pero contradice la decisión escrita y pierde extremos).
- **Consecuencias**: la migración de tokens de Stellaria NO es copy-paste en colores (sí en tipografía/motion/effects); los roles semánticos (02 §2) aíslan a los componentes del cambio de escala — solo el mapa rol→paso se ajusta.
