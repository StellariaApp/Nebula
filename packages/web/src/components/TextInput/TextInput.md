# TextInput

Campo de texto con el contrato de forms de W2.3. Compone `FormField` (label vinculado + `aria-describedby` a description/error + `aria-invalid` + `aria-required`, docs/03 §1) alrededor de un `<input>` nativo (nativamente accesible), y `useFieldProps` (ADR-005) para el estado: acepta `field?: NebulaField<string>` o `value`/`onChange` controlado.

## Por qué FormField en vez de useTextField

docs/03 §1 nombra a **FormField** como el mecanismo de vínculo de label para inputs de texto. FormField entrega exactamente el contrato a11y que pediría `useTextField` (label por `htmlFor`, `aria-describedby`, `aria-invalid`, `aria-required`) y el `<input>` nativo aporta el resto del comportamiento accesible. Se reserva React Aria para los toggles (Checkbox/Radio/Switch) y el número, donde los hooks añaden estado/teclado no triviales.

El borde/foco vive en un wrapper con slots (`leftSection`/`rightSection`) para iconos; el `<input>` interno va plano. El estado inválido pinta el borde en `error` vía `data-invalid`.
