# ADR-104 — La ranura se tipa con el componente que la pinta

- **Estado**: aceptada · 2026-08-06 (decisiones 2 y 3 del checkpoint de WN) · **N3**
- **Cambia API pública**: sí. Ensancha el tipo de las props de ranura; no quita ninguna.
- **Enmienda [ADR-098](ADR-098-props-de-ranura.md)**, que sigue vigente en todo lo demás.

## Contexto

ADR-098 fijó que un nodo DOM se tipa con `ComponentPropsWithoutRef<"tag">`. Aplicado a `Header`:

```ts
titleProps?: ComponentPropsWithoutRef<"h1"> | undefined;
```

El principio que ordena WN dice que **un consumidor tiene que poder ajustar cualquier componente sin
forkearlo**. Con ese tipo no forkea, pero **se sale del sistema**:

```tsx
// lo que se podia escribir
<Header titleProps={{ style: { fontWeight: 700, fontSize: 22, color: "#4b5563" } }} />
```

Ese valor no pasa por tokens, no cambia con el tema y `check:contrast` no lo ve. La ranura existía y
estaba vacía de poder. La causa estaba un nivel más abajo: `Header` pintaba `<h1>` y `<p>` crudos,
teniendo `Text` y `Box` al lado.

## Decisión

**El `<nodo>Props` se tipa con el componente de Nebula que pinta el nodo, no con la etiqueta DOM.**

- Nodo de texto → `TextSlotProps`
- Envoltorio → `BoxSlotProps`
- Componente de Nebula → su propio `Props` (ya se hacía: `backProps: ActionIconProps`)

Y para que el tipo sea honesto, **el componente tiene que pintar de verdad a través de `Text`/`Box`**.
Un `titleProps: TextSlotProps` sobre un `<h1>` crudo es mentira: el consumidor escribiría `fw="bold"`
y no pasaría nada.

```tsx
<Header titleProps={{ fw: "bold", fz: "h4", c: "gray.700", ta: "center" }} />
```

### Por qué `TextSlotProps` y no `TextProps`

`TextProps` es genérico con `component?: C` y `C` por defecto `"p"`, así que `TextProps` a secas fija
`component?: "p"` y **el consumidor no podría cambiar el elemento**. `TextSlotProps` es el mismo
juego de props con `component?: ElementType`:

```ts
export type TextSlotProps = TextOwnProps & Omit<ComponentPropsWithoutRef<"p">, keyof TextOwnProps>;
```

Los dos alias viven en `Box.types.ts` y `Text.types.ts`, junto al componente al que pertenecen.

### El vocabulario es el de Nebula

Se mantiene `rowProps`/`leadProps`/`headingProps`/`trailProps`/`bodyProps` frente a
`wrapperProps`/`headProps`. Son más descriptivos, y lo que hacía falta no era renombrarlos sino que
**las props llegaran de verdad a los componentes internos**, que es lo que arregla esta enmienda.

## Consecuencias

- **Siete componentes convertidos**: `Header`, `Alert`, `EmptyState`, `EmptyModule`, `Stat`,
  `Feature` y `Blockquote`. Sus nodos pasan de DOM crudo a `Box`/`Text`.
- **Coste medido**: entre 104 y 299 B brotli por componente —`Header` +171 B pese a convertir siete
  nodos—. `Box` y `Text` son baratos una vez `style-props` ya está en el grafo. Cuatro presupuestos
  subidos.
- `BoxProps` y `TextProps` declaran ahora `component?: C | undefined`. Sin el `| undefined`,
  `exactOptionalPropertyTypes` impide esparcir una prop de ranura sobre el componente, que es
  justamente el uso para el que existe.
- `EditorImage` queda fuera: su `editorProps` son las props de un peer (Pintura), no de un nodo que
  Nebula pinte. Sigue con `Record<string, unknown>` y es la excepción que ADR-098 no contempló.
- El resto del catálogo entra por tandas, con el mismo patrón y midiendo cada bloque.
