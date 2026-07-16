# Prompts TC — Theme Creator (pista paralela)

> 3 prompts secuenciales. **Paralelizable**: TC.1 puede arrancar en cuanto W1 cierre; TC.2 tras W2; TC.3 tras W4. No bloquea la publicación W5.

---

## Prompt TC.1 — MVP del editor

```
Actúa como desarrollador full-stack del Theme Creator en C:\Users\Skr13\Documents\GitHub\Nebula.
Estado requerido: W1 cerrado (temas + runtime web + primeros componentes reales).

LEE ANTES (vinculante): docs\02-theming.md §5 (spec funcional COMPLETA — tu alcance es exactamente
ese, sin features extra: riesgo #6 del roadmap es scope creep), docs\02 §2 (contrato NebulaTheme),
packages\themes (schema y temas reales).

MISIÓN — apps/theme-creator (Next 16):
1. Editor por secciones del contrato (color/tipografía/geometría-densidad/motion/efectos) con
   controles adecuados por tipo de token (sliders de radius/densidad, selector de motion.tier…).
2. Preview en vivo: galería con los componentes REALES de @stellaria/nebula-web disponibles hasta
   ahora (Button, inputs, Card…), renderizados con el tema en edición vía inyección runtime de vars
   (el mecanismo de W1.2), con toggle light/dark y reduced-motion.
3. Export JSON (`NebulaTheme` validado con themeSchema) + snippet TS (`satisfies NebulaTheme`).
4. Import de un JSON existente para editar (round-trip).
5. Estado del editor: elige la herramienta más simple que funcione (useState/Jotai) — no añadas
   dependencias sin preguntar (ADR-014).

ACEPTACIÓN: crear→editar→exportar→importar→seguir editando funciona; el JSON exportado carga en el
playground web con loadTheme sin errores.
REPORTE: demo del flujo + qué secciones del contrato quedaron con controles básicos vs pulidos.
```

## Prompt TC.2 — Validación AA en vivo + generación de paletas

```
Actúa como desarrollador del Theme Creator en C:\Users\Skr13\Documents\GitHub\Nebula.
Estado requerido: TC.1 cerrado y W2 cerrado (catálogo Tier 1 disponible para la preview).

LEE ANTES: docs\02-theming.md §5.1/§5.3, tools\palette-gen y tools\contrast-check (REUTILIZAS sus
motores — extrae la lógica a módulos importables si siguen siendo solo CLI; no dupliques algoritmos).

MISIÓN:
1. Generación de paletas en el editor: color semilla → escala 50–950 OKLCH (motor de palette-gen),
   con edición manual de pasos individuales después.
2. Validación AA en vivo: cada par rol-texto/superficie del contrato se evalúa al editar (motor de
   contrast-check); fallos marcados inline con sugerencia de corrección automática (ajuste de L) y
   botón "aplicar".
3. Panel de resumen AA del tema completo (pares verdes/rojos) — mismo veredicto que el CI.
4. Ampliar la preview con el catálogo Tier 1 completo.

ACEPTACIÓN: un tema que pasa el panel AA del creator pasa también `pnpm check:contrast` (mismo motor,
cero divergencia); generar paleta desde semilla → aplicar a primary → preview actualiza en vivo.
REPORTE: capturas del flujo de corrección AA.
```

## Prompt TC.3 — Catálogo completo + temas reales de las apps

```
Actúa como desarrollador del Theme Creator en C:\Users\Skr13\Documents\GitHub\Nebula.
Estado requerido: TC.2 cerrado y W4 cerrado (catálogo web completo).

LEE ANTES: docs\02-theming.md §3 (temas por consumidor: NO portar valores legacy 1:1), y como
referencia de identidad visual: el theme de fonicredito
(C:\Users\Skr13\Documents\GitHub\fonicredito-app\src\theme\) y los tokens de tfv
(C:\Users\Skr13\Documents\GitHub\tfv-frontend\packages\themes\) — solo para capturar carácter
(hues de marca, sensación), no para copiar hex.

MISIÓN:
1. Preview con el catálogo web COMPLETO organizado por categorías (incluye efectos/glass — respeta
   guardrails), con búsqueda de componente.
2. Crear y guardar en @stellaria/nebula-themes los temas reales `fonicredito` y `tfv-gold` usando el
   creator (dogfooding — gate de TC): semillas desde los colores de marca de cada app, AA en verde.
3. Pulido de UX del creator (undo/redo básico, comparación lado a lado de 2 temas si es barato).
4. CIERRE DE TC: docs\tc-closure.md con el gate (round-trip + temas reales creados).

ACEPTACIÓN: `fonicredito` y `tfv-gold` exportados, validados AA, cargando en playground web; el
creator queda listo para acompañar el lanzamiento de W5.
REPORTE: cierre + feedback de dogfooding (fricciones del contrato NebulaTheme descubiertas al usarlo).
```
