# PermissionGate

## Cómo se tipan las keys en una app

Aumentando el registro **una vez** (ADR-056). No hace falta anotar generics en ningún punto de uso ni
aliasar nada:

```ts
declare module "@stellaria/nebula-tokens" {
  interface NebulaPermissions {
    keys: "orders.read" | "orders.write" | "invoices.void";
  }
}
```

A partir de ahí `<PermissionGate permission="orders.raed">` es error de compilación, y lo mismo en
`<Button permission=…>`, en un `MenuItemData` o en `usePermission(…)`. Sin aumentar el registro,
`PermissionKey` es `string`: el gate funciona igual, pero un typo se convierte en una denegación
silenciosa.

## Cuándo usar el gate y cuándo la prop

La prop `permission` existe en los controles (`Button`, `ActionIcon`, `QuickAction`, `NavLink`) y en
los items de `Menu` y `Tabs`. Ahí es preferible: no añade nodo y, en `disable`, usa el `disabled`
nativo del control en vez de un contenedor inerte.

`PermissionGate` es para lo demás: una región entera, un bloque de texto, un contenido arbitrario que
no tiene prop `permission` propia — y para cuando quieres un `fallback` visible en lugar de un hueco.

## Por qué `mode="disable"` usa `inert` y saca la etiqueta fuera

`inert` es lo único que bloquea **ratón y teclado** sobre un subárbol arbitrario. La alternativa
—`aria-disabled` + `pointer-events: none`— deja los controles internos enfocables con Tab y
activables con Enter, de modo que la denegación sería puramente visual.

El precio de `inert` es que retira el subárbol del árbol de accesibilidad: quien navega con lector de
pantalla no percibe que la acción existe. Por eso `deniedLabel` se renderiza como **hermano** del
contenedor inerte, no dentro. Dentro no se anunciaría nunca.

Sin `deniedLabel`, `mode="disable"` es visualmente distinto de `mode="hide"` pero equivalente para un
lector de pantalla. Es deliberado: quién debe enterarse de que existe una acción que no puede ejecutar
es una decisión de producto, no de la librería.

**jsdom no implementa `inert`**: un click sintético sobre un hijo del contenedor sigue llegando al
handler en test, aunque en cualquier navegador no llegue. Por eso la suite verifica que el atributo
está puesto y no simula el click — un test verde sobre ese click estaría midiendo jsdom, no el
componente. El bloqueo real lo cubre el gate de teclado del playground.

## Por qué no acepta style props

Es el mismo caso que `Conditional`, `Portal` y `FocusTrap` (plantilla §1): en `mode="hide"` no
renderiza elemento propio. El `div` de `mode="disable"` existe solo para portar `inert`, así que acepta
`className` para poder recolocarlo en un layout, y nada más.
