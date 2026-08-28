# AppShell

El armazón de una aplicación: una rejilla, un enlace de salto y las **partes** que la ocupan. El
componente no envuelve nada — cada parte trae su propio elemento semántico, su área de la rejilla y
su cristal.

## Dos montajes, un componente

`sidebar` es lo que decide cuál:

```tsx
// regiones: la cabecera cruza por encima y la navegación empieza debajo
<AppShell
  header={<AppShell.Header sticky title="Conciliación" />}
  navbar={<AppShell.Nav>{links}</AppShell.Nav>}
  aside={<AppShell.Aside>{resumen}</AppShell.Aside>}
  footer={<AppShell.Footer>{pie}</AppShell.Footer>}
>
  {contenido}
</AppShell>

// carril: la barra ocupa la altura completa y cada sección lleva su cabecera
<AppShell
  backdrop={<StarField fixed aurora />}
  sidebar={
    <AppShell.Sidebar collapsed={mini} onCollapse={setMini}>
      <AppShell.Sidebar.Header>{marca}</AppShell.Sidebar.Header>
      <AppShell.Sidebar.Body>
        <AppShell.Links title="Administrador" action={<ActionIcon …/>}>
          <AppShell.Link label={<AppShell.Label>Actividad</AppShell.Label>} href="#a" />
        </AppShell.Links>
      </AppShell.Sidebar.Body>
      <AppShell.Sidebar.Footer>{usuario}</AppShell.Sidebar.Footer>
    </AppShell.Sidebar>
  }
>
  <AppShell.Section>
    <AppShell.Header title="Mis Empresas" subtitle="…" actions={<Button />} />
    <AppShell.Subbar>{breadcrumbs}</AppShell.Subbar>
    <AppShell.Content>{tarjetas}</AppShell.Content>
  </AppShell.Section>
</AppShell>
```

El de regiones sirve para una página que crece; el de carril fija `100dvh` y desplaza en `main`, que
es lo que un panel necesita. Son dos anatomías distintas y por eso no se mezclan en la misma pantalla.

## Las partes

| Parte                                  | Elemento    | Dónde vive                                      |
| -------------------------------------- | ----------- | ----------------------------------------------- |
| `Header`                               | `<header>`  | región (con `sticky`) o dentro de una `Section` |
| `Nav`                                  | `<nav>`     | región                                          |
| `Aside`                                | `<aside>`   | región                                          |
| `Footer`                               | `<footer>`  | región                                          |
| `Footer.Content`                       | `<div>`     | como `Label`, para lo que no es texto           |
| `Sidebar`                              | `<aside>`   | carril, altura completa                         |
| `Sidebar.Header` / `.Body` / `.Footer` | —           | las tres franjas de la barra                    |
| `Links`                                | —           | grupo de enlaces con rótulo y acción            |
| `Link`                                 | —           | un enlace del carril                            |
| `Label`                                | `<span>`    | lo que desaparece al encoger                    |
| `Section`                              | `<section>` | dentro del carril, **sin padding**              |
| `Subbar`                               | —           | bajo una cabecera                               |
| `Content`                              | —           | el único que pone padding                       |

## `Label` y `Footer.Content` son la misma regla en dos elementos

Las dos desaparecen igual —bajo `laptop` y con el carril encogido—, y se diferencian en el elemento:
`<span>` para el rótulo de un enlace, `<div>` para el bloque que no es texto —un avatar con su saldo
en el pie de la barra—. Un `<div>` dentro de un `<span>` es marcado inválido y el navegador lo parte,
así que la elección no es de estilo.

`Footer.Content` acepta además los props de estilo de `Box`, y por eso esconde con `!important`: esos
props viven en la capa `util`, la última, y sin él un `display="flex"` del consumidor le ganaría a la
regla que lo oculta.

## Por qué el root no envuelve

Antes el root metía `{header}` dentro de un `<header>` suyo. Eso obligaba a que **toda** la
personalización pasara por props del root, y dejaba fuera cualquier montaje que no fuera el previsto
—el del carril, sin ir más lejos, no se podía expresar—.

Ahora el root solo coloca: `{header}{navbar}{aside}{footer}` más el `<main>`. La semántica y el estilo
los pone la parte, así que **una parte vale en los dos montajes** y quien necesite algo distinto
compone con `Box` sin pelearse con un envoltorio que no puede quitar.

El precio es que las regiones dejan de ser opcionales de facto: pasar un `<span>` crudo a `navbar` ya
no produce un `<nav>`. Es explícito a propósito.

## El estado colapsado viaja por contexto

`inert` no es CSS, así que el `Nav` tiene que saber si la barra está colapsada. El root publica
`{ collapsed, navigationLabel, complementaryLabel, railCollapse }` por contexto y `Nav`, `Aside` y
`Sidebar` los leen. Es lo que permite que la parte sea autónoma sin que el consumidor tenga que
reenviar el estado a mano.

## `railCollapse` decide si el carril se estrecha o se retira

ADR-153. Con `"mini"` —el default, y lo que el modo carril hizo siempre— el carril se estrecha a
iconos por debajo de `laptop` y se tiende como barra inferior por debajo de `tablet`. Con `"hidden"`
se retira por debajo de `laptop`.

Va por contexto y no como prop del `Sidebar` porque **son dos reglas que tienen que dispararse a la
vez**: el hueco del carril no lo reserva el carril, lo reserva el grid de la raíz —la columna mini y,
bajo `tablet`, el `margin-block-end` de la barra inferior—. Esconder el `<aside>` por fuera deja las
reservas puestas y el resultado es una columna vacía, que es un fallo que no rompe nada y por eso no
se ve.

`"hidden"` no reduce la navegación, la muda de sitio: los enlaces del carril tienen que estar en otra
superficie por debajo del corte. `AppShell` no puede comprobarlo y ningún gate lo detecta —el
contrato de `docs/03` mide lo que hay en el DOM, no lo que falta—, así que es responsabilidad de
quien pasa la prop. En `apps/web` esa superficie es el cajón del hamburger, que por eso se pliega en
`laptop` y no en `tablet`.

## `chromeHeight` alinea el cromado por construcción

La cabecera y las dos ranuras del `Sidebar` —`top` y `bottom`— leen la **misma** var. El logotipo, el
bloque de usuario y la cabecera quedan a la misma altura sin que nadie repita un número: cambiar
`chromeHeight` los mueve a los tres.

## `Sidebar.Body` revela el enlace activo

Una barra con secciones por permiso desplaza, y tras una recarga el enlace de la ruta actual puede
quedar fuera de vista. `Sidebar.Body` observa `data-active` en su subárbol y, si el enlace no se ve,
mueve **solo su propio contenedor** —el que scrollea de verdad— hasta el borde más cercano, en los dos
ejes: sirve igual para el carril vertical que para la barra horizontal de `tablet`.

**Quién scrollea cambia con el ancho, así que se pregunta desde el propio cuerpo hacia arriba.** En el
carril vertical el que se desplaza es el contenedor —el cuerpo es `overflow: hidden`—; al tenderse
como barra inferior bajo `tablet` los papeles se cambian: el cuerpo pasa a `overflow-x: auto` y el
contenedor, ya fijo y del ancho de la pantalla, se queda sin recorrido. Buscar empezando en el padre
daba siempre el contenedor, y en la barra horizontal eso es un `scrollTo` contra un elemento que no
tiene adónde ir: un no-op que no rompe nada y no ve ningún gate. ADR-182.

**No usa `scrollIntoView` a propósito.** Esa API arrastra a todos los ancestros scrollables, y el grid
del carril es `overflow: hidden`: llevarlo ahí desplaza la página entera y nadie puede devolverla.
Medido en el sitio de docs con un enlace activo al final de la lista: el grid se iba 120 px y el
título de la página acababa debajo del cromado fijo.

El primer pase es seco. Animar el salto inicial es un tirón sin causa aparente para quien acaba de
entrar; el desplazamiento suave solo tiene sentido cuando el activo **cambia** —una navegación— y por
eso se reserva a partir del segundo. `MotionOff` lo apaga entero con `prefers-reduced-motion` o con
un tema de `tier: "minimal"`.

Es un `MutationObserver` y no un efecto con dependencias porque la parte no conoce la ruta: el activo
lo marca el `NavLink` que el consumidor pinta, y lo mismo llega por un cambio de atributo que por un
grupo entero que aparece cuando cargan los permisos.

## `backdrop` existe porque el cristal necesita fondo

Las partes usan cristal por capas —`strong` en la cabecera, `default` en la subbarra y en el pie,
`subtle` en la barra y en el aside— y un cristal sobre un plano opaco no se lee. `backdrop` es la capa
decorativa detrás de todo, que es donde vive un `StarField`.

Los cinco niveles son el **defecto de la prop `level`**, no una constante: `<AppShell.Nav
level="strong">` es válido. Por eso el filo de cada región se lee de la var de `GlassSurface` con
`fallbackVar` en vez de clavarse en la hoja
([ADR-118](../../../../../docs/adr/ADR-118-el-cristal-recupera-su-filo-y-el-velo-se-vuelve-opaco.md)): si el
nivel cambia, velo y filo cambian juntos.

## Por qué la barra compone y no rellena ranuras

`Sidebar` tenía `top` y `bottom` como props. Funcionaba mientras la barra fuera marca arriba y
usuario abajo, y se rompía en cuanto el contenido dejó de caber en ese molde: un grupo de enlaces con
rótulo y acción, un bloque de rol enmarcado, secciones por permiso. Todo eso pasaba por `children`
mientras las dos franjas de cromo seguían siendo props, así que la mitad de la barra se componía y la
otra mitad se rellenaba.

Ahora las tres franjas son partes. El precio es que `Sidebar` ya no garantiza el orden —nada impide
poner el pie primero— y a cambio la barra admite montajes que no estaban previstos, que es
exactamente lo que ADR-086 buscaba al convertir el shell en compound.

`Links` existe por lo mismo: el rótulo de grupo se repetía en cada story con el mismo `Text` en
`caption`, `uppercase` y `wide`, y con la misma regla de desaparecer al encoger. Un patrón que se
copia tres veces es un componente que falta.
