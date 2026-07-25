# ADR-026 — `Segment` compound (adelanta Tabs) y motion con spring para los selectores

- **Estado**: aceptada · 2026-07-24 (checkpoint posterior a W2.4 con el propietario)
- **Contexto**: `docs/00-inventory.md` (fila 37 del anexo) reparte el `Segment` de fonicredito en dos componentes de Nebula: *"Control→SegmentedControl; Content swipeable→Tabs native"*. Al usarlo en la práctica ese reparto obliga al consumidor a cablear a mano el `value` entre `SegmentedControl` y `Tabs` en cada pantalla, que es exactamente el prop-drilling que el compound de fonicredito evita. Además, `Switch` y `SegmentedControl` animaban con transiciones CSS, sin el spring del tema que la plantilla canónica fija como capa 3 (ADR-004/ADR-018).

## Decisión

1. **Se crea el compound `Segment`** (`Segment.Control` + `.Content` + `.Header` + `.Footer`) con el estado del valor en un contexto propio, siguiendo la forma del componente de fonicredito. Adelanta a este bloque la pieza de contenido que el roadmap situaba en W2.5.
2. **`SegmentedControl` se elimina del catálogo.** Su caso de uso —elegir un valor entre segmentos— es exactamente un `Segment` con `Segment.Control` y sin `Segment.Content`, así que mantener dos componentes para lo mismo solo duplicaba superficie de API, tests y budget. `Tabs` se conserva como atajo declarativo (`data` con `label` + `content`) sobre el mismo compound.
3. **La semántica depende de si hay paneles**, no del nombre del componente. `Segment.Control` emite:
   - **`tablist`** (`role="tab"` + `aria-controls` + `role="tabpanel"`) cuando el `Segment` contiene un `Segment.Content`, que es lo que exige APG y lo que hace fonicredito (`accessibilityRole="tab"`).
   - **`radiogroup`** con radios nativos cuando no hay paneles. Un `tablist` cuyas pestañas no controlan nada es ARIA incorrecto, así que no se fuerza.

   Esto matiza la fila de `docs/03-a11y-motion-performance.md` §1, que asignaba `useTabList` a Tabs y SegmentedControl por igual: ahora el rol lo decide la composición. El doc se actualiza en este mismo PR.
4. **Motion con spring del tema** (`theme.motion.spring`) sustituye a las transiciones CSS en el indicador de selección y en el thumb del `Switch`, con `LazyMotion` + `m.*` como manda la plantilla.
5. **Gesto de arrastre con imán** en los tres: thumb del `Switch`, indicador del control y paneles de `Segment.Content`. Al soltar se resuelve el destino por posición **y** velocidad, y el resultado se confirma con el mismo spring. Se desactiva con `prefers-reduced-motion` y con `motion.tier: "minimal"`, igual que el resto del motion del sistema.

## Alternativas

- **Mantener el reparto del inventario sin compound**: cero cambios de documentación, pero deja el cableado del `value` en el consumidor en cada uso. Rechazada por el propietario en el checkpoint.
- **Conservar `SegmentedControl` junto al compound**: evita tocar un componente ya publicado en W2.3, a cambio de dos componentes con la misma función. Rechazada por el propietario: `Segment` sin `Content` ya cubre ese caso con el rol ARIA correcto.
- **Conservar las transiciones CSS**: mantiene `Switch` y `SegmentedControl` en la banda de primitivos, pero impide el arrastre (que necesita el valor animado en JS) y rompe la coherencia de motion con Button/ActionIcon.

## Consecuencias

- `docs/00-inventory.md` (fila 37 del anexo y §1.10) y `docs/03` §1 se actualizan en este PR.
- `Tabs` sale de W2.5 y entra aquí; W2.5 hereda el resto de Navegación.
- `SegmentedControl` desaparece del catálogo: se retiran su carpeta, su entrada de `size-limit` y sus exports. `docs/00-inventory.md` §1.4 lo marca como absorbido por `Segment`. Los consumidores migran cambiando `<SegmentedControl data … />` por `<Segment><Segment.Control data … /></Segment>`; `data` sigue aceptando strings sueltos.
- **Budgets medidos** (brotli por módulo). El gesto obliga a cargar el bundle `domMax` de motion en vez de `domAnimation`, que no incluye drag:

  | Componente | Antes | Medido | Límite |
  | --- | --- | --- | --- |
  | Switch | 11,0 | 48,6 | 56 |
  | Segment (compound) | 10,1 (SegmentedControl) | 50,9 | 58 |
  | Tabs | — | 51,1 | 60 |

  El salto es de medición en frío: `motion` ya viaja con Button, ActionIcon, Transition y toda la capa de overlays de W2.4, de modo que una app real que use cualquiera de ellos no paga nada extra. Los límites se recalibran con medición, como en ADR-018/022/025.
- El arrastre no sustituye a ninguna interacción existente: click, teclado y lectores de pantalla siguen operando el componente sin gesto. El gesto es una mejora progresiva sobre controles que ya son accesibles.
