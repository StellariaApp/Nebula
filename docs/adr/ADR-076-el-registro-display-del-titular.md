# ADR-076 — El registro display del titular

- **Estado**: **aceptada** · 2026-08-02 — tramo B4 del plan de marca
- **Resuelve**: **D5** de
  [`brand-alignment-plan-2026-08-02.md`](../reviews/brand-alignment-plan-2026-08-02.md): el titular de
  una landing es un registro tipográfico propio, y el `h1` del sistema no lo puede ser.
- **Amplía**: `ThemeFont` en `@stellaria/nebula-tokens` con `display`, y `Hero size="xl"` lo consume.
- **Enmienda**: `docs/06` §2.2, que declara `TypographyStylesProvider` **el único** componente con
  escala propia.

## Contexto

Medido sobre la landing, el titular del `Hero` en `xl` rendía **40 px fijos** en 1600, 1280, 900 y
600 px de ancho, con interlineado 1.2 y tracking `normal`. La referencia de marca pide
`clamp(52px, 5.2vw, 68px)`, `line-height: 0.94` y `letter-spacing: -0.055em`.

Dos correcciones a la premisa del plan, que hablaba de «48 px fijos contra 52-68 fluidos»:

1. **Son 40, no 48.** `Hero.titleSize.xl` usaba `font.size.h2`, no `h1`. La distancia era mayor.
2. **El tracking rendía `normal`, no `tight`.** `docs/06` §2.1 reserva `letterSpacing.tight` a
   `h1`–`h3`, pero eso describe a `Title`; el titular del `Hero` no pasaba por ahí.

## Decisión

**El display es un registro, no tres tokens sueltos.** `font.display` agrupa las tres magnitudes:

```
size: "clamp(3.25rem, 5.2vw, 4.25rem)"   lineHeight: 0.95   letterSpacing: -0.055
```

Van juntas porque juntas definen un registro: un titular a 68 px con el interlineado de cuerpo no es
el mismo registro con otro tamaño, es otra cosa. Separarlas invitaría a mezclar el tamaño de display
con el tracking de producto.

**No toca la escala de producto.** `h1` sigue en 48 px y `letterSpacing.tight` en -0.03. Los 158
componentes del catálogo no se enteran: el registro existe **al lado**, y hoy lo consume un único
sitio, `Hero size="xl"`.

**El tamaño es la única magnitud del contrato que es una cadena.** El resto de `font.size` son
números que el runtime convierte a `px`. La fluidez no se puede expresar con un número, y meter un
`clamp()` dentro de `font.size` obligaría a que **toda** la escala aceptara cadenas — es decir, a que
cualquier tema pudiera hacer fluido el `body2`. El registro aparte contiene esa puerta a un solo
sitio.

## Alternativas

- **Hacer `h1` fluido.** Descartada: `h1` es el título de página de **todo** el catálogo, incluido el
  dashboard, y un tamaño que depende del viewport en una vista de datos es ruido. Además D5 dice
  explícitamente que el titular de marca es un registro propio.
- **Subir `Hero.titleSize.xl` de `h2` a `h1`.** Cierra la mitad del hueco —40 → 48— y no resuelve ni
  la fluidez ni el tracking. Es el arreglo que parece suficiente hasta que se mide.
- **Tres tokens sueltos** (`size.display`, `lineHeight.display`, `letterSpacing.display`). Descartada
  por lo dicho arriba: reparte un registro entre tres escalas que se calibran por separado.

## Consecuencias

- **Verificado sobre el render**, en cuatro anchos:

  | Ancho |   Tamaño | Interlineado | Tracking |
  | ----: | -------: | -----------: | -------: |
  |  1600 |    68 px |  64.6 (tope) | -3.74 px |
  |  1280 | 66.56 px |     63.23 px | -3.66 px |
  |   900 |    52 px | 49.4 (suelo) | -2.86 px |
  |   600 |    52 px |      49.4 px | -2.86 px |

- **`docs/06` §2.2 deja de ser cierto tal cual**: ya hay dos registros fuera de §2.1, y por motivos
  opuestos. `TypographyStylesProvider` se aparta **hacia la lectura** —más interlineado, misma
  escala—; `display` se aparta **hacia el impacto** —más tamaño, menos interlineado, más tracking—.
  Que las dos excepciones tiren en direcciones contrarias es lo que confirma que §2.1 es el centro.

- **El suelo de 52 px se mantiene hasta 1000 px de ancho.** En phone el titular ocupa mucho, y es
  deliberado: es la medida de marca. Si algún producto lo quiere menor, es un tema quien lo baja.

- **Ningún gate lo cubre.** `check:contrast` no mira tamaños y `size-limit` no ve una cadena de más en
  el contrato. Lo verifica la medición del render de arriba, y B6 lo pondrá a prueba de verdad.
