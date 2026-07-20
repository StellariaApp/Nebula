# Box

Primitivo polimórfico de layout y equivalente web del Collector de `@stellaria/nebula-native`: mismo contrato de props (`BaseProps`/`Keys*` de `@stellaria/nebula-tokens`), distinta mecánica de aplicación.

## Cómo reparte las props

`ExtractStyleProps` (en `src/utils/style-props.ts`) separa tres grupos:

1. **Tokens** (`p="md"`, `bg="surface.raised"`) → clases atómicas de sprinkles, cuyos valores son `var(...)` del contrato. Cambiar de tema las repinta sin recomputar nada en JS.
2. **Valores libres** (`w={240}`, `mah="50vh"`) → estilo inline, porque no existe una clase atómica para un valor arbitrario.
3. **El resto** → al elemento tal cual.

Que los tokens NO acaben en estilo inline es lo que garantiza el zero-runtime de ADR-002; hay un test que lo verifica.

## Qué colores se exponen

Solo roles semánticos y escalas semánticas (`primary`, `accent`, `gray`, `success`, `warning`, `error`, `info`). Las 16 paletas crudas no están en las style props aunque sí existan en `theme.colors`: los componentes leen roles (docs/02 §2.1).

`bdc` (borderColor) admite únicamente roles, no escalas: cada valor añade una clase atómica por propiedad y exponer las escalas ahí triplicaba el CSS sin uso real.
