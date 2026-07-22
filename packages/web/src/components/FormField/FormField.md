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
