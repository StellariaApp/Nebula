# ADR-044 — `surface.hover` y `surface.active` como roles de interacción

- **Estado**: **aceptada** · 2026-07-28 (checkpoint de `prompts/5-review/RV-revision-visual-contra-figma.md`;
  decisión del propietario)
- **Revisión de origen**: `docs/reviews/visual-calibration-2026-07-28.md` §2 (causa (a)).

## Contexto

Accordion y Pagination usan `surface.sunken` como color de hover. En `nebula-dark` el hover es
invisible, y el defecto es del contrato, no de los dos componentes.

Relación entre `surface.sunken` —el hover— y `surface.base` —el canvas sobre el que se apoyan—:

| Tema         | `sunken` / `base` |
| ------------ | ----------------: |
| nebula-dark  |          **1.01** |
| nebula-light |              1.06 |

**1.01:1 no es un hover débil: es ninguno.** Y el escalón varía más de 10× entre temas, así que
ningún ajuste local lo arregla en los cuatro a la vez.

### Lo que el Figma resuelve y `docs/06` no decía

`docs/06` §5 define la escalera de elevación pero no fija cuánto ni hacia dónde se mueve una
superficie que responde al puntero. El archivo de diseño (`Polaris`, `SYZgKuK5o70lmfxVNljxww`) lo
resuelve con dos componentes independientes —`Menu Item` en `State=Hover` y `Sidebar Nav Item` en
`State=Active`— que coinciden en valor:

| Modo  | Superficie | Hover     | Escalón | Dirección         |
| ----- | ---------- | --------- | ------: | ----------------- |
| Light | `#FFFFFF`  | `#F4F7FB` |   1.075 | baja (oscurece)   |
| Dark  | `#0A0F1C`  | `#111827` |   1.078 | **sube** (aclara) |

Dos hechos que el contrato actual no puede expresar:

1. El escalón es **simétrico**: ~1.08 en ambos esquemas.
2. La dirección **se invierte con el esquema**. En light el hover oscurece; en dark aclara.

`surface.sunken` significa «superficie hundida»: oscurece siempre. Por eso funciona en light y
desaparece en dark. Que se usara como hover fue una apropiación por falta de un rol adecuado.

### Por qué no sirve `surface.raised`

Es la alternativa que la revisión dejó planteada, y el Figma la descarta. La dirección de `raised`
la fija la elevación —una superficie elevada aclara en dark y aclara también en light—, mientras que
la del hover depende del esquema. Un rol de elevación no puede cubrir un rol de interacción cuyo
signo cambia. Además `docs/06` §5 fija que «hover no _salta_ más de un nivel»: usar el nivel 1 como
hover del nivel 0 convierte esa regla en tautología y deja sin expresar la diferencia entre una card
y una fila con el puntero encima.

## Decisión

1. **`SurfaceRole` gana dos miembros**: `hover` y `active`. La unión pasa de cuatro a seis:

   ```ts
   export type SurfaceRole = "base" | "raised" | "overlay" | "sunken" | "hover" | "active";
   ```

2. **Son roles de interacción, no de elevación.** No participan en la escalera de `docs/06` §5 ni en
   la calibración de ADR-028. Expresan la respuesta de una superficie al puntero (`hover`) y a la
   pulsación (`active`), y su dirección la decide el esquema del tema, no el nivel.

3. **Calibración en los cuatro temas oficiales**, con el escalón del Figma como objetivo:

   | Tema         | canvas (`base`) | `hover`            | ratio | `active`           | ratio |
   | ------------ | --------------- | ------------------ | ----: | ------------------ | ----: |
   | nebula-dark  | `dark.100`      | `dark.400` (sube)  | 1.085 | `dark.500` (sube)  | 1.128 |
   | nebula-light | `light.50`      | `light.300` (baja) | 1.062 | `light.500` (baja) | 1.150 |

   `active` se calibra al doble del delta de `hover`, no al doble del ratio: la pulsación es un
   estado momentáneo que debe leerse sin ambigüedad.

   Un tema claro toma sus dos valores de la paleta `light` y no de `gray` porque `gray` no tiene
   escalón fino —`gray.100` ya salta a 1.114— y porque ese tema **ya** mezcla ambas paletas
   (`base: gray.50`, `raised: light.50`).

4. **El gate de contraste cubre los roles nuevos.** `SURFACES` en `tools/contrast-check/src/pairs.ts`
   pasa de cuatro a seis entradas, de modo que `text.primary`, `text.secondary` y `text.muted` se
   miden también sobre `hover` y `active` en los cinco temas.

5. **Accordion y Pagination migran a `surface.hover`** en el mismo PR. Son los dos consumidores que
   motivan el ADR y quedarían con el defecto si el rol se añadiera sin aplicarse.

## Alternativas

- **Solo `surface.hover`**, dejando `active` para cuando haya evidencia de diseño: ampliación mínima
  y estrictamente respaldada por el Figma, que no muestra estado pulsado. Rechazada por el
  propietario en el checkpoint: ampliar el contrato cuesta lo mismo una vez que dos —cuatro temas,
  schema de Zod, Theme Creator y paridad native— y repetir la migración en semanas es peor que
  calibrar `active` por derivación del escalón de `hover`.
- **Sin roles nuevos, recalibrando `sunken` y `raised`** para que el salto sea perceptible en ambos
  esquemas: coste de contrato cero, pero el Figma la contradice en light —el hover oscurece y
  `raised` aclara— y obligaría a un rol a servir dos direcciones opuestas. Rechazada.
- **Un rol único `surface.interactive`** con la intensidad resuelta por opacidad en el componente:
  amplía el contrato en un solo campo, pero devuelve al `.css.ts` la decisión de cuánto responde una
  superficie, que es justo lo que ningún tema podría recalibrar. Rechazada por el mismo motivo que
  ADR-033 retiró las alturas de los `.tsx`.

## Consecuencias

- **Ampliación aditiva del contrato público.** `NebulaTheme.colors.surface` gana dos claves
  obligatorias. Todo tema de terceros que hoy valide contra el schema deja de validar hasta añadirlas;
  los paquetes siguen `private: true`, así que no hay consumidores externos.
- **El schema de Zod no se toca a mano**: `packages/themes/src/schema.ts` deriva de `surfaceRoles`
  (`z.record(z.enum(surfaceRoles), colorValue)` y la plantilla `surface.<rol>`), de modo que ampliar
  el enum propaga la validación y las referencias `surface.hover` en `variantMap`.
- **Colisión de valor conocida y aceptada**: en `nebula-dark`, `active` y `overlay` resuelven ambos a
  `dark.500`. Son roles distintos que nunca conviven adyacentes —un overlay y el estado pulsado de un
  elemento sobre canvas—, que es el criterio que ADR-028 ya fijó para los pares que colapsan.
  Un tema puede separarlos sin tocar el contrato.
- **Paridad native sin coste hoy**: `packages/native/src` no consume `colors.surface` todavía, así que
  N1 nace con los seis roles en lugar de migrar cuatro.
- **Theme Creator**: no referencia los roles por nombre, de modo que los recoge del contrato. Su
  editor de superficies mostrará dos campos más sin cambios de código.
- **`docs/02-theming.md` §2 y `docs/06-visual-language.md` §5** se actualizan en el mismo PR: el
  primero con los dos roles en el contrato, el segundo con la regla del escalón de interacción
  —magnitud ~1.08 y signo dependiente del esquema— que hasta ahora no estaba escrita.
- **El baseline de ADR-037 debe capturarse después de este cambio**: el hover de Accordion y
  Pagination cambia de valor en los cuatro temas.
