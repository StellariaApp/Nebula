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
  sidebar={<AppShell.Sidebar top={<Marca />} bottom={<Usuario />}>{nav}</AppShell.Sidebar>}
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

| Parte     | Elemento    | Dónde vive                                      |
| --------- | ----------- | ----------------------------------------------- |
| `Header`  | `<header>`  | región (con `sticky`) o dentro de una `Section` |
| `Nav`     | `<nav>`     | región                                          |
| `Aside`   | `<aside>`   | región                                          |
| `Footer`  | `<footer>`  | región                                          |
| `Sidebar` | `<aside>`   | carril, altura completa                         |
| `Section` | `<section>` | dentro del carril, **sin padding**              |
| `Subbar`  | —           | bajo una cabecera                               |
| `Content` | —           | el único que pone padding                       |

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
`{ collapsed, navigationLabel, complementaryLabel }` por contexto y `Nav` y `Aside` los leen. Es lo
que permite que la parte sea autónoma sin que el consumidor tenga que reenviar el estado a mano.

## `chromeHeight` alinea el cromado por construcción

La cabecera y las dos ranuras del `Sidebar` —`top` y `bottom`— leen la **misma** var. El logotipo, el
bloque de usuario y la cabecera quedan a la misma altura sin que nadie repita un número: cambiar
`chromeHeight` los mueve a los tres.

## `backdrop` existe porque el cristal necesita fondo

Las partes usan cristal por capas —`subtle` en la barra, `default` en la cabecera, `control` en la
subbarra— y un cristal sobre un plano opaco no se lee. `backdrop` es la capa decorativa detrás de
todo, que es donde vive un `StarField`.
