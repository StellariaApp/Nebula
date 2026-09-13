# ADR-187 — El carril publica su desplazamiento, y la sección cuelga una cabecera que se encoge

- **Estado**: **aceptada** · 2026-09-12 — decidida por el propietario, con la alternativa recomendada · **implementada** el mismo día. Lote «Rosette → Nebula» (`docs/reviews/rosette-a-nebula-2026-09-12.md`).
- **Cambia API pública**: sí, y **solo añade**. En `@stellaria/nebula-hooks`, `useScrolled` acepta
  `scroller`. En `@stellaria/nebula-web`, `AppShell.Scroll` (parte nueva), `useAppShellScroll()` y
  dos props en `AppShell.Section`: `hanging` y `hangingHeight`.
- **Toca**: `packages/hooks/src/use-scrolled.ts`, `packages/web/src/components/AppShell/`.
- Cierra el hallazgo #6 de `prompts/6-consumidores/C2-armazon-de-producto.md` y el «hallazgo
  abierto» de `docs/07-recetas-de-producto.md` §7.2 y §7.3.

## Contexto

Tres cabeceras de Rosette se encogen al desplazar —`(dashboard)/create/header.tsx`,
`(dashboard)/avatars/sheet-header.tsx`, `(discover)/avatar/band.tsx`— y las tres leen el mismo
booleano: `ScrolledAtom`, un átomo de jotai que escribe un `Scroll` propio (`app-client.tsx`) al
escuchar `scroll` en **su propio contenedor** con umbral cero. Ese mismo `Scroll` publica su ref en
otro átomo (`RefScrollAtom`) para que el `StarField` del fondo haga parallax contra el contenedor
que scrollea en pantalla, no contra la ventana.

Nada de eso es de Rosette: es el contrato del carril. Y hoy Nebula no lo ofrece:

- `useScrolled` (`use-scrolled.ts`, 1.1.13) mide `window.scrollY` y no acepta un `scroller`. En el
  montaje de carril el que scrollea es el `<main>` (`overflowY: auto`, `AppShell.css.ts:45`) o, si
  el producto reserva el pie fuera del scroll como hace Rosette, un `Scroll` dentro de él. La
  ventana no se mueve nunca, así que el hook devuelve `false` para siempre.
- `AppShell` publica por contexto `{ collapsed, navigationLabel, complementaryLabel, railCollapse }`
  (`AppShellContext.ts`) y nada sobre el desplazamiento.
- `AppShell.Header` no tiene estado compacto, y `AppShell.Section` no sabe colgar nada.

El patrón de la cabecera que se encoge tiene además una regla medida que un producto tiene que
redescubrir a golpes (bug de Rosette del 11/09/2026): **cuelga en `absolute` de la sección pegada,
fuera del flujo**, con un máximo cuando está entera y sin mínimo encogida, y **es el cuerpo quien
reserva el máximo** con padding. En flujo, encogerse le quitaba 80 px al alto del scroll; con
contenido corto el `scrollTop` volvía a cero, la banda crecía y el siguiente gesto la encogía: un
bucle de parpadeo. Un segundo producto que copie `sheet-header.tsx` sin leer su comentario lo
repite.

## Decisión

Tres piezas, cada una en su paquete y por su orden.

**1. `useScrolled` acepta `scroller`** (hooks):

```ts
useScrolled(threshold = 0, { enabled, initial, scroller }: UseScrolledOptions)
// scroller?: RefObject<HTMLElement | null> | HTMLElement | undefined — sin él, la ventana
```

Con `scroller`, el listener va al elemento y mide `scrollTop`; sin él, todo sigue igual. Es el
hook genérico y el único que hace falta fuera del carril.

**2. `AppShell.Scroll` y `useAppShellScroll()`** (web):

`AppShell.Scroll` es el `Scroll` del catálogo (`momentum bounce smooth` por defecto, todo
sobreescribible) que además **publica su ref y su `scrolled`** al contexto del carril. Una pantalla
lo usa como raíz de lo que se desplaza:

```tsx
<AppShell.Scroll display="flex" direction="column" flex={1}>
  …
</AppShell.Scroll>
```

`useAppShellScroll()` devuelve `{ scrolled: boolean; ref: RefObject<HTMLElement | null> }`. Si
ninguna `AppShell.Scroll` está montada, `AppShell` mide el `<main>` —que es quien scrollea en el
montaje de carril de serie— y el hook responde igual. Así el `StarField` del `backdrop` puede
recibir `scroller={ref}` sin que el producto tenga un átomo, y las cabeceras leen `scrolled` sin
saber quién scrollea.

El umbral es **cero** y no es configurable en esta parte: con 80 px la cabecera tardaba un octavo
de pantalla de teléfono en responder y se leía como un salto tardío (Rosette, `OFFSET = 0`). Quien
quiera otro umbral usa `useScrolled` con `scroller`.

**3. `AppShell.Section hanging` y `hangingHeight`** (web):

```tsx
<AppShell.Section position="sticky" top={0} z="sticky" hanging={<SheetHeader />} hangingHeight={215}>
  <AppShell.Header … />
  <AppShell.Subbar>{crumbs}</AppShell.Subbar>
</AppShell.Section>
```

`hanging` se pinta **fuera del flujo**: `position: absolute; top: 100%; left: 0; width: 100%`,
colgando de la sección. `hangingHeight` es el alto de la cabecera entera; la sección lo expone en
una var de CSS (`--appshell-hanging`) y **el siguiente hermano de la sección** —el cuerpo de la
pantalla— lo reserva como `padding-block-start` vía un selector de hermano adyacente. El
consumidor no escribe ni el `absolute` ni el `pt`. El componente colgado decide qué encoge leyendo
`useAppShellScroll().scrolled`; la transición la escribe él con `vars.motion.*` como hasta ahora.

`AppShell.Header` **no** gana un estado compacto en este ADR: las tres cabeceras de Rosette encogen
cosas distintas (una cara y sus insignias, un `Stepper`, un `Segment`) y un `collapsible` genérico
habría fijado una sola forma. Lo que se estandariza es **dónde cuelga y quién reserva**, que es lo
que se rompió.

## Alternativas

- **`AppShell.Header collapsible`**: descartado por lo de arriba. Fija una forma; el producto
  necesita tres.
- **Publicar `scrolled` desde el `<main>` solamente**: no cubre a Rosette, que apaga el scroll del
  `<main>` para dejar el pie de la pantalla fuera del scroll. `AppShell.Scroll` existe por eso.
- **Que el producto siga con su átomo**: es lo que hay. Es un átomo de jotai que el segundo producto
  copia, con su `Scroll` y su `RefScrollAtom`, y un bug ya documentado que el tercero repite.
- **`scroller` como prop de `StarField` bastaba para el parallax**: ya existe; lo que no existía es
  de dónde sacar la ref sin un átomo.

## Consecuencias

- `app-client.tsx` de Rosette pierde `Scroll`, `ScrolledAtom` y `RefScrollAtom`; `stores/sidebar.ts`
  se queda con `CompactAtom`. Las tres cabeceras cambian dos imports.
- `metrics.ts` de cada cabecera sigue existiendo: el número con su suma es del producto, y
  `hangingHeight` lo recibe. Lo que desaparece es el `pt` a mano en el cuerpo y el `absolute` en la
  cabecera.
- `hanging` se pinta en servidor; solo el componente colgado es cliente, porque lee el contexto.
- Presupuesto: `AppShell` sube por el listener y la parte nueva. Se mide; si pasa, se sube el tope
  (regla de `raise-size-limit-when-needed`).
- Story `AppShell/HangingHeader` con la cabecera entera y encogida, en los dos esquemas.
- `docs/07` §7.2 y §7.3 cambian: `AppShell.Scroll` + `useAppShellScroll` en vez del átomo, y
  `hanging`/`hangingHeight` en vez de `absolute` + `pt`. `AppShell.md` documenta las dos reglas
  medidas (fuera del flujo; el cuerpo reserva).
