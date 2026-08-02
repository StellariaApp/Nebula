# nebula-tools-render-measure

Mide el **catálogo renderizado** por tema: color resuelto, geometría, relaciones de luminancia y área
de impacto. Es el instrumento con el que se hicieron las ocho auditorías de WR2
(`docs/reviews/visual-audit/`) y con el que se verificaron los tramos T0 y T4 del plan de alineación.

Complementa a `tools/figma-measure/`, que mide **los PNG exportados de Figma**. Uno mide el diseño;
este mide lo que sale del navegador.

## Uso

```bash
# 1. construir y servir el Storybook estático
pnpm --filter playground-web build
cd apps/playground-web && npx http-server storybook-static -p 6011 --silent

# 2. medir, en otra terminal
cd tools/render-measure
node measure.mjs layout-paper--composition "[class*='Paper_paper']"
node measure.mjs data-display-primitives--keys "[class*='Kbd_kbd']"
```

Variables de entorno:

- `NEBULA_SB_URL` — por defecto `http://127.0.0.1:6011/iframe.html`.
- `NEBULA_THEMES` — por defecto los cuatro oficiales, separados por coma.

Los ids de story salen de `apps/playground-web/storybook-static/index.json`.

## Qué devuelve, y por qué cada campo

| Campo                             | Para qué sirvió                                                                                   |
| --------------------------------- | ------------------------------------------------------------------------------------------------- |
| `height` / `width`                | Verificar que una altura cae en un peldaño de `sizes.control`/`compact`                           |
| `fontSize`                        | El suelo de 12 px de `docs/06` §2                                                                 |
| `background` + `ratio`            | El escalón entre superficies (§5) y el separador (§5.2)                                           |
| `backgroundImage`                 | **Imprescindible**: sin esto, un tema con gradientes da falsos positivos — ver la trampa de abajo |
| `borderTop` · `shadow` · `radius` | La escalera de elevación de §5                                                                    |
| `zIndex`                          | Si el apilamiento sale del contrato o de un literal                                               |
| `hitMinWidth`                     | El objetivo táctil de 24 px CSS cuando se implementa con `::after`                                |

## Tres trampas que ya costaron un falso positivo

1. **Medir `background-color` sin mirar `background-image`.** En `playful` varias superficies se
   pintan con gradiente: el color computa a `rgba(0,0,0,0)` y parece que no hay fondo. Costó dos
   falsos hallazgos en WR2.7.
2. **Medir el nodo equivocado en un compound.** El rango del `Calendar` se pinta en el `<td>`
   envolvente, no en la celda interior; `Segment` declara la altura en el control, no en el tab.
   Mirar el `.css.ts` antes de elegir el selector.
3. **`backdrop-filter` y `filter` no son medibles aquí.** El headless los neutraliza: un
   `blur(16px)` puesto inline computa a `blur(0px)`. Para el cristal hace falta un navegador con GPU.

## Lo que este instrumento no hace

**No mira.** Mide el render, que no es lo mismo. Ritmo, alineación óptica y si una composición «se
lee» siguen necesitando ojos — es el paso 1 del método de WR2, y ninguna de las ocho familias lo
ejecutó.
