# Review estructural y visual — apertura W2.V

**Fecha**: 2026-07-21  
**Alcance**: tokens, temas, runtime web, pilotos W1, Layout/Typography W2, Actions/Forms en curso,
Storybook, docs y prompts.

## Veredicto

La base técnica es sólida y está por encima de la madurez visual actual. Nebula ya tiene contratos
tipados, roles semánticos, theming runtime, a11y, testing contract y budgets; lo que falta es una capa
de dirección visual verificable. Seguir agregando componentes sin esa capa multiplicaría decisiones
locales y haría más caro corregir W2 al final.

La recomendación es insertar **W2.V ahora**, antes de continuar W2.3, y usar Text, Title, Paper,
Button y FormField como conjunto de calibración transversal.

## Hallazgos

| Prioridad | Hallazgo                                 | Evidencia                                                                                                                    | Riesgo                                                                |
| --------- | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| P0        | No existe gate de composición visual     | La plantilla exige Default/Variants/Sizes/States, pero no contexto real ni comparación consistente de cuatro temas           | componentes correctos aislados que no forman productos coherentes     |
| P0        | Escala de lectura demasiado pequeña      | `body1=14`, `body2=12`, `body3=10`, `caption=8`; el roadmap ya marcaba caption como supuesto                                 | fatiga, jerarquía débil y deuda a11y/visual en todos los fields       |
| P1        | Tipografía sin defaults semánticos       | `Text.css.ts` solo fija familia/color; `Title` usa bold+tight en los seis niveles                                            | resultados distintos por herencia y una escalera de headings monótona |
| P1        | Elevación dark casi plana                | los cuatro temas consumen el mismo set de sombras negras; Paper xs–xl ofrece poca separación sobre `surface.base` dark       | overlays/cards sin profundidad y tentación de agregar glow arbitrario |
| P1        | Motion contradice sus guardrails         | Button contiene `6s`, `2800ms`, `ease-in-out`, `700ms`, `1800ms` y `0.01ms`                                                  | physics inconsistente entre componentes y temas                       |
| P1        | Spacing tiene escala, no gramática       | existen 2–64 px, pero docs no asignaban cuándo usar relación interna, grupo, sección o región                                | padding/gap elegidos por gusto local                                  |
| P2        | Fixtures visuales no siempre usan Nebula | FormField story define radius 8 y padding 8×10 libres                                                                        | la story puede ocultar incompatibilidades del sistema real            |
| P2        | Estado documental deriva                 | `docs/05` aún describe F0 “en curso”; quality-gates skill conserva budgets anteriores; algunas menciones cuentan cinco temas | sesiones futuras reciben instrucciones contradictorias                |

## Validación visual del propietario

Las capturas de ActionIcon, Button, Blockquote, la galería de Icon y FormField confirmaron que la
deuda no era solo una impresión general. W2.V adopta estos criterios verificables:

| Componente   | Evidencia observada                                                       | Criterio de corrección                                                            |
| ------------ | ------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| ActionIcon   | icono de 14 px perdido dentro del control md y dominado por el focus ring | glifo derivado al 50 % de `sizes.control`; md ≈21 px                              |
| Button       | label 14/medium con poca presencia dentro de 42 px                        | semibold + `lineHeight.normal`; cualquier cambio de altura se calibra globalmente |
| Blockquote   | atribución de 8 px y cuerpo dependiente de herencia                       | cuerpo `body1/normal`; atribución `caption/normal` de 12 px                       |
| Icon gallery | nombres de 8 px debajo de iconos de 28 px                                 | nombre `body3`, gap interno `sm` y ancho derivado de spacing tokens               |
| FormField    | label 12, ayuda/error 8 y gap uniforme de 2 px                            | label 14, ayuda/error 12 y ritmo label→ayuda→control→error de 2/8/4 px            |

## Qué está bien y debe preservarse

- Contrato único Web/Native y personalización exclusiva vía temas.
- Separación paletas/primitivas/roles y `variantMap` en runtime.
- Dark-first, identidad indigo→violet y presets sober/playful como prueba antifork.
- React Aria + Vanilla Extract + motion y el testing contract por componente.
- Budgets por módulo y disciplina de subpaths para dependencias pesadas.
- `baseLayer` para permitir style props sin romper contraste.

## Secuencia recomendada

1. Aprobar ADR-024 y usar `docs/06-visual-language.md` como baseline.
2. Crear las cinco láminas `Foundations/Visual QA` con los tokens actuales.
3. Recalibrar tipografía, Text y Title; ejecutar build/typecheck/lint/test/a11y/size.
4. Calibrar sombras por theme y superficies con Paper; ejecutar también contrast-check.
5. Sustituir motion libre de Button por tokens/múltiplos documentados.
6. Componer Actions+FormField con los inputs reales de W2.3.
7. Capturar el nuevo baseline y continuar W2.3 solo con el checklist visual activo.

## Fuera de alcance inmediato

- Añadir claves a `NebulaTheme`: solo si W2.V demuestra que las actuales no bastan; requiere ADR.
- Elegir herramienta de screenshot regression: debe compararse coste, estabilidad en Windows/CI y
  peso antes de agregar una dependencia.
- Rediseñar API de componentes W2 ya implementados: esta auditoría no autoriza cambios públicos
  oportunistas.
