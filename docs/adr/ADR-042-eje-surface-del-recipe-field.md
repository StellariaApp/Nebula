# ADR-042 — El tratamiento de superficie de un campo es un eje local del recipe `field`, no una `Variant`

- **Estado**: **aceptada** · 2026-07-28 (checkpoint de la auditoría WV) · **ejecutada en W3.1** (2026-07-29)
- **Auditoría de origen**: `docs/reviews/variantes-cobertura-2026-07-28.md` §2.B.

## Contexto

La pregunta del propietario incluía «¿convendría crear variantes como Button para […] los Input?». La
auditoría WV midió la demanda real en los dos repos que Nebula debe sustituir, y el resultado no la
respalda:

- **fonicredito**: `InputText`, `InputSelect`, `InputSearch`, `InputCheckbox` e `InputPhone` **no
  declaran ningún prop `variant`** (`src/services/shared/components/*/types.ts`). Cero.
- **tfv**: un único `variant="filled"` sobre un input en todo el repositorio, y está en
  `packages/components/SearchInput/index.tsx:20` — dentro de su **propia capa de design system**, junto
  a `radius={50}` y `classNames` propios. Ningún call site de aplicación elige el tratamiento de
  superficie de un campo.
- **tfv lo resuelve donde corresponde**: `packages/themes/index.ts:184-260` fija `--input-bg:
background-2` y `--input-bd: background-4` en los `defaultProps` de `InputBase`, `Input` y `TextInput`.
  Un tratamiento único para todo el producto, decidido **en el tema**.

Nebula ya hace eso mismo: `packages/web/src/styles/field.css.ts:55` define un único recipe `field` con
`surface.raised` + `border.default`, consumido por los nueve campos, con `size` y `multiline` como
únicos ejes. Cambiar el tratamiento de campo de un tenant es hoy cambiar `colors.surface.raised` y
`colors.border.default` en su tema: sin prop, sin runtime y sin contrato nuevo.

Aun así, el propietario quiere el eje disponible. Este ADR fija **cómo** se hace sin romper nada.

## Decisión

1. **El caso B no se resuelve con la unión `Variant`.** `filled` en un botón significa «acento sólido
   del color de acción» y en un campo significaría «superficie de relleno neutra». El mismo nombre para
   dos cosas distintas es exactamente lo que ADR-041 acaba de retirar del catálogo.

2. **Se añade un eje `surface` como variante del recipe `field`**, en
   `packages/web/src/styles/field.css.ts`, con cuatro valores:

   ```ts
   surface: {
     outline:   {/* actual: surface.raised + border.default — default */},
     filled:    {/* surface.sunken + border transparente */},
     underline: {/* fondo transparente + solo borde inferior */},
     unstyled:  {/* sin superficie ni borde; el consumidor la construye */},
   }
   ```

   `outline` es el default y reproduce exactamente el comportamiento actual, de modo que el cambio es
   aditivo y ningún campo existente se mueve.

3. **Es zero-runtime.** Vanilla Extract resuelve el recipe en build; **no se importa `ResolveVariant`**.
   El coste de bundle es el de cuatro reglas CSS más en una hoja compartida por los nueve campos, no
   +2,2 kB por módulo (ADR-039). Los budgets de los campos no se tocan.

4. **No entra en el contrato `NebulaTheme`.** `surface` es vocabulario de la capa web, igual que
   `multiline`. Un tema sigue gobernando el aspecto del campo por sus roles (`colors.surface.*`,
   `colors.border.*`), que es lo que hace tfv y lo que ya funciona.

5. **La prop se expone en el `FormField` raíz**, no en el control interno, siguiendo la regla de
   `docs/patterns/web-component-template.md` §1: «en un campo de formulario van al `FormField` raíz;
   `w="100%"` describe el campo, no la caja de texto».

6. **La ejecución se difiere a W3.** Hoy hay nueve campos; W3 entrega DatePicker, DateTimePicker,
   DateRangePicker, TagsInput, PinInput, Rating, FileInput, ColorInput, JsonInput, InputPhone,
   InputDial, InputCurrency, Signature, Dropzone y Fieldset. Decidir el reparto sobre nueve y
   redecidirlo sobre veinticuatro es hacer el trabajo dos veces; `Signature` y `Dropzone`, en
   particular, pueden no admitir `underline` de forma sensata.

7. **`glass`, `glow` y `gradient` quedan excluidos por contrato**, no por omisión: `docs/06` §6 fija
   que los gradientes «nunca sostienen texto largo» y que el glass «no se anida» —y un campo vive
   dentro de una Card que ya puede ser glass—, y el glow está reservado a acción primaria o selección.

8. **`error` sigue siendo un estado, no una superficie.** ADR-035 regla 4 ya lo fijó; el eje `surface`
   no lo toca y el anillo rojo del campo inválido sigue saliendo de `styles/focus.css.ts` (ADR-036).

## Alternativas

- **No añadirlo** (recomendación original de la auditoría): la evidencia de demanda es nula y el caso
  ya está cubierto por roles de tema. Es la opción más barata y sigue siendo defendible; el propietario
  optó por tener el eje disponible, y este ADR fija la forma que no cuesta contrato ni bundle.
- **Reutilizar la unión `Variant` en los campos**: rechazada. Colisión semántica (punto 1) y arrastraría
  `ResolveVariant` a nueve módulos que hoy no lo necesitan, con `glass`/`glow`/`gradient` expuestos y
  prohibidos por `docs/06` §6 al mismo tiempo.
- **Una unión propia en tokens** (`FieldVariant` en `@stellaria/nebula-tokens`): daría paridad W/N
  declarada en el contrato, a cambio de meter en el contrato compartido un vocabulario que ninguna de
  las dos plataformas ha ejercitado todavía. Se puede promover a tokens más adelante si N2 lo necesita;
  empezar en la capa web es reversible, y empezar en el contrato no.
- **Hacerlo ahora sobre los nueve campos actuales**: rechazada por el propietario a favor de W3, por el
  motivo del punto 6.

## Consecuencias

- **Ampliación aditiva de API en los campos**, con `outline` como default: ningún uso existente cambia
  de aspecto.
- **Coste de bundle ≈ 0** y ningún budget recalibrado. Se verifica con `size-limit` en el PR igualmente.
- **Coste de contrato 0**: no toca `NebulaTheme`, ni los cuatro temas oficiales, ni `load-theme.ts`, ni
  el schema de Zod.
- **Coste de a11y**: `underline` y `unstyled` retiran borde, de modo que el gate de contraste debe
  cubrir el par «borde inferior / superficie» a 3:1 y `unstyled` debe documentar que el nombre accesible
  y el foco siguen siendo responsabilidad del componente, no de la superficie. Entra en el alcance de
  ADR-040.
- **Paridad W/N**: N2 replica el eje sobre Unistyles cuando implemente los campos; al no estar en
  tokens, el lint de paridad lo verifica por nombre de prop, no por tipo compartido.
- Se ejecuta en W3, antes de cerrar el bloque de inputs completos, y `docs/00-inventory.md` §1.4 y las
  fichas de API de los campos se actualizan en ese PR.
