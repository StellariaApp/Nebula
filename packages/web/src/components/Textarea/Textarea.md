# Textarea

Campo de texto de varias líneas con la misma envoltura que `TextInput`: etiqueta, descripción, requerido y error vienen de `FormField`, y el control comparte superficie y anillo de foco con el resto de campos (`styles/field.css.ts`).

## Contrato

- La etiqueta nombra el control (`<label for>`); `description` y, con `errorDisplay="text"`, el error cuelgan de `aria-describedby`. Con la burbuja por defecto el error se anuncia como `role="alert"` y el campo queda `aria-invalid`.
- Enter inserta un salto de línea; el valor que llega a `onChange` es el texto completo.
- `autosize` hace crecer el campo con el contenido en vez de mostrar scroll.
- Deshabilitado sale del orden de Tab.
