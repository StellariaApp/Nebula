# ADR-035 — Convergencia de la ergonomía de consumo de tfv y fonicredito

- **Estado**: aceptada · 2026-07-28 (decisión del propietario en el checkpoint de auditoría de código y diseño)
- **Contexto**: los dos repos que Nebula debe sustituir exponen sobre sus componentes un conjunto de
  props de conveniencia que Nebula no tiene: `tooltip` y `tooltipProps`, `href` y `linkProps`, `icon` e
  `iconPosition`, `onlyIcon`, `mini`, `selected`, `error`, y `isLoading` como nombre del estado de
  carga. En `tfv-frontend/packages/components/Button/index.tsx` esas props gobiernan las tres ramas del
  componente; en `fonicredito-app` el equivalente pasa por `collector.ts` y las variantes de Unistyles.

  Sin ellas, cada pantalla migrada necesita un envoltorio propio, y el objetivo declarado de Nebula es
  que la personalización entre productos ocurra vía tema y composición, no vía forks ni capas
  intermedias por app.

  La objeción evaluada y descartada por el propietario es real y queda registrada: `tooltip` acopla
  Button a Tooltip, y `href` acopla un primitivo a la capa de navegación. La decisión asume ese coste;
  este ADR fija cómo pagarlo sin romper `docs/01` §1 —el núcleo permanece libre de dominio— ni
  ADR-014 —sin dependencias de runtime nuevas.

## Decisión

Se adopta **todo el conjunto**. Cada capacidad de los repos de referencia funciona en Nebula. Donde
Nebula ya tiene un mecanismo equivalente, la prop se define como **atajo documentado sobre ese
mecanismo**, nunca como una segunda implementación paralela.

| Prop de referencia        | Tratamiento en Nebula                                                                   |
| ------------------------- | --------------------------------------------------------------------------------------- |
| `tooltip`, `tooltipProps` | Prop nativa. Si `tooltip` está presente, el componente se envuelve en `Tooltip`         |
| `href`, `linkProps`       | Prop nativa. Renderiza `<a>`; el componente de enlace es inyectable (ver regla 2)       |
| `icon`, `iconPosition`    | Atajo sobre `leftSection` / `rightSection`, con `iconPosition` por defecto `"right"`    |
| `onlyIcon`                | Prop nativa: oculta el label conservando el nombre accesible. Acepta valor responsive   |
| `mini`                    | Atajo de `size="xs"` + `radius="full"`; no introduce una escala nueva                   |
| `selected`                | Prop nativa: estado de activación persistente, publica `aria-pressed` y `data-selected` |
| `error`                   | Prop nativa: estado inerte con color semántico de error                                 |
| `isLoading`               | Alias de `loading`. `loading` sigue siendo el nombre canónico                           |

Reglas que hacen viable lo anterior:

1. **`tooltip` no puede costar peso a quien no lo usa.** El envoltorio se resuelve con import estático
   de `Tooltip` en los componentes que exponen la prop —Button, ActionIcon, Badge y NavLink—, y el
   delta se refleja en sus entradas de `size-limit` en el mismo PR. Si el coste medido excede el
   budget, la salida es restringir la prop a Button y ActionIcon, no levantar el budget.

2. **`href` no acopla Nebula a ningún router.** El componente renderiza `<a href>` nativo. Para
   integrar el enrutado de la app, `NebulaProvider` acepta un slot `linkComponent`; cuando está
   definido, los componentes con `href` lo usan en lugar de `<a>` y le pasan `linkProps`. Así
   `next/link` de tfv y el enrutador de fonicredito se inyectan desde la app y el core no adquiere
   ninguna dependencia. Es el mismo patrón de resolver inyectado que ya usa `PermissionGate`.

3. **`onlyIcon` exige nombre accesible.** Al ocultar el label, el componente requiere `aria-label` o un
   `tooltip`; sin ninguno de los dos, falla en desarrollo. Un botón sin nombre accesible es un defecto
   de a11y, y `docs/03` no admite excepción.

4. **`error` no es una variante cromática.** Es un estado: fija el color semántico de error, marca
   `data-error`, y **no** convierte el botón en no interactivo a efectos de a11y — se comunica con
   `aria-invalid`, no retirando el foco. La implementación de tfv usa `cursor: not-allowed` con
   `!important`; no se replica.

5. **`selected` es distinto de `data-pressed`.** `pressed` es transitorio, mientras el puntero está
   abajo; `selected` es persistente. Se publican por separado y el CSS los distingue.

6. **El conjunto no se amplía por analogía.** Cualquier prop de conveniencia futura entra por ADR con
   evidencia de uso en un repo consumidor real. Esta lista se cierra aquí.

## Alternativas

- **Mantener Nebula mínimo** y dejar los atajos a una capa fina de envoltorios por app: rechazada por
  el propietario. Mantiene el core más limpio y el bundle más bajo, pero reproduce en cada app
  consumidora la capa que Nebula existe para eliminar.
- **Convergir solo las de mayor uso** (`icon`, `iconPosition`, `onlyIcon`, `selected`), dejando fuera
  `tooltip` y `href` por acoplamiento: rechazada. Es la frontera técnicamente más limpia, pero deja
  fuera dos de las props más frecuentes en las pantallas reales de tfv.
- **Copiar los nombres de tfv literalmente**, incluidos `mini` como escala propia y `isLoading` como
  nombre canónico: rechazada. Produciría dos formas de expresar lo mismo dentro del propio catálogo,
  que es peor que la diferencia de nombre que evita.
- **Que `href` importe el `Link` del framework**: rechazada. Rompe `docs/01` §1 y ADR-014.

## Consecuencias

- **Ampliación notable del contrato público** de los componentes de acción. Es aditiva y los paquetes
  siguen `private: true`.
- **Acoplamiento aceptado de Button, ActionIcon, Badge y NavLink a Tooltip.** Es el coste explícito de
  la decisión; queda acotado por la regla 1 y medido por `size-limit`.
- **`NebulaProvider` gana el slot `linkComponent`**, con su ADR de contrato cubierto aquí mismo. Sin
  slot definido, el comportamiento por defecto es `<a>` nativo y todo sigue funcionando.
- **`onlyIcon` responsive depende de ADR-032**: sin condiciones en sprinkles no puede expresarse. T7
  del plan va después de T3 por esta razón.
- **Native hereda el conjunto**, salvo `href`, que en `@stellaria/nebula-native` se resuelve con el
  slot de navegación equivalente. Cubierto por el lint de paridad W/N.
- `docs/00-inventory.md` y las fichas de API de los componentes afectados se actualizan en el mismo PR.
