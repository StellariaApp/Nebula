# ADR-062 — `Header` de pantalla en web: contenido del slot, no landmark

- **Estado**: **aceptada** · 2026-07-31 (checkpoint de WR1.1) — implementado el mismo día ·
  **enmendada dos veces**: la 1 (2026-07-31) metió el estado flotante y la 2 (2026-08-01) lo sacó a
  `Nav` ([ADR-068](ADR-068-nav-de-sitio-en-web.md))
- **Resuelve**: la única fila del catálogo web que quedó abierta al cerrar W4 —
  `Header (screen/TopBar)`, `docs/00-inventory.md` §1.1, `WN`, Tier 1—. El propietario decidió el
  2026-07-31 **construirla como componente web propio**, no declararla excepción.
- **Enmienda**: la fila `Header (screen/TopBar)` de `docs/00-inventory.md` §1.1.
- **Bloquea**: la apertura de WR2 para la familia §1.1 Foundation/Layout
  (`docs/reviews/coverage-census-2026-07-31.md`).

## Contexto

La fila describe el componente como «ST Header (BackButton/StatusError) + animated-on-scroll de FC
HeaderUser». Al verificar las tres fuentes contra el código, dos de las tres premisas resultan ser
otra cosa:

**1. El `Header` de Stellaria es el componente de doble responsabilidad que la migración ya mandó
partir.** Sus props mezclan dos componentes distintos
(`Stellaria-Frontend/src/ui/native/src/components/Layout/Header/Header.types.ts`):

| Mitad             | Props                                                                   | Destino en Nebula              |
| ----------------- | ----------------------------------------------------------------------- | ------------------------------ |
| **field-header**  | `error`, `status`, `required`, `field`, `errorProps`, `titleProps`      | **`FormField`** — ya entregado |
| **screen-header** | `leftSection`, `rightSection`, `withBack`, `onBack`, `backIcon`, `back` | **esta fila**                  |

`docs/04-migration-map.md` L51 lo dice literalmente: «Se divide: parte field-header → **FormField**;
parte screen-header → **Header/TopBar**». La mitad de campo se entregó en W2; **lo que falta es solo
la otra mitad**, no el componente entero de Stellaria.

**2. El `HeaderUser` de fonicredito no es migrable.** `docs/api/fonicredito-components.md` L720 lo
clasifica **100 % app**: recibe `progress: SharedValue<number>` de Reanimated y depende de `QueryMe`,
de roles `admin`/`qa`, de un sheet de cambio de rol y de un store de altura. Lo que la fila hereda de
él es una _referencia de comportamiento_, no código.

**3. El slot ya existe y ya es un landmark.** `AppShell` renderiza
`<header className={styles.header}>{header}</header>` (`AppShell.tsx:71-73`) — un `<header>` no
anidado, es decir el landmark `banner`— y lo posiciona con `position: sticky`
(`AppShell.css.ts:32`). `Main` tiene su propio slot `header` con `stickyHeader`
(`Main.tsx:45-49`), ahí sí un `<div>` neutro.

O sea: **el contenedor, la posición y el landmark están resueltos. Lo que no existe es el contenido
estándar de ese hueco**, y hoy cada consumidor se lo cablea a mano.

## Decisión

1. **`Header` es la mitad screen-header, y solo esa.** No acepta `error`, `status`, `required` ni el
   contrato `field`. Reintroducirlos reabriría en web la doble responsabilidad que la migración
   partió a propósito, y duplicaría `FormField`.

2. **Su elemento raíz es un `<div>`, no un `<header>`.** Su sitio natural es dentro del slot
   `header` de `AppShell`, que **ya** es el landmark `banner`: emitir un segundo `<header>` ahí
   anida dos `banner` y es un defecto de a11y, no una mejora. Para el uso suelto —fuera de
   `AppShell`— la prop polimórfica `component` permite elevarlo (`component="header"`), como el
   resto del catálogo.

3. **API unificada W/N**, cerrada a estas props:

   ```
   title, subtitle, order, leftSection, rightSection, withBack, onBack, backIcon, labels, children
   ```

   `title` se rinde con `Title`, con `order` configurable y **`order={1}` por defecto**: un header de
   pantalla es el `h1` de esa pantalla. Si el consumidor ya tiene su `h1`, baja el `order`.

4. **`withBack` rinde un `ActionIcon`**, no un `BackButton` exportado. El `BackButton` de Stellaria
   existe porque allí no había `ActionIcon` con el contrato de a11y resuelto; aquí sí. Su
   `aria-label` sale de `labels.back` (mismo patrón de i18n que `AppShell`, `Pagination` y
   `Breadcrumbs`). `backIcon` permite sustituir el glifo.

5. **Los slots `top` / `middle` / `bottom` de Stellaria se descartan.** En web eso es composición:
   `children` se rinde bajo la fila de título, que cubre el caso real (tabs, breadcrumbs o una barra
   de filtros colgando del header).

6. ~~**Sin scroll-collapse en v1.**~~ **Enmendada el 2026-07-31 — ver §Enmienda 1.** El texto
   original decía: el `sticky` lo dan `AppShell` y `Main.stickyHeader`, y el animated-on-scroll que
   la fila cita viene de un componente declarado 100 % app que además usa `SharedValue` de
   Reanimated; si se pide, entra después como prop sobre este mismo contrato, sin romperlo. **Se
   pidió el mismo día y entró como prop, sin romperlo.**

7. **Entra en el barrel principal**, no en un subpath: cero dependencias nuevas. Su presupuesto
   hereda la banda de `ActionIcon` (34 kB, Aria + motion) más el compuesto; la cifra exacta se fija
   al medir, y **no** se acepta un budget que no se haya medido.

8. **Lleva lámina en el playground desde el primer commit**, mostrándolo en los dos sitios donde
   vive: el slot `header` de `AppShell` y el de `Main`. Es la condición para que WR2 pueda auditarlo.

## Enmienda 1 — el estado flotante entra como prop (2026-07-31)

Decisión del propietario tras medir el site header de Rosettee
(`docs/reviews/header-animacion-y-estilo-2026-07-31.md`): **el estado flotante es parte de `Header`,
no una composición del consumidor.** Sustituye a la decisión 6.

9. **`floating` activa la cabecera flotante.** Apagada por defecto: `Header` sigue siendo, sin ella,
   exactamente el contenido de slot que describe la decisión 2. Con ella, la raíz pasa a
   `position: fixed`, centrada, y al cruzar el umbral de scroll se recoge en pastilla con el cristal
   del tema.

10. **Cuatro props, ningún subcomponente**: `floating`, `scrollThreshold` (24), `floatingWidth`
    (1180) y `floatingGap` (12). Más `scrolled`, que permite gobernar el estado desde fuera para
    quien ya rastrea el scroll — y es lo que usan los tests y la lámina de estados.

11. **La detección vive en `@stellaria/nebula-hooks`, no en el componente**: el hook `useScrolled`
    toma umbral y opciones (`enabled`, `initial`), con listener `{ passive: true }`, throttle por
    `requestAnimationFrame` y limpieza en el desmontaje. `enabled: false` no suscribe nada, de modo
    que un `Header` sin `floating` no cuesta un listener de scroll. Es genérico y sirve fuera de
    esta cabecera.

12. **Animar la geometría es aceptable aquí, y solo aquí, porque el elemento es `position: fixed`.**
    La regla de `docs/03` §2 —solo `transform`/`opacity`— existe para que no se reflowee el
    documento en cada frame. Un elemento fijo **ya está fuera del flujo**: cambiar su
    `inset`/`max-width` recompone su propio subárbol y nada más. Fuera de `floating` el componente no
    transiciona ninguna propiedad de layout.

13. **Degrada por tema, en los dos ejes.** `effects.glass.enabled: false` (ADR-059) sustituye el
    cristal por `surface.raised` con borde sólido y `backdrop-filter: none`; `motion.tier: "minimal"`
    o `prefers-reduced-motion` ponen `data-animated="false"` y la transición desaparece — el cambio
    de estado sigue ocurriendo, sin animarse. Verificado con un tema que apaga los dos.

14. **El material sale del contrato, no de hex.** Fondo, borde y `backdrop-filter` salen de
    `vars.glass.default`; el resto, de `vars.radius.lg`, `vars.shadow.lg` y `vars.zIndex.sticky`. La
    geometría variable (`floatingWidth`, `floatingGap`) viaja por CSS vars locales, no por estilo
    horneado.

**Lo que sigue fuera**: el scroll-spy que marca la sección activa. No es de `Header`: es un
`Segment`/`Tabs` con `activeIndex` controlado, y su indicador deslizante ya existe en
`useSegmentIndicator`. Si se pide, será `useScrollSpy` en `nebula-hooks`, no una prop de esta
cabecera.

> **Esta enmienda quedó revertida al día siguiente. Ver §Enmienda 2.** La mitad acertó —el
> scroll-spy sí salió como `useScrollSpy` en `nebula-hooks`— y la otra mitad no: el indicador no
> pudo ser `Segment`, y las cinco props de aquí se mudaron a `Nav`.

## Enmienda 2 — el estado flotante se va a `Nav` (2026-08-01)

Decisión del propietario tras revisar `Header.tsx` contra
`Rosettee/src/components/site-header.tsx`. **Revierte las decisiones 9 a 14** y las reemplaza por
[ADR-068](ADR-068-nav-de-sitio-en-web.md). La decisión 6 original —«sin scroll-collapse en
`Header`»— vuelve a estar en vigor, ahora por un motivo distinto y mejor: no es que no se pida, es
que **no es de este componente**.

15. **`floating`, `scrolled`, `scrollThreshold`, `floatingWidth` y `floatingGap` salen de
    `Header`** y entran en `Nav` con el mismo contrato y el mismo material. `Header` vuelve a ser
    exactamente lo que describe la decisión 2: contenido del slot, sin posición propia. Se retira
    también `Header.vars.css.ts`, que solo servía a la pastilla.

16. **La enmienda 1 confundió el componente con el caso de uso.** Lo que se midió para justificarla
    fue el site header de Rosettee, que no tiene título ni botón de vuelta: tiene marca, enlaces con
    indicador de sección y un estado. Montada sobre `Header`, la marca entraba por `title` —que
    rinde un heading que no lo es— y los enlaces por `rightSection` —un slot sin `<nav>`, sin nombre
    y sin `aria-current`—. ADR-068 §Contexto tiene los tres síntomas con su detalle.

17. **La deuda declarada de la decisión 6 se cierra sin cancelarse**: el scroll-collapse existe en el
    catálogo, en el componente que lo necesita. `Header` sigue sin él y eso ya no es una deuda.

**Coste de la retirada: cero consumidores.** Los paquetes son `private`, la enmienda 1 no llegó a
commitearse y `Header.floating` vivió un solo día.

## Alternativas

- **Declararlo excepción native-first**, con `AppShell` + `Section`/`Main` como respuesta web. Era la
  opción recomendada en el censo —las tres fuentes de la fila son native y su nota describe piezas
  native— y el propietario la descartó. Coste de no haberla tomado: un componente más que mantener y
  auditar. Beneficio: los consumidores dejan de recablear a mano la misma fila de back + título +
  acciones en cada pantalla.
- **Portar el `Header` de Stellaria entero**, con `field`, `status` y `required`. Máxima paridad con
  la semilla, a cambio de dos componentes con la misma responsabilidad en el mismo catálogo y de
  deshacer la partición que `04-migration-map.md` fijó.
- **Emitir `<header>` por defecto** y que `AppShell` no lo haga. Movería el landmark al componente,
  que es donde intuitivamente parece que va, pero rompe `AppShell` para quien no use `Header` y
  obliga a que el shell sepa qué le meten en el slot.
- **Absorberlo en `Section`** como una variante `as="screen"`. `Section` ya tiene title/slots; pero
  `Section` es una sección _dentro_ del contenido, con `loading`/`error`, y no tiene back ni
  jerarquía de `h1`. Serían dos ejes de variación pegados con cinta.

## Consecuencias

- **El catálogo web pasa a 100 % sin matices** una vez implementado: es la última fila abierta de
  `docs/00-inventory.md` §1 con `Plat` W/WN y destino `core`.
- **`AppShell` no cambia.** Este ADR no toca su API: `Header` es contenido que se le pasa, y todo lo
  que ya funciona con un slot a mano sigue funcionando.
- **Paridad W/N**: la fila es `WN`, así que este contrato es el que `packages/native` deberá
  implementar en la Etapa 4 sobre su propia capa visual. Ahí sí podrá emitir el equivalente native
  del landmark, porque no hay un `AppShell` que lo esté emitiendo ya.
- **Deuda declarada**: sin scroll-collapse (decisión 6). Queda escrito aquí para que no se
  redescubra como hueco en una auditoría posterior.
- **Lo que este ADR no decide**: si `FieldError`, `FormDelete`, `ModalDelete`, `RangeCalendar` y
  `OptionList` necesitan fila propia en el inventario. Son hallazgos del mismo censo, el propietario
  los dejó abiertos, y no dependen de esta decisión.
