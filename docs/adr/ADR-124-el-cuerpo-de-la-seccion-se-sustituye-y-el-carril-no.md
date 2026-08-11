# ADR-124 — El cuerpo de la sección se sustituye y el carril no

- **Estado**: aceptada · 2026-08-10 (decisión del propietario) · **WN** · implementada
- **Cambia API pública**: sí, y **solo añade**: `Section.Body` / `SectionBody`. Ninguna prop actual
  cambia de tipo ni de significado, y el DOM sin partes es idéntico al de hoy.
- Completa la lista de partes de
  [ADR-111](ADR-111-hero-y-section-a-compound.md) aplicando el criterio de
  [ADR-097](ADR-097-criterio-de-compound-y-donde-viven-las-partes.md).

## Contexto

ADR-111 abrió la cabecera de `Section` y dejó el cuerpo fuera: es «lo que no se reconoce». Sus dos
envoltorios estructurales —el carril y el cuerpo— se quedaron como `div` anónimos dentro de
`Section.tsx`, y el propio ADR los nombra al medir el resultado: «lo que queda es la raíz, los
envoltorios estructurales (`body`, `rail`) y la imagen de fondo».

Al extraerlos a `Section/components/` para limpiar el JSX aparecieron los dos como candidatos a parte
pública, y no son el mismo caso.

**El cuerpo sí lo es.** Un consumidor que quiera aire propio o un fondo en el cuerpo —`p="lg"`,
`bg="surface"`— hoy no tiene dónde ponerlo: la única superficie que le queda son las style props de
la raíz, que pintan **la banda entera**, no el carril. Es exactamente lo que ADR-097 llama sustituir
una parte.

**El carril no.** Es la geometría de la banda —`max-width`, `margin-inline`, `padding-inline` y el
divisor— y ya existe público en el catálogo como `Container`. Su gemelo `Hero` tampoco expone el
suyo, y ADR-111 los trató a los dos como una sola anatomía a propósito.

## Decisión

### `Section.Body` entra en el reparto como región sustituible

El mapa de regiones reconoce ahora tres partes. Sin un `Section.Body` entre los hijos, la raíz
envuelve los sueltos en el suyo, como siempre; con él, **el envoltorio es el del consumidor**.

```tsx
<Section title="Movimientos">
  <Section.Body p="lg">
    <Table />
  </Section.Body>
</Section>
```

Lo que **no** delega la raíz al ceder el envoltorio:

- `error` y `empty` siguen sustituyendo su **contenido** —el cuerpo es el envoltorio, no el estado—.
- El velo de `loading` sigue tendiéndose **por dentro**: se ancla al `position: relative` del cuerpo,
  así que fuera no velaría nada.

Por eso la raíz **clona** el elemento del consumidor en vez de renderizarlo tal cual: es la única
forma de conservar sus props y su identidad y seguir inyectando el velo donde tiene que ir. Es el
mismo principio que `Hero.Header` en ADR-111 —una sola maqueta, no dos que puedan divergir—, solo que
aquí la maqueta compartida es el envoltorio y no su contenido.

Dos reglas para los bordes, ambas deterministas: lo que quede suelto entra en el cuerpo propio detrás
de lo que el consumidor puso dentro, y con dos `Section.Body` manda el primero y el segundo pasa a
ser contenido suyo.

### El carril se queda interno

`Section/components/Rail.tsx` existe —el JSX de la raíz se lee mejor así— pero **no** entra en el
`Object.assign` ni en el barrel. `SectionRailProps` vive en `Section.types.ts` porque ahí viven los
contratos del directorio, sin reexportarse.

Publicarlo tenía tres costes y ningún caso de uso que `Container` no cubra: duplicaba el carril
público del catálogo, rompía la simetría con `Hero`, y anidado dentro de una `Section` aplicaba el
`padding-inline` dos veces, que es un error silencioso —el contenido sale más estrecho y nada falla—.

### Las partes de `Section`, cerradas

```
Section.Header · Section.Title · Section.Description · Section.Actions
Section.Aside · Section.Body · Section.Footer
```

## Consecuencias

- **No rompe a nadie**: sin `Section.Body` entre los hijos el reparto y el DOM son los de hoy, y los
  34 tests de `Section/__tests__/Patterns.test.tsx` lo fijan —incluido el que compara el DOM del
  camino de props contra el de partes—.
- **El cuerpo propio va con test de estado explícito**: que `loading` vele por dentro y que `error`
  sustituya su contenido son justo lo que se pierde en silencio si alguien cambia el clonado por un
  render directo.
- **Sin coste de tamaño**: son dos módulos de envoltorio que ya se renderizaban; `Section` no se mueve
  de su presupuesto.
- **Hero no cambia**: su cuerpo sigue interno. Si algún día se abre, se abre con este mismo contrato.

## Alternativas descartadas

**Dejar `Section.Body` como envoltorio suelto** (lo que hacía la primera versión: la raíz genera el
suyo y el del consumidor se anida dentro). El nombre promete sustitución y no la cumple: dos `div` de
cuerpo, el `p="lg"` en el de dentro y el velo anclado al de fuera.

**Que la raíz lea los props del elemento y renderice ella el cuerpo** en vez de clonar. Mismo DOM,
pero desmonta el elemento del consumidor y hay que reimplantar props a mano; clonar es la API de
React para esto.

**Publicar el carril y añadirle un `Hero.Rail`** para mantener la simetría. Es más superficie pública
y dos formas de pedir lo mismo, con `Container` ya en el catálogo.
