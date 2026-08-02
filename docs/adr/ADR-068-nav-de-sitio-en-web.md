# ADR-068 — `Nav`: la barra de navegación de sitio sale de `Header`

- **Estado**: **aceptada** · 2026-08-01 — implementada el mismo día
- **Resuelve**: la cabecera flotante que ADR-062 enmienda 1 metió en `Header` el 2026-07-31 no era
  una cabecera de pantalla. Decisión del propietario tras revisar el componente contra
  `Rosettee/src/components/site-header.tsx`.
- **Enmienda**: ADR-062 (ver su §Enmienda 2) y `docs/00-inventory.md` §1.10.
- **Depende de**: ADR-026 (compound), ADR-032 (style props), ADR-033 (alturas), ADR-036 (foco),
  ADR-059 (degradación del cristal).

## Contexto

`Header.floating` entró el 2026-07-31 y duró un día. Lo que se midió para justificarlo
—[`header-animacion-y-estilo-2026-07-31.md`](../reviews/header-animacion-y-estilo-2026-07-31.md)—
fue el site header de Rosettee, y ese componente **no tiene título ni botón de vuelta**. Tiene tres
cosas: una marca, un grupo de enlaces con indicador deslizante que sigue a la sección visible, y un
estado a la derecha.

Al montar la lámina `Floating`, la barra de Rosettee se reprodujo así:

```tsx
<Header component="header" floating order={2} title="Rosette" rightSection={<>…NavLink…</>} />
```

Tres síntomas de que el componente no era el que tocaba:

1. **La marca entra por `title`**, que rinde un `h1`/`h2`. Un logo no es un encabezado de documento,
   y el `order={2}` de la lámina existía solo para que no chocara con el `h1` real de la página.
2. **Los enlaces entran por `rightSection`**, un slot sin semántica: sin `<nav>`, sin nombre, sin
   `aria-current`. Ningún landmark de navegación en toda la barra.
3. **El indicador de sección no cabía en ninguna parte.** ADR-062 lo declaró fuera —«es un
   `Segment`/`Tabs` con `activeIndex` controlado»— y esa salida no existe: `Segment` cambia paneles,
   no navega, y su `activeIndex` no se deduce del scroll ni de la ruta.

La `<div>`-ificación del contenido no era el problema: **el contenido era de otro componente**.

## Decisión

1. **`Nav` es un componente nuevo, compound, y es la barra de navegación de sitio.** No absorbe
   `Header` ni al revés: `Header` es la cabecera de una **pantalla** (vuelta, título, acciones) y
   `Nav` es la de un **sitio** (marca, secciones, estado). Comparten el hueco `header` de `AppShell`
   y nada más.

2. **El estado flotante se muda entero.** Las cinco props —`floating`, `scrolled`,
   `scrollThreshold`, `floatingWidth`, `floatingGap`— salen de `Header` y entran en `Nav` con el
   mismo contrato, el mismo material y los mismos `data-*`. `Header` vuelve a ser exactamente lo que
   describe ADR-062 decisión 2: contenido del slot, sin posición propia. Coste de la retirada: cero
   consumidores —los paquetes son `private` y nada estaba commiteado—.

3. **Anatomía del compound**, con el mismo anidamiento a tres niveles que `Segment.Control.Item`
   (ADR-026):

   ```
   Nav
     Nav.Logo          marca; <a> con href, <span> sin él
     Nav.Links         el landmark <nav>; dueño del indicador y de la resolución del activo
       Nav.Links.Link  el enlace; <a> con href, <button> sin él
     Nav.Actions       agrupador de la derecha
     Nav.Divider       separador visual, aria-hidden
   ```

   Los children del root son libres: `<Badge/>` suelto a la derecha es uso válido y no necesita
   `Nav.Actions`.

4. **El reparto de landmarks lo hereda de ADR-062 decisión 2.** La raíz es un `<div>`, elevable con
   `component="header"`; el `<nav>` lo emite **siempre** `Nav.Links`, porque una barra puede tener
   más de un grupo y cada uno necesita nombre. `aria-label` en la raíz solo se emite con `component`
   —un `<div>` sin rol no expone nombre accesible—; el grupo lo lleva siempre, con `labels.links`
   de defecto.

5. **Cuatro modos de resolver el enlace activo, y el defecto es deducirlo:**

   | Modo       | Fuente                                                               |
   | ---------- | -------------------------------------------------------------------- |
   | `hash`     | `useScrollSpy` sobre los `id` de sección de los `href`               |
   | `pathname` | `location.pathname`, **prefijo más largo** que encaje                |
   | `manual`   | la prop `active` del grupo                                           |
   | `auto`     | **defecto**: `hash` si todos los `href` son anclas, si no `pathname` |

   `auto` existe porque los dos casos reales —landing de anclas y app de rutas— nunca se mezclan y
   se distinguen mirando los `href`. Sin deducción, el defecto equivocado **no falla en voz alta**:
   simplemente ningún enlace se marca nunca. Pasar `active` fuerza `manual` sin declararlo.

   En `pathname` gana el prefijo más largo (`/docs/api` sobre `/docs` en la ruta `/docs/api/v2`) y
   `/` solo encaja exacto. Sin esas dos reglas se marcarían varios enlaces y el indicador —que es
   uno— tendría varios candidatos.

6. **El scroll-spy vive en `@stellaria/nebula-hooks`**, como `useScrollSpy(ids, options)`, que es
   literalmente lo que ADR-062 dejó escrito en su «lo que sigue fuera». Mismo contrato que
   `useScrolled`: `enabled: false` no suscribe nada, listener `{ passive: true }`, throttle por
   `requestAnimationFrame`, limpieza al desmontar, y comparación de `ids` **por contenido** para que
   un array literal en el render no reinicie la suscripción.

7. **El indicador es propio (`useNavIndicator`), no `useSegmentIndicator`.** Aquel indexa por
   posición porque `Segment` conoce sus items como datos y los rinde él; aquí los rinde el consumidor
   y un índice se desalinea en cuanto un enlace aparece o desaparece. `useNavIndicator` indexa **por
   `href`**. Además sobra todo el gesto (`onPan*`, `Rubber`, flick): una barra de navegación no se
   arrastra. Lo que sí se copia literalmente es la física —`useSpring` con
   `theme.motion.spring.default` y `jump()` en el primer posicionamiento—.

8. **La lista de `href` se lee de los children**, recorriendo con `Children.forEach` y descendiendo
   en `Fragment`, igual que `Segment.Control` con sus `Item`. Es la única forma de que el spy sepa
   qué observar **antes** de renderizar. Límite declarado: un `Link` envuelto en un componente del
   consumidor no entra en la lista —sigue renderizando y sigue marcándose por su prop `active`, pero
   hay que pasar `activeMode` explícito—.

9. **La integración con routers es `active`, no un adapter.** `Nav.Links active={pathname}` apaga
   toda la detección y gobierna indicador y `aria-current` a la vez. La lectura automática de
   `pathname` es un `useSyncExternalStore` sobre `popstate`/`hashchange` **más** la relectura del
   snapshot en cada render, que es lo que cubre a los routers que navegan por `pushState`. Nebula no
   importa ningún router: `component` en el `Link` acepta el `<Link>` del consumidor.

10. **`aria-current` se deriva del `href`, no del modo**: `location` si es ancla, `page` si es ruta.
    Derivarlo del modo daba `location` en modo `manual` con rutas, que es falso.

11. **Entra en el barrel principal**, sin subpath: cero dependencias nuevas. Presupuesto **medido**:
    31.36 kB con `ResolveVariant` + motion + los dos hooks, budget 33 kB — la banda de `Segment`
    (32 kB), que es el otro compound con indicador animado.

    Los dos presupuestos **del barrel** suben 1 kB cada uno, con el delta medido a los dos lados:

    | Entrada                          | Sin `Nav` | Con `Nav` | Delta    | Límite     |
    | -------------------------------- | --------- | --------- | -------- | ---------- |
    | `NebulaProvider` desde el barrel | 69.56 kB  | 70.21 kB  | +0.65 kB | 70 → 71 kB |
    | `useTheme` desde el barrel       | 25.55 kB  | 26.20 kB  | +0.65 kB | 26 → 27 kB |

    El delta es idéntico en las dos porque `packages/web` declara `sideEffects: ["*.css"]`: la hoja
    de cualquier componente alcanzable desde el barrel se retiene en toda medida enraizada ahí. Es
    el coste real y recurrente de añadir un componente al barrel, no una fuga de este.

12. **Degrada por tema en tres ejes.** `effects.glass.enabled: false` cambia el cristal por
    `surface.raised` con borde sólido; `motion.tier: "minimal"` o `prefers-reduced-motion` ponen
    `data-animated="false"` y tanto el indicador como la pastilla saltan en vez de interpolar; en
    `forced-colors` la pastilla pierde el cristal por `Canvas` y **el activo se subraya**, porque el
    color del indicador no sobrevive al alto contraste y sin subrayado el activo dejaría de
    distinguirse.

13. **La pastilla la conduce un muelle del tema, sobre una progresión escalar.** `useSpring` anima
    **solo** `--nebula-nav-progress` (0 → 1) y las tres propiedades de geometría —`inset-block-start`,
    `inset-inline-*` y `border-radius`— salen de ella con `calc()` en el `.css.ts`. La geometría
    queda definida en un único sitio y el TSX no conoce ningún píxel.

    Sustituye a la transición CSS original, que usaba `duration.base` (180 ms) con
    `easing.emphasized` —`cubic-bezier(0.34, 1.56, 0.64, 1)`, una curva **con rebote**—. Rebotar el
    ancho de una banda en 180 ms se lee como brusco; ese rebote está pensado para el `transform` de
    un elemento pequeño. El material (fondo, borde, sombra, `backdrop-filter`) **no** entra en el
    muelle: sigue en CSS con los tokens, ahora con `duration.slow` y `easing.standard`.

    Sin muelle en tres casos, y en los tres la progresión salta, que es lo correcto: reduced-motion,
    tier `minimal`, y `component` siendo un componente propio en vez de una etiqueta —envolverlo en
    `m.*` obligaría a construir un componente nuevo en cada render—.

14. **`contentWidth` topa el contenido y vale 1180 por defecto**, con `floating` y sin él. Es eje
    independiente de `floatingWidth`: aquel topa **la pastilla**, este topa **el contenido dentro de
    ella**. `contentWidth="none"` lo desactiva. La raíz rinde por eso un único hijo —el contenedor—:
    la banda va a sangre y la medida de lectura se topa dentro, que es lo que hace el header de
    Rosettee con `padding: 0 max(28px, calc((100vw - 1180px) / 2))`, aquí explícito en el DOM para
    que se pueda medir.

## Alternativas

- **Dejar `floating` en `Header` y no crear `Nav`.** Cero componentes nuevos, cero ADR. A cambio, el
  caso real —marca + secciones + indicador— se sigue componiendo con `title` rindiendo un heading
  que no lo es y `rightSection` rindiendo enlaces sin landmark. Es el estado que motivó este ADR.
- **`Nav` sin flotante, compuesto dentro de `Header floating`.** Mantiene ADR-062 intacto. Rechazada
  por el propietario: obliga a envolver siempre, y deja las dos recetas de la misma pastilla vivas —
  justo la duplicación que WR está quitando.
- **Conservar `Header.floating` **y** añadir el de `Nav`.** No rompe nada hoy y duplica para siempre:
  dos implementaciones del mismo cristal que auditar, medir y degradar en paralelo.
- **Items declarativos (`items={[…]}`) en vez de children.** Resuelve de raíz el límite de la
  decisión 8 y es lo que hace `Breadcrumbs`. Rechazada: el propietario pidió explícitamente la forma
  compound, y con items no caben contenidos arbitrarios en un enlace (un `Badge` dentro, un icono,
  un `Indicator`).
- **Reutilizar `useSegmentIndicator` con `draggable: false`.** Una sola implementación de indicador
  en el catálogo. Rechazada por la decisión 7: el índice de posición no sobrevive a children
  condicionales, que es el uso normal de una barra de navegación.

## Consecuencias

- **El catálogo web pasa de 155 a 156 componentes.** `00-inventory.md` §1.10 gana la fila `Nav`. Es
  la primera fila nueva desde que W4 cerró; ADR-062 dejó el catálogo «100 % sin matices» y esto lo
  amplía, no lo contradice.
- **`Header` pierde cinco props y un archivo** (`Header.vars.css.ts`). Su budget medido baja de
  34 kB de límite a 31.4 kB de tamaño real; el límite se deja donde estaba porque el grueso es
  `ActionIcon` y no cambió.
- **`@stellaria/nebula-hooks` gana `useScrollSpy`**, genérico y utilizable fuera de esta barra.
- **Deuda declarada**: la decisión 8 (los `Link` envueltos no entran en la lista del spy) y el
  centrado de la decisión sobre `align`, que es respecto al hueco libre y no al ancho de la barra.
  Las dos están escritas en `Nav.md` para que no se redescubran como hallazgo en una auditoría.
- **WR2 tiene una familia más que auditar.** `Nav` entra al catálogo **después** de la auditoría
  visual de §1.10 Navigation, que es exactamente el fallo que el README de WR advierte que pasó con
  `Breadcrumbs` y volvió a pasar con `Header`. Queda anotado en `docs/wr-estado`.
- **Paridad W/N pendiente**: la fila nace `W`. Si se decide `WN`, el contrato de este ADR es el que
  `packages/native` implementará en la Etapa 4 — con la salvedad de que allí el scroll-spy no puede
  salir de `getBoundingClientRect`.
