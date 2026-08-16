# Nav

Barra de navegación de sitio: logo, grupo de enlaces con indicador deslizante y lo que cuelgue a la
derecha. Decisiones de fondo en
[ADR-068](../../../../../docs/adr/ADR-068-nav-de-sitio-en-web.md).

```tsx
<Nav floating>
  <Nav.Logo href="#inicio" aria-label="Inicio">
    <img src="/logo.svg" alt="Rosette" />
  </Nav.Logo>
  <Nav.Links aria-label="Principal">
    <Nav.Links.Link href="#solucion">Solución</Nav.Links.Link>
    <Nav.Links.Link href="#precios">Precios</Nav.Links.Link>
  </Nav.Links>
  <Badge>en línea</Badge>
</Nav>
```

## Por qué la raíz es un `<div>` y el `<nav>` lo pone `Nav.Links`

Son dos landmarks distintos y solo uno es de este componente. El `banner` lo emite quien contiene la
barra —el `<header>` de `AppShell`, o esta misma raíz elevada con `component="header"` para el uso
suelto—; el `navigation` es el grupo de enlaces y **siempre** sale, porque una barra puede tener más
de un grupo (el principal y el de utilidades) y cada uno necesita su nombre.

Es el mismo reparto que [ADR-062](../../../../../docs/adr/ADR-062-header-de-pantalla-en-web.md)
decisión 2 fijó para `Header`: emitir un `<header>` por defecto anidaría dos `banner` dentro de
`AppShell`, que es un defecto de a11y y no un extra.

Por eso `aria-label` en la raíz **solo se emite con `component`**: un `<div>` sin rol no expone
nombre accesible, y ahí `aria-label` es ruido en el DOM. El grupo de enlaces sí lo lleva siempre,
con `labels.links` de defecto.

`Nav.Logo` sigue la misma regla por un motivo más duro: sin `href` ni `component` rinde un `<span>`,
y `aria-label` sobre un elemento genérico **no es ruido, es una violación** —`aria-prohibited-attr`
de axe, que lo detectó en la lámina `AllThemes`—. Un logo que necesita nombre accesible es un logo
que enlaza a algo; si no enlaza, el nombre lo pone el `alt` de su imagen.

## Los tres modos de resolver el enlace activo, y por qué hay un cuarto que es el defecto

| Modo       | Qué mira                                               | Cuándo lo elige `auto`            |
| ---------- | ------------------------------------------------------ | --------------------------------- |
| `hash`     | `useScrollSpy` sobre los `id` de sección de los `href` | todos los `href` empiezan por `#` |
| `pathname` | `location.pathname`, prefijo más largo que encaje      | cualquier otro caso               |
| `manual`   | la prop `active` del grupo                             | se pasó `active`                  |
| `auto`     | decide entre los dos primeros, en cada render          | es el defecto                     |

`auto` existe porque los dos casos reales son excluyentes y se distinguen solos: una landing de
anclas y una app de rutas nunca mezclan. Deducirlo evita el error de dejar el modo por defecto
puesto en el otro caso, que **no falla en voz alta**: simplemente ningún enlace se marca nunca.

Tres reglas del modo `pathname`:

- **Gana el prefijo más largo.** Con `/`, `/docs` y `/docs/api` en la barra y la ruta `/docs/api/v2`,
  se marca `/docs/api`. Sin esta regla se marcarían los tres, y el indicador —que es uno— tendría
  tres candidatos.
- **`/` solo encaja exacto.** Si no, sería el activo de todas las páginas del sitio.
- **Query y hash se descartan** antes de comparar, igual que la barra final.

## `pathname` y los routers que navegan sin `popstate`

La lectura es un `useSyncExternalStore` suscrito a `popstate` y `hashchange`. Eso cubre atrás,
adelante y anclas, **pero no un `pushState`** — que es como navegan el App Router de Next, TanStack
Router y compañía. Lo que sí cubre esos casos es la otra mitad del contrato de
`useSyncExternalStore`: el snapshot se vuelve a leer **en cada render**, y una navegación de router
siempre re-renderiza el árbol. En la práctica funciona.

Cuando no baste —un router que navegue sin re-renderizar la barra— la salida es `active` en el
grupo, que apaga toda la detección:

```tsx
<Nav.Links active={usePathname()}>…</Nav.Links>
```

Esa es también la vía recomendada en Next: es una comparación por identidad contra el `href`, no hay
heurística de por medio, y gobierna el indicador además del `aria-current`.

## Por qué los `href` se leen de los children y no se piden como `items`

`Nav.Links` necesita la lista de destinos **antes** de renderizar: el scroll-spy la usa para saber
qué secciones observar, y la deducción de modo para saber si son anclas o rutas. Se recorre
`children` con `Children.forEach` buscando `NavLinksLink`, descendiendo en `Fragment` —el mismo
patrón que `Segment.Control` con sus `Item`—.

El límite: **un `Link` envuelto en un componente propio del consumidor no se ve**. Sigue
renderizando y sigue marcándose por su prop `active`, pero no entra en la lista del spy ni cuenta
para deducir el modo. Con envoltorios, pasar `activeMode` explícito.

`active` en un `Link` concreto se lee en ese mismo recorrido, y por eso **también mueve el
indicador**: si se leyera solo dentro del `Link`, el grupo no se enteraría y la pastilla se quedaría
sobre otro enlace.

## Por qué el indicador no reutiliza `useSegmentIndicator`

`useSegmentIndicator` indexa por posición (`SetItemRef(index)`) porque `Segment` conoce sus items
como datos y los rinde él. Aquí los rinde el consumidor: los enlaces son children arbitrarios, se
montan y desmontan por condiciones de la app, y un índice de posición se desalinea en cuanto uno
aparece o desaparece. `useNavIndicator` indexa **por `href`**, que es estable por definición.

Lo otro que sobra es el gesto: `useSegmentIndicator` arrastra `onPan*`, `Rubber` y el flick porque
un segmented control se desliza con el dedo. Una barra de navegación no se arrastra.

Lo que sí es idéntico —y deliberadamente copiado— es la física: `useSpring` con
`theme.motion.spring.default`, `jump()` en el primer posicionamiento para que no entre volando
desde la izquierda, y `MotionValue` crudo en vez de spring cuando el tier es `minimal`.

## El indicador se mide en los cuatro lados, y no lleva sombra

**Vertical medido, no deducido.** La primera versión sacaba `x` y `width` de la caja del enlace pero
el alto de la caja del `<nav>` (`inset-block: xxs`). Eso solo coincide mientras el enlace sea el
elemento más alto del grupo: mete un `Nav.Divider`, un `Badge` dentro de un enlace o un icono
grande, y el indicador crece con el grupo mientras el enlace se queda donde estaba. Ahora `y` y
`height` salen de la misma medición que `x` y `width`, así que el indicador **cubre el enlace**, no
el hueco que lo contiene. `y` y `height` no se animan: no cambian al pasar de un enlace a otro.

**Sin sombra proyectada.** Llevaba `shadow.xxs`, que en dark es
`inset 0 1px 0 …, 0 1px 2px rgba(0,0,0,0.40)`. Sobre una pastilla translúcida ese desenfoque de 2 px
hacia abajo se lee como que el indicador está uno o dos píxeles bajo de línea — no lo estaba, era la
sombra—. Y es un error de categoría además de un defecto óptico: `docs/06` §5 tiene **una sola
escalera de elevación**, y un realce de fondo dentro de un contenedor no está elevado sobre nada.
Lo que separa al indicador del fondo es su color y su borde, que salen de `ResolveVariant`.

## La pastilla se mueve con un muelle, y la geometría se escribe una sola vez

La primera versión transicionaba `inset`, `max-width` y `border-radius` por CSS con
`duration.base` (180 ms) y `easing.emphasized`, que es `cubic-bezier(0.34, **1.56**, 0.64, 1)` —una
curva **con rebote**—. Rebotar el ancho de una barra en 180 ms se lee como brusco, no como vivo: el
rebote está pensado para un `transform` de un elemento pequeño, no para la geometría de una banda.

Ahora la conduce **un muelle del tema** (`motion.spring.default`), y lo hace por un solo escalar:

```
--nebula-nav-progress: 0 … 1
inset-block-start:  calc(var(--p) * <floatingGap>)
inset-inline-*:     calc(var(--p) * max(<floatingGap>, (100% - <floatingMax>) / 2))
border-radius:      calc(var(--p) * <radius.lg>)
```

`useSpring` anima **solo la progresión**; las tres propiedades salen de ella en CSS. Así la
geometría está definida en un único sitio —el `.css.ts`— y el TSX no conoce ni un píxel.

El muelle es **`snappy`** (`stiffness 450, damping 29, mass 1` desde ADR-138), no `default`. Una
barra que se recoge es un cambio de estado, no una entrada: con `default` el asentamiento se notaba
lento para lo poco que recorre.

Tres detalles que costaron una medición:

- **`width: auto` es obligatorio en el estado flotante.** La raíz trae `width: 100%` del recipe, y
  con `left`, `right` y `width` a la vez la caja queda sobre-restringida: el navegador descarta
  `right` y la barra no encoge. Se veía animar el alto y el radio con el ancho clavado.
- **`max(gap, (100% - max) / 2)` sustituye al `max-width` + `margin-inline: auto`.** Con la
  pastilla definida por sus insets, un solo valor cubre los dos casos: en pantalla ancha centra a
  `floatingMax`, y en pantalla estrecha deja `floatingGap` a cada lado.
- **El nombre de la variable es literal, no `createVar()`.** `assignInlineVars` devuelve strings y
  aquí hace falta pasar un `MotionValue` a `style`, que necesita el nombre crudo de la propiedad
  (`--nebula-nav-progress`). Va prefijado por eso.

**El material no va en el muelle.** Fondo, borde, sombra y `backdrop-filter` siguen transicionando
por CSS con los tokens, como manda la plantilla («color y sombra transicionan por CSS»). Lo que sí
cambió es la curva: `duration.slow` con `easing.standard`, sin el rebote.

**Cuándo no hay muelle**, y en los tres casos la progresión salta en vez de interpolar, que es lo
correcto: `prefers-reduced-motion`, `motion.tier: "minimal"`, y cuando `component` es un componente
propio del consumidor en vez de una etiqueta —ahí no se puede envolver la raíz en `m.*` sin
construir un componente nuevo en cada render—.

## `floating`: por qué aquí sí se anima la geometría

`docs/03` §2 dice «solo `transform` y `opacity`». Con `floating` esta barra transiciona
`inset-block-start`, `inset-inline-*`, `max-width` y `border-radius`, y no es una excepción
negociada: **la regla existe para que no se reflowee el documento en cada frame, y un elemento
`position: fixed` ya está fuera del flujo**. Cambiar su inset recompone su propio subárbol y nada
más. Sin `floating` el componente no transiciona ninguna propiedad de layout.

Si esto se copia a otro componente, la condición que lo hace legítimo es el `position: fixed`, no el
componente.

Estas cinco props (`floating`, `scrolled`, `scrollThreshold`, `floatingWidth`, `floatingGap`)
vivieron un día en `Header`. La enmienda 2 de ADR-062 las movió aquí.

## `floating` y `scrolled`: por qué dos props

`scrolled` gobierna el estado desde fuera. Cuando se pasa, `useScrolled` no suscribe nada
(`enabled: false`) y no hay dos fuentes de verdad compitiendo. Sirve para tres cosas: consumidores
que ya rastrean el scroll, los tests, y la lámina que enseña los dos estados sin hacer scroll.

`withBorder` se ignora con `floating`: el borde inferior es de una barra que está en el flujo, y la
pastilla ya trae borde completo en su estado condensado.

## El cristal: por qué aquí NO va el alias `-webkit-`

En el estado condensado se declara **solo `backdropFilter`**, sin su `WebkitBackdropFilter`. No es un
descuido: dentro de un bloque `selectors`, vanilla-extract emite **una sola** de las dos, y gana la
última escrita. Con las dos puestas —que es como lo escribe `GlassSurface`, y ahí funciona porque
están al nivel raíz del estilo— el CSS resultante era:

```css
[data-scrolled="true"] { …; -webkit-backdrop-filter: var(--surfaceBackdrop) }
```

La propiedad estándar desaparecía, así que **la pastilla nunca llegó a tener cristal en Chrome ni en
Firefox**: se veía el fondo translúcido y nada más. Se descubrió midiendo `getComputedStyle` sobre el
render, que devolvía `backdrop-filter: none` mientras la var local sí traía
`blur(16px) saturate(140%)`.

Si alguien vuelve a añadir el alias «por compatibilidad», rompe el cristal en los navegadores que sí
soportan la propiedad estándar. El alias solo hace falta en Safari anterior a la 18, y este
componente no lo cubre.

## El cristal degrada solo

`effects.glass.enabled: false` (ADR-059) cambia el cristal por `surface.raised` con borde sólido y
`backdrop-filter: none`. `motion.tier: "minimal"` o `prefers-reduced-motion` ponen
`data-animated="false"`: el estado sigue cambiando, deja de animarse, y el indicador salta en vez de
deslizarse. El test de degradación los apaga los dos con un tema ad-hoc (`theme-tweaks`).

En `forced-colors` la pastilla pierde el cristal por `Canvas` y el enlace activo se subraya: el
color del indicador no sobrevive al modo de alto contraste, y sin el subrayado el activo dejaría de
distinguirse.

## El contenedor interno, y por qué la raíz no es la fila

La raíz rinde **un solo hijo**: un `<div>` que lleva la fila (`flex`, `space-between`, `gap`) y el
tope de ancho. Están separados porque hacen cosas distintas y en cajas distintas:

- **La raíz** es la banda: ocupa el 100 %, pinta el borde inferior o la pastilla flotante, y pone el
  `padding-block`. Es la que va a pantalla completa.
- **El contenedor** es la medida de lectura: `max-width` + `margin-inline: auto`. Es lo que impide
  que en un monitor ancho el logo y las acciones acaben a 900 px de distancia.

Sin esa separación no se puede tener las dos cosas a la vez —una banda a sangre con el contenido
centrado y topado—, que es justo lo que hace el header de Rosettee con
`padding: 0 max(28px, calc((100vw - 1180px) / 2))`. Aquí sale de un `max-width` explícito en vez de
un cálculo de padding, porque así el tope se lee en el DOM y se puede medir.

`contentWidth` gobierna ese tope y **vale 1180 por defecto, con `floating` y sin él**. Es el mismo
número que `floatingWidth`, pero son dos ejes independientes: `floatingWidth` topa **la pastilla** y
`contentWidth` topa **el contenido dentro de ella**. Se pueden separar —contenido a 860 dentro de una
pastilla de 1180— y `contentWidth="none"` quita el tope para una barra que deba ocupar todo el ancho
de su hueco.

**Las style props y `className` van a la raíz**, no al contenedor (ADR-032: al nodo que ya llevaba
`className`). Consecuencia práctica: `maw` sobre un `Nav` estrecha **la banda**, no el contenido —
para el contenido está `contentWidth`—. Y `px` sobre un `Nav` con `floating` compite con el
`padding-inline` de la pastilla.

## Dónde se centran los enlaces

El contenedor interno es un flex con `space-between` y `Nav.Links` se coloca con márgenes
automáticos según `align` (`center` por defecto). Con logo + enlaces + acciones eso da el reparto de
tres columnas; sin acciones, los enlaces quedan centrados entre el logo y el borde. Es una
aproximación: el centrado es respecto al **hueco libre**, no al ancho de la barra, así que con un
logo muy ancho y nada a la derecha el grupo no cae en el centro geométrico. Para eso, `align="end"` y
una `Nav.Actions` vacía no son la respuesta — lo es una grid en el consumidor.

`space-between` es también lo que coloca el `Burger` cuando la barra se pliega: con los enlaces y las
acciones ocultos quedan dos hijos visibles —el logo y el botón— y el reparto los manda a cada
extremo sin que ninguno necesite margen propio.

## El cajón entra por el final

`Nav.Sidebar` se ancla a `inset-inline-end` y desliza desde ahí, del mismo lado que el `Burger` que
lo abre: el puntero no cruza la pantalla para abrir y volver a cerrar. Por eso el borde del panel es
`border-inline-start` y el botón de cierre va a `flex-end` — queda sobre el hamburger, que es donde
está la mano. Todo en propiedades lógicas, así que en RTL el cajón entra por la izquierda sin tocar
nada.

## Lo que este componente no es

`NavLink`. Ese es el enlace de una **barra lateral**: vertical, con descripción, icono, hijos
colapsables y `PermissionGate`. `Nav.Links.Link` es horizontal, de una línea y sin estado propio.
Comparten el rol `link` y nada más.

Tampoco es `Tabs`. Las tabs controlan qué panel se ve dentro de la página; esto navega.

## El indicador entra y sale con un fade

El activo puede **no existir**: arriba del todo, antes de que ninguna sección cruce el marcador, no
hay enlace activo (ADR-075). El indicador tiene entonces dos estados más que una simple posición, y
saltar entre ellos de golpe se lee como un parpadeo.

Entra con `Tween("fast", "standard")` y sale con `ExitTween("fast")`, que es la regla de `docs/06`
§6.1 —toda salida es más rápida que su entrada, a dos tercios y con curva acelerada—. Con
`prefers-reduced-motion` o `tier: "minimal"` el cambio vuelve a ser instantáneo, porque las dos
transiciones salen de las utilidades de motion y no del componente.

**El hook conserva la última geometría** para el desvanecido. Sin eso, al perder el activo el rect
pasa a cero y la píldora se aplasta a 0 px de alto y salta a la izquierda mientras se desvanece;
medido, ahora mantiene sus 40 px y su `x` durante toda la salida.

**El enlace activo pone su fondo a `transparent` al recibir el ratón, y es a propósito.** Su
afordancia de estado es el indicador móvil que dibuja `use-nav-indicator`, no un fondo; darle
además el fondo de hover duplicaría la señal y la haría saltar al pasar el puntero. Por eso Nav
queda fuera del reparto de `hoverActive` de ADR-095, pese a cumplir el patrón de selección + puntero.
