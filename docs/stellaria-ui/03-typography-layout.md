# 03. Tipografía, espaciado y layout

## Familias

| Rol               | Preferida                | Fallback                    |
| ----------------- | ------------------------ | --------------------------- |
| Display           | Geist / Inter            | Segoe UI, Arial, sans-serif |
| UI y texto        | Geist / Inter            | Segoe UI, Arial, sans-serif |
| Datos y microcopy | DM Mono / JetBrains Mono | monospace                   |

Usar una sola familia sans por producto. La fuente mono es una herramienta de jerarquía, no una segunda identidad.

## Escala tipográfica

| Rol               | Tamaño                   | Line-height | Tracking  | Uso                   |
| ----------------- | ------------------------ | ----------- | --------- | --------------------- |
| `display.hero`    | `clamp(52px,5.2vw,62px)` | `.94`       | `-.055em` | Promesa principal     |
| `display.section` | `clamp(38px,4.5vw,60px)` | `1.02`      | `-.055em` | Título de sección     |
| `display.compact` | `clamp(36px,4.2vw,42px)` | `1.02`      | `-.05em`  | Sección compacta      |
| `heading.lg`      | `30px`                   | `1.1`       | `-.045em` | Panel destacado       |
| `heading.md`      | `24px`                   | `1.2`       | `-.04em`  | Card principal        |
| `heading.sm`      | `19px`                   | `1.25`      | `-.035em` | Card secundaria       |
| `body.lead`       | `17px`                   | `1.7`       | normal    | Lead de hero          |
| `body.md`         | `14px`                   | `1.7`       | normal    | Copy general          |
| `body.sm`         | `12–13px`                | `1.55–1.65` | normal    | Cards y ayuda         |
| `label`           | `10–11px`                | `1.3`       | `.04em`   | Estados, controles    |
| `eyebrow`         | `10px`                   | `1.3`       | `.16em`   | Apertura de sección   |
| `legal`           | mínimo `10px`            | `1.6`       | normal    | Condiciones y notas   |
| `micro`           | mínimo `9px`             | `1.3`       | `.04em`   | Índices no esenciales |

## Reglas de legibilidad

- Ningún control interactivo debe usar menos de `10px`.
- Body, ayuda o contenido necesario para decidir: mínimo `12px`.
- Notas legales: mínimo `10px`, contraste suficiente y line-height `1.6`.
- El tamaño `9px` se reserva para índices, decoraciones y metadata prescindible.
- No usar `8px` en producto final salvo dentro de un mockup reducido que represente otra interfaz.
- La longitud cómoda es de `45–75` caracteres por línea.
- Evitar más de cuatro líneas continuas en una card.

## Pesos

- `400`: texto general.
- `500`: labels y mono.
- `600–650`: botones, navegación y énfasis.
- `700–800`: titulares y métricas.
- Evitar pesos ligeros sobre fondos oscuros.

## Jerarquía editorial

Una sección estándar contiene:

1. Eyebrow.
2. Título declarativo.
3. Aclaración breve o evidencia.
4. Contenido principal.

El eyebrow clasifica; el título vende la idea; el copy la explica. No repetir la misma frase en los tres niveles.

## Contenedores

| Contexto          | Ancho máximo |
| ----------------- | ------------ |
| Landing estándar  | `1180px`     |
| Hero con preview  | `1400px`     |
| Bloque de precios | `1080px`     |
| Texto editorial   | `680–800px`  |
| Modal de lectura  | `560–680px`  |

Padding horizontal recomendado:

- Desktop: `28px`.
- Tablet: `24px`.
- Mobile: `20px`.

## Grid

- Base de composición desktop: 12 columnas conceptuales.
- Las cards de capacidades pueden usar 6 columnas técnicas: `2 + 2 + 2`, seguido de `3 + 3`.
- Grids de contenido repetitivo: máximo cuatro columnas en desktop.
- No repetir más de dos secciones consecutivas con el mismo patrón de cards.
- Usar `minmax(0, 1fr)` para prevenir overflow.

## Ritmo vertical

- Sección estándar: `120px` arriba y abajo.
- Sección compacta: `90px`.
- Título a contenido: `36–48px`.
- Eyebrow a título: `18px` o menos si comparten bloque.
- Card: padding `20–28px`.
- Separación de cards: `12–20px`.

## Breakpoints de referencia

| Breakpoint   | Comportamiento                                    |
| ------------ | ------------------------------------------------- |
| `>1120px`    | Hero split y previews con perspectiva             |
| `681–1120px` | Hero en una columna, preview limitado a `720px`   |
| `<=980px`    | Navegación desktop oculta; grids reducidos        |
| `<=680px`    | Una columna, padding `20px`, controles full-width |

Los breakpoints pertenecen al sistema, no al producto.

## Responsive

- El contenido mantiene la jerarquía; no solo reduce tamaños.
- Los layouts split pasan a una columna antes de que el copy se comprima.
- Los controles segmentados ocupan todo el ancho en mobile.
- Los previews eliminan perspectiva compleja en tablet/mobile.
- Los elementos flotantes respetan `env(safe-area-inset-bottom)`.
- En mobile, banners y controles flotantes no deben superponerse.

## Densidad

La librería debe admitir `comfortable` y `compact`.

- `comfortable`: marketing, onboarding y producto general.
- `compact`: tablas, dashboards y herramientas operativas.

La densidad modifica padding y gap, no la escala tipográfica mínima ni el tamaño de targets.
