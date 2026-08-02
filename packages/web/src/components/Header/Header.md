# Header

Cabecera de pantalla: la fila de vuelta + título + acciones que hoy cada consumidor recableaba a
mano dentro del slot `header` de `AppShell` o de `Main`. Decisiones de fondo en
[ADR-062](../../../../../docs/adr/ADR-062-header-de-pantalla-en-web.md).

## Por qué la raíz es un `<div>` y no un `<header>`

`AppShell` ya renderiza `<header>{header}</header>` alrededor de su slot, y un `<header>` no anidado
**es** el landmark `banner`. Si este componente emitiera otro `<header>` por defecto, el uso normal
—`<AppShell header={<Header … />}>`— produciría dos `banner` anidados: un defecto de a11y que axe
marca, no un extra.

Para el uso suelto —una pantalla sin `AppShell`— se eleva con `component="header"`.

## Por qué `aria-label` y `aria-labelledby` solo se emiten con `component`

Un `<div>` sin rol no expone nombre accesible: `aria-labelledby` ahí es ruido en el DOM que no
etiqueta nada. Por eso el etiquetado automático a partir de `title` **solo se aplica cuando el
consumidor ha elevado la raíz** con `component`, que es cuando puede ser landmark. Sin `component`,
quien etiqueta es el `<header>` de `AppShell`.

## Por qué `order` vale 1 por defecto

Un header de pantalla es el `h1` de esa pantalla. Cuando el consumidor ya tiene su propio `h1`
—una landing con hero, por ejemplo— baja el `order`. Es la misma prop que `Section`, con el rango
extendido a 1 porque `Section` es una sección _dentro_ del contenido y este no.

## Por qué `withBack` no exporta un `BackButton`

El `Header` de Stellaria trae un `BackButton` propio porque en native no había un `ActionIcon` con
el contrato de a11y resuelto. Aquí sí: `withBack` rinde un `ActionIcon` con `aria-label` de
`labels.back`, y `backIcon` sustituye el glifo. Un componente exportado más para envolver a otro no
aporta nada y sí un budget que mantener.

## Lo que este componente no es

`FormField`. El `Header` de Stellaria mezclaba dos responsabilidades —cabecera de campo
(`error`, `status`, `required`, `field`) y cabecera de pantalla— y `docs/04-migration-map.md` L51
manda partirlo. La mitad de campo se entregó en W2 como `FormField`; esta es la otra. No acepta
`error` ni `status` a propósito.

## Dónde fue a parar `floating`

Este componente tuvo entre el 2026-07-31 y el 2026-08-01 un estado `floating` —la pastilla fija que
se recoge al hacer scroll— junto con `scrolled`, `scrollThreshold`, `floatingWidth` y
`floatingGap`. **Ya no**: la pastilla vive en [`Nav`](../Nav/Nav.md), con las mismas cinco props y
el mismo material ([ADR-068](../../../../../docs/adr/ADR-068-nav-de-sitio-en-web.md), y la
enmienda 2 de ADR-062).

La razón es que la cabecera flotante nunca traía título ni botón de vuelta: traía logo, enlaces y un
indicador de sección. Eso es una barra de navegación de sitio, no la cabecera de una pantalla, y
tenerlas juntas obligaba a mantener dos recetas de la misma pastilla. Lo que quedó aquí es lo que
describe ADR-062 decisión 2: contenido del slot `header`, sin posición propia.

`Header` no transiciona ninguna propiedad de layout.

## Lo que sigue fuera

El scroll-spy que marca la sección activa. No es de este componente: se entregó como `useScrollSpy`
en `@stellaria/nebula-hooks` y lo consume `Nav.Links`.
