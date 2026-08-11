# ADR-111 — Hero y Section a compound

- **Estado**: aceptada · 2026-08-08 (decisión del propietario) · **WN · N2** · implementada
- **Cambia API pública**: sí, y **solo añade**. Ninguna prop actual cambia de tipo ni de significado.
- Aplica el criterio de [ADR-097](ADR-097-criterio-de-compound-y-donde-viven-las-partes.md) a los dos
  casos que el informe de N2 dejó abiertos, y desbloquea sus dos filas del barrido de
  [ADR-104](ADR-104-la-ranura-se-tipa-con-el-componente-que-la-pinta.md).

## Contexto

ADR-097 fija el criterio: **es compound si el consumidor necesita reordenar o sustituir sus partes;
si solo necesita rellenarlas, bastan props de ranura**. El informe de N2
([`wn-n2-candidatos-a-compound`](../reviews/wn-n2-candidatos-a-compound-2026-08-05.md)) midió los
siete candidatos del catálogo y dejó a `Hero` y `Section` como los únicos dos que lo cumplen, con la
conversión pendiente de decisión del propietario.

Lo que ninguno de los dos puede expresar hoy:

- **`Hero`** pinta en orden fijo `left → hiper → title → subtitle → description → children → actions
→ right → bottom`. Ocho ranuras con nombre alrededor de un `children` que cae **en medio**, así que
  no sirve de escape. Un consumidor que quiera las acciones sobre la descripción, o el `hiper` bajo
  el título, forkea.
- **`Section`** pinta `title → description → actions` en su cabecera. Las acciones van siempre
  después de la descripción, y **las acciones a la altura del título** —el montaje habitual de una
  vista de datos— no se puede escribir.

Las dos son composiciones editoriales: el orden lo decide quien diseña la página, no la semántica.
Es exactamente el caso que ADR-097 manda resolver con compound.

## Decisión

**Las props siguen siendo el montaje por defecto; las partes son la vía para reordenarlo.**

El componente recorre sus hijos, coloca en su región las partes que reconoce y deja el resto donde
hoy cae `children`. Sin partes, el comportamiento es idéntico al actual.

No es un patrón nuevo: es el de `Footer`, que ya reparte con `child.type === FooterLegal` y manda
todo lo demás a las columnas.

```tsx
const legal: ReactNode[] = [];
const columns: ReactNode[] = [];
Children.forEach(children, (child) => {
  if (isValidElement(child) && child.type === FooterLegal) legal.push(child);
  else if (child !== null && child !== undefined && child !== false) columns.push(child);
});
```

### Las partes

`Hero` — el marco sigue siendo props (`image`, `variant`, `size`, `align`, `contentWidth`); lo que se
abre es el cuerpo y las tres regiones:

```
Hero.Hiper · Hero.Header · Hero.Title · Hero.Subtitle · Hero.Description
Hero.Actions · Hero.Left · Hero.Right · Hero.Bottom
```

`Section` — la cabecera y las dos regiones; el cuerpo es lo que no se reconoce:

```
Section.Header · Section.Title · Section.Description · Section.Actions
Section.Aside · Section.Footer
```

> [ADR-124](ADR-124-el-cuerpo-de-la-seccion-se-sustituye-y-el-carril-no.md) añade a esa lista
> `Section.Body`, que sustituye el envoltorio del cuerpo. El carril se queda interno.

### `Hero.Header` no es relleno

Es lo que agrupa título, subtítulo y descripción con su espaciado, y es además **la prueba de que el
diseño es honesto**: la rama de props renderiza por dentro ese mismo montaje, así que no hay dos
maquetas que mantener ni una que pueda divergir de la otra.

### El `id` del título va por contexto

Hoy los dos generan el `id` del título y lo enganchan al `aria-labelledby` de la región. Con el
título como hijo, **la raíz ya no sabe su `id`**. La raíz lo genera y lo provee por contexto, y
`Hero.Title` / `Section.Title` lo consumen y lo ponen en su elemento — el mecanismo que ya usan
`AppShell` y `Segment`.

Es el único punto donde esto puede romperse en silencio: un título sin `id` deja la región sin nombre
accesible y nada falla visualmente. Va con test de a11y explícito, por el mismo motivo por el que el
de `Modal` cazó el `aria-labelledby` invertido durante N3.

### Dónde viven

En `Hero/components/` y `Section/components/`, con nombre pelado y símbolo con prefijo, compuestas
con `Object.assign` en su `index.ts` — ADR-097 §2, sin excepciones.

## Consecuencias

- **Cierra las dos filas de N3, y con cero ranuras.** `Hero` (12 nodos) y `Section` (9) esperaban
  esta decisión porque el montaje decide dónde caen las ranuras. Medido después de convertirlas: **no
  hace falta ninguna**. Los nueve nodos con nombre de `Hero` y los seis de `Section` son ahora la raíz
  de una parte, y lo que queda es la raíz, los envoltorios estructurales (`body`, `rail`) y la imagen
  de fondo con su velo, que ya gobiernan `image` y `overlayOpacity`. Es el resultado más limpio del
  barrido: el compound no reduce las ranuras, las hace innecesarias.
- **No rompe a nadie.** El reparto solo extrae lo que reconoce. Los tres usos del monorepo
  —`Landing.stories`, `Shell.stories` y `Patterns.test`— siguen igual sin tocarlos, y sirven de
  prueba de no regresión.
- **No cuesta RSC**: los dos ya son `"use client"`.
- **Coste medido**: `Hero` 24,5 → 25,75 kB brotli (medido 25,3) y `Section` sin moverse dentro de sus
  48 kB. Las dos entradas de `size-limit` pasan a apuntar a su `index.js`, que es lo que importa un
  consumidor de un compound, como ya hacían `Footer` y `Table`.
- **Entra dentro de WN, no después de W5.** WN declaró que no añade catálogo, y esto no lo añade:
  son partes de dos componentes que ya existen. Publicar v1 sin ello significa publicar dos
  componentes que obligan a forkear para algo tan corriente como subir las acciones, y el montaje es
  precisamente lo que no se puede cambiar barato después.

## Alternativas descartadas

**Que `children` sustituya al cuerpo entero.** Más simple de explicar, pero rompe: hoy `Hero` pinta
`children` en medio del cuerpo y `Section` lo usa como contenido, así que cualquiera que pase título
y `children` a la vez cambiaría de maqueta al actualizar.

**Dejarlo en props de ranura.** Es lo que hay, y es lo que el informe de N2 midió como insuficiente:
una ranura rellena un nodo, no lo mueve de sitio.
