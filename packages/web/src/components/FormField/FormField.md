# FormField

Input.Wrapper del sistema de forms (docs/00 §1.4). Genera los ids y cablea el contrato a11y de inputs (docs/03 §1): `label` vinculado por `htmlFor`, `description` y `error` referenciados por `aria-describedby`, `aria-invalid` y `aria-required` en el control. El mensaje de error va en `role="alert"` para anunciarse en vivo.

## Cómo entrega las props al control

Con render-prop: `FormField` calcula `{ id, aria-describedby, aria-invalid, aria-required }` y se las pasa a la función hija, que las esparce en el control:

```tsx
<FormField label="Email" description="Nunca lo compartimos" error={err} required>
  {(control) => <input {...control} />}
</FormField>
```

Los inputs de Nebula (TextInput, etc.) usan este render-prop internamente y además leen el estado del `NebulaField` con `useFieldProps` (ADR-005). `error` acepta `string` (mensaje) o `true` (inválido sin texto). `useId` da ids estables SSR-safe, por eso el componente es `"use client"`.

## `errorProps` no llega igual a los dos modos

`errorDisplay` elige entre dos pinturas distintas del mismo error:

- **`"tooltip"`** monta un `FieldError`, y `errorProps` se esparce entero sobre él: `position`,
  `offset`, `color`, `validatingLabel` y sus style props.
- **`"text"`** no monta `FieldError`: pinta un `Text` con `role="alert"` bajo el control. Ahí de
  `errorProps` **solo se honra `className`**, porque el resto son props que ese nodo no tiene.

Se deja escrito porque es la misma trampa que ADR-098 documenta para las ranuras que aceptan
`string | ReactNode`: la prop existe siempre, pero lo que aplica depende de lo que el componente
acabe pintando.

`errorProps` sustituye a `errorPosition` y `errorOffset`, que eran el patrón de ranura hecho a mano
—una prop pública por cada campo que se quisiera alcanzar—. No las usaba nadie fuera de este
componente.

## Las seis ranuras viajan juntas

`FormFieldSlotProps` agrupa `labelProps`, `descriptionProps`, `requiredProps`, `headerProps`,
`bodyProps` y `errorProps`. Los 27 componentes de campo que montan un `FormField` la extienden y la
reenvían en bloque, así el contrato no puede divergir entre ellos: si aquí se añade una ranura, la
tienen los 27 sin tocarlos.
