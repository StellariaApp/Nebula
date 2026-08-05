# ADR-098 — Props de ranura

- **Estado**: aceptada · 2026-08-05 (forma traída por el propietario en el prompt de WN) · **N3**
- **Cambia API pública**: solo añade props opcionales. Ningún cambio _breaking_.

## Contexto

El principio que ordena WN es que **un consumidor tiene que poder ajustar cualquier componente sin
forkearlo**. La personalización entre productos va por tema; la de una instancia, por props de
ranura. No hay tercera vía.

Al empezar N3, el catálogo tenía **cero** componentes con props de ranura. Un consumidor que
quisiera, por ejemplo, cambiar el peso del título de un `Header` no tenía forma: el componente pinta
`<h1 className={styles.title}>` y ese nodo no era alcanzable desde fuera.

## Decisión

Por cada nodo que el componente pinta y el consumidor podría querer ajustar, hay un `<nodo>Props`
con **el tipo de lo que pinta ese nodo**:

```ts
export interface HeaderProps extends Omit<StyleProps, "color"> {
  title?: ReactNode | undefined;
  titleProps?: ComponentPropsWithoutRef<"h1"> | undefined;
  subtitleProps?: ComponentPropsWithoutRef<"p"> | undefined;
  headingProps?: ComponentPropsWithoutRef<"div"> | undefined;
  backProps?: ActionIconProps | undefined;
}
```

Un nodo DOM se tipa con `ComponentPropsWithoutRef<"tag">`; un componente de Nebula, con su propio
`Props`. Nunca `Record<string, unknown>`: el consumidor tiene que ver qué puede pasar.

### El orden del esparcido decide quién gana

Las props de ranura se esparcen **después** de las que calcula el componente, para que el consumidor
gane. `className` es la excepción: se compone con `cx`, y por eso va **después del esparcido**.

```tsx
<Heading id={title_id} {...titleProps} className={cx(styles.title, titleProps?.className)}>
```

Así el consumidor puede sustituir el `id` si lo necesita, pero su `className` **suma** en vez de
borrar el estilo del componente. Al revés —esparcir antes— la prop de ranura no serviría de nada; y
dejando `className` dentro del esparcido, un consumidor que solo quisiera añadir una clase se
quedaría sin componente pintado.

### Cuándo NO hay `<nodo>Props`

Solo hay prop de ranura para nodos que **el componente envuelve**. Si la ranura se pinta cruda, el
consumidor ya la controla entera y añadir la prop sería ruido:

- `CurrencyDisplay` pinta `{prefix}` y `{suffix}` directamente dentro de su `<Text>`, sin nodo
  propio. No lleva `prefixProps` ni `suffixProps`; el consumidor pasa el nodo que quiera.
- Si la ranura acepta `string | ReactNode` y el componente solo envuelve el caso `string`, el
  `<nodo>Props` **solo aplica cuando es string**. Se documenta en el `.md` del componente.

### Delegación

Un componente que delega en otro reexpone las props de ranura del hijo con el tipo del hijo, no con
uno propio:

```ts
titleProps?: EmptyStateProps["titleProps"] | undefined;
```

`EmptyModule` lo hace con `EmptyState`. Así el contrato no se duplica y no puede divergir.

## Primera tanda

Siete componentes, elegidos por ser los que un consumidor toca de verdad —cabecera y contenido—:
`Header` (8 ranuras), `Stat` (7), `EmptyModule` (6), `Alert` (5), `EmptyState` (4), `Feature` (4),
`Blockquote` (3).

**Coste medido**: `Header` pasa de 2.271 a 2.597 bytes en crudo, +326 B por ocho props de ranura —unos
40 B cada una—. Ninguna de las 183 entradas de `.size-limit.js` se rompió con la tanda entera.

## Consecuencias

- El patrón queda establecido y medido; el resto del catálogo se hace por tandas.
- `Header`, `EmptyModule` y `Charts` venían señalados por el informe de N2
  ([`wn-n2-candidatos-a-compound`](../reviews/wn-n2-candidatos-a-compound-2026-08-05.md)) como casos
  de N3 y no de compound: no necesitan reordenarse, necesitan ajustarse. `Charts` queda para la
  siguiente tanda por vivir en un subpath.
- `Hero` y `Section`, que el mismo informe sí propone como compound, quedan fuera a propósito hasta
  que se decida si se convierten: las dos cosas son compatibles, pero conviene decidir el montaje
  antes de fijar las ranuras.
