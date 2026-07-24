# FieldError

Muestra el error de un campo como **burbuja flotante** sobre el control (patrón del `Error` de fonicredito), en vez de texto inline debajo. Envuelve al control y publica el mensaje con `role="alert"`, flecha y fondo de color de estado. Es el modo por defecto de los inputs y de `FormField` (`errorDisplay="tooltip"`).

## Animación

La burbuja entra y sale con el componente `Transition` (preset `scale`), por lo que hereda los tokens de motion del theme (duración y `tier: "minimal"`/`prefers-reduced-motion` → sin animación). `Transition` monta y desmonta la burbuja vía `AnimatePresence`, de modo que el mensaje se conserva durante la salida sin lógica sticky adicional.

Coste: `Transition` arrastra `motion` (~27 kB por módulo aislado), así que `FieldError`, `FormField` y los inputs que lo consumen quedan en la banda compuesta de ADR-022 (≤48 kB). En una app real `motion` se comparte, no se paga por input. El `Tooltip` interactivo genérico (hover/focus con React Aria) llega en W2.4.

## Posición

`position` acepta `top` · `top-left` · `top-right` · `bottom` · `bottom-left` · `bottom-right` (default `top-left`). Los ejes se resuelven con `inset`/`margin` (no `transform`, que lo controla `motion`): las variantes centradas usan `margin-inline: auto` y la flecha se ancla al 50 %. `FormField` lo expone como `errorPosition`.

## Cuándo aparece y cuándo se va

`FieldError` **no decide** el momento: refleja el estado del field (`touched` + `status` + `error`) o el `message` que le pase el input. El "aparece al enviar y se limpia al escribir" se configura en el binding del formulario, no aquí. Con form-atoms basta con que `validate` devuelva `[]` para el evento `change`:

```ts
function ClearOnChange(schema: z.ZodType) {
  return ({ value, event }: { value: unknown; event: string }): string[] => {
    if (event === "change") return [];
    const parsed = schema.safeParse(value);
    return parsed.success ? [] : parsed.error.issues.map((issue) => issue.message);
  };
}
```

El field pasa a `valid`, `errorMessage` queda `undefined` y `Transition` desmonta la burbuja. Ver la story `Forms/Form (form-atoms + Zod)`. Sin `field` (input controlado por la app), el mismo efecto se logra limpiando la prop `error` en el `onChange`.

## Estado y color

Acepta el `field: NebulaField` directo (lee `touched`+`status`+`error`) o `message`/`status`/`error` ya resueltos por el input/`FormField`. Con `status="validating"` muestra "Validando…" en color `info` tras un retardo de 500 ms; en error usa `error`. El color se resuelve a `scale.600` (fondo) + `scale.50` (texto) — contraste alto e independiente del tema, sin hex crudos.

## a11y

`role="alert"` anuncia el error al montarse la burbuja; el `<input>` conserva `aria-invalid`. En `errorDisplay="text"` el error vuelve a texto inline con `aria-describedby`. El vínculo `aria-describedby` → burbuja queda como mejora futura.
