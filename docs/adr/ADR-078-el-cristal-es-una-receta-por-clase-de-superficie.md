# ADR-078 — El cristal es una receta por clase de superficie

- **Estado**: **aceptada** · 2026-08-02 — tramo B2 del plan de marca
- **Resuelve**: **D1** y **D2** de
  [`brand-alignment-plan-2026-08-02.md`](../reviews/brand-alignment-plan-2026-08-02.md). Una sola
  receta de cristal servía a un chrome de ancho completo y a un botón de 48 px.
- **Amplía**: `GlassLevel` con `control`, y `ResolveVariant` acepta la clase de la superficie.
- **Depende de**: el método de cierre decidido en §5.5 del plan — propiedad computada como gate, ojo
  humano como veredicto.

## Contexto

Medido sobre la landing, el nav y el botón `variant="glass"` emitían **exactamente el mismo
material**: `rgba(15,17,25,0.66)` + `blur(16px) saturate(1.4)`. Es la receta pensada para una card de
400 px aplicada a un control de 48 px de alto, donde **no hay área que desenfocar** y el tinte al 66 %
se lee como relleno.

El primer intento —bajar los dos a `subtle`— quitó fuerza pero no resolvió el fondo: seguían
compartiendo receta, solo que más floja. El defecto no era la intensidad, era que **la intensidad la
elegía la variante y no la clase de superficie**.

## Decisión

**Tres clases, tres recetas.** El cristal deja de ser un nivel de intensidad para ser una propiedad de
qué clase de superficie lo lleva:

| Clase          | Receta          | Quién                    |
| -------------- | --------------- | ------------------------ |
| **control**    | `glass.control` | `Button`, `ActionIcon`   |
| **superficie** | `glass.subtle`  | `Card`, `Paper`          |
| **chrome**     | `glass.default` | `Nav`, `Header` flotante |

`glass.control` sigue la receta que D2 extrajo de Rosette: velo muy tenue con borde marcado y
desenfoque corto —en dark, `rgba(255,255,255,0.05)`, borde al 10 %, `blur(4px)`—. A 48 px de alto lo
que separa el control del fondo es el **borde**, no el tinte.

**La clase la decide el componente, no el `variantMap`.** `ResolveVariant` acepta un parámetro de
clase y, si viene, gana sobre la receta de la variante. Sin él, un `<Card variant="glass">` y un
`<Button variant="glass">` no pueden diferenciarse: comparten entrada en el mapa de variantes.

El `variantMap` mantiene `control` como valor por defecto, que es el caso mayoritario —los controles
son lo que más usa la variante— y así los componentes de superficie son los únicos que declaran algo.

## Alternativas

- **Un cuarto nivel de intensidad** (`faint` entre `subtle` y nada). Descartada: multiplica la escala
  sin resolver el problema, porque el control seguiría eligiendo intensidad en vez de clase.
- **Que cada componente pinte su cristal a mano**, como ya hacía `Nav` leyendo `vars.glass.default`.
  Funciona y es lo que había, pero deja la receta repartida por el catálogo: es justo lo que el
  principio §0 del plan llama «el sistema no lo fijó y cada uno rellenó el hueco».

## Consecuencias

- **Verificado con el método de §5.5.** Propiedad computada sobre el render, en `nebula-dark`:

  | Clase              | Fondo                       | Desenfoque                 |
  | ------------------ | --------------------------- | -------------------------- |
  | chrome (`Nav`)     | `rgba(15, 17, 25, 0.66)`    | `blur(16px) saturate(1.4)` |
  | control (`Button`) | `rgba(255, 255, 255, 0.05)` | `blur(4px) saturate(1.2)`  |

  La tercera clase no tiene hoy una lámina que la rinda con cristal, así que se fija por test en vez
  de por render: `ResolveVariant` con clase `subtle` devuelve la receta de superficie, y las tres
  clases no comparten `backdrop-filter`. **Falta la lámina** que muestre las tres juntas; queda como
  deuda de B6.

- **El veredicto de si se lee a cristal es humano**, por la decisión de §5.5. Los números de arriba
  solo garantizan que cada clase emite lo suyo.

- **`GlassLevel` pasa de tres valores a cuatro.** Un tema de terceros que enumere los niveles a mano
  tiene que añadir `control`; el schema lo valida.

- **Un presupuesto sube**: `Badge` +94 B por la cuarta receta en el contrato.
