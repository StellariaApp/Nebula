# ADR-086 — El shell de panel es un compound

- **Estado**: **aceptada** · 2026-08-03 — a petición del propietario durante el banco de pruebas de
  dashboard
- **Amplía**: `AppShell` con un modo de carril y cinco partes. **No toca** el modo existente.

## Contexto

Al montar el listado de empresas sobre `The Film Vault` y `Polaris` apareció el primer hueco real del
catálogo: **`AppShell` pone la cabecera por encima del navbar**. Su rejilla es
`"header header header" / "nav main aside"`, así que la barra lateral empieza **debajo** de la
cabecera. Los dos productos de referencia hacen lo contrario —barra a altura completa a la izquierda,
y dentro del área principal cada región con su propia cabecera— y eso no se puede expresar con las
props que había.

La primera versión de la story lo resolvió componiendo el shell a mano con `Box` y `GlassSurface`. El
propietario lo señaló: **si la story tiene que construir el shell, es que el catálogo no sabe expresar
el patrón**. Una story que reimplementa un componente es un hallazgo, no una solución.

## Decisión

`AppShell` gana un **modo carril** y las partes que lo componen:

```tsx
<AppShell.Rail sidebar={<AppShell.Sidebar top={…} bottom={…}>{nav}</AppShell.Sidebar>}>
  <AppShell.Section>
    <AppShell.Header title=… subtitle=… actions=… />
    <AppShell.Subbar>{breadcrumbs}</AppShell.Subbar>
    <AppShell.Content>{cards}</AppShell.Content>
  </AppShell.Section>
</AppShell.Rail>
```

| Parte     | Qué es                                                                      |
| --------- | --------------------------------------------------------------------------- |
| `Rail`    | Rejilla `"rail main"` a `100dvh`, con `backdrop` para la capa decorativa    |
| `Sidebar` | `<aside>` a altura completa, con ranuras `top` y `bottom` a altura de cromo |
| `Section` | `<section>` **sin padding**                                                 |
| `Header`  | `<header>` a altura de cromo, cristal `default`, cierra por abajo           |
| `Subbar`  | Franja bajo la cabecera, cristal `control` — el más suave                   |
| `Content` | El único que pone padding                                                   |

**El modo anterior no se toca.** `AppShell` con `header`/`navbar` sigue siendo el mismo componente y
la misma rejilla; el carril entra como `AppShell.Rail`. Dos rejillas en un componente serían una
trampa, pero son dos anatomías distintas de shell y cada una tiene su punto de entrada.

### Tres decisiones que el render obligó

1. **El padding vive en `Content`, no en `Section`.** Es lo que permite que la cabecera y la subbarra
   vayan **a sangre** —sin radio y cerrando solo por abajo— mientras las tarjetas respiran. Con
   padding en la sección, el cromado se despegaba de los bordes y dejaba de leerse como cromado.
2. **La altura de cromo es una sola var.** `chromeHeight` la comparten la cabecera y las dos ranuras
   del sidebar, así que el logotipo, el bloque de usuario y la cabecera **quedan alineados por
   construcción**. Medido: 72 px los tres.
3. **El cristal va por capas, como en la landing**: `subtle` en el sidebar, `default` en la cabecera
   —el mismo que el `Nav`— y `control` en la subbarra. Sin nada detrás el cristal no se lee, y de ahí
   la prop `backdrop`: es donde vive el `StarField`.

## Consecuencias

- La story del panel pasa de construir el shell a consumirlo. Lo que queda en ella es composición de
  producto —qué va en cada ranura—, que es lo que una story debe demostrar.
- El sidebar por defecto mide **336 px** y el cromo **72 px**, ambos configurables.
- `AppShell.Rail` fija `100dvh` y desplaza en `main`, que es lo que un panel necesita y lo contrario
  de lo que hace el modo con `header`, pensado para páginas que crecen.
