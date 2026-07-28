# ADR-030 — El provider publica el contenedor de portales de los overlays

- **Estado**: aceptada · 2026-07-27 (decisión del propietario)
- **Contexto**: `NebulaProvider` materializa el tema aplicando la clase de Vanilla Extract a un `<div>`
  propio (ADR-016), de modo que todas las CSS vars del contract viven en ese subárbol. Los overlays
  construidos sobre `<Overlay>` de React Aria portalizan su contenido a `document.body`, que está
  **fuera** de ese `<div>`.

  Consecuencia: el contenido portalizado se resuelve sin ninguna var del contract. No es una
  degradación parcial —color, radio, espaciado, sombra y z-index vienen todos de ahí—, así que el
  overlay se renderiza esencialmente sin estilo.

  Afecta a siete componentes de Tier 1: `Popover`, `Tooltip`, `Menu`, `ContextMenu`, `Select`,
  `Combobox` y `MultiSelect`. `Modal` y `Drawer` no, porque montan un `<dialog>` nativo en su sitio.

  El defecto llevaba abierto desde W2.4 sin que ningún gate lo viera, por dos razones que se refuerzan:

  - `preview.tsx` del playground añadía la clase del tema a `document.body` en su decorator. Eso cubría
    el destino del portal, así que tanto la revisión visual como axe —que audita `body` justamente para
    alcanzar los overlays— veían el resultado correcto.
  - `ColorSchemeScript` fija `data-nebula-theme` y `color-scheme` en `<html>`, pero no la clase de
    Vanilla Extract, así que tampoco compensaba nada en una app real.

  Verificado con un test que compara el ancestro temado del trigger y el del contenido: el trigger
  queda dentro de la clase del tema, el contenido del popover cuelga directo de `<body>` sin ella.

## Decisión

1. `NebulaProvider` monta un contenedor de portales vacío (`data-nebula-portal`) como último hijo de su
   `<div>` temado y lo publica con `UNSAFE_PortalProvider` de `react-aria`. Todo overlay descendiente
   portaliza ahí y conserva el ámbito del tema.
2. El contenedor se referencia con **estado**, no con `useRef`. `Overlay` resuelve `getContainer()`
   durante el render, así que con una ref el primer render encontraría `null` y un overlay con
   `defaultOpened` caería a `document.body`. El callback ref con estado fuerza un render adicional al
   montar, tras el cual el contenedor ya existe.
3. Cada `NebulaProvider` publica el suyo. Providers anidados o hermanos —el caso de la lámina
   `ThemeMatrix`— portalizan cada uno dentro de su propio ámbito, que es la semántica correcta.
4. El gate deja de enmascararlo: el decorator del playground ya no añade la clase del tema a `<body>`.
   Sigue pintando el fondo del canvas, pero leyendo el color del objeto del tema en vez de una var, que
   es lo que exigía la clase.
5. `src/__tests__/portal-theme-scope.test.tsx` cubre los siete componentes y afirma que su contenido
   portalizado tiene un ancestro con la clase del tema.

No se añade dependencia: `UNSAFE_PortalProvider` ya viene en `react-aria@3.50.0`.

## Alternativas

- **Que el provider aplique la clase del tema a `document.body`**: rechazada. Es un efecto secundario
  sobre un nodo global, rompe con dos providers en la misma página y hace imposible la comparación
  lado a lado de temas.
- **Pasar `portalContainer` a cada `<Overlay>`**: rechazada. Resuelve lo mismo repitiendo el cableado
  en siete componentes y en todos los futuros, en vez de una vez en el provider.
- **Documentar que el consumidor debe poner la clase en `<html>`**: rechazada. Traslada al consumidor
  un problema del contrato, y contradice el modelo de `02-theming.md` §4, donde cambiar de tema es
  responsabilidad del provider.

## Consecuencias

- El contenido de overlay pasa a renderizarse dentro del subárbol del provider en lugar de en
  `document.body`. Los overlays se posicionan con `position: fixed`, así que su colocación no cambia,
  pero **un ancestro con `transform`, `filter` o `contain` por encima del provider crea un bloque
  contenedor** y desplazaría el overlay. El contenedor se monta sin restricciones de overflow para no
  aportar el problema por sí mismo; el caso del ancestro transformado es responsabilidad de la app y
  debe documentarse al publicar (W5).
- El prefijo `UNSAFE_` es de React Aria y señala que la API puede cambiar entre minors. Queda anotado
  como punto de revisión al subir de major.
- Es un bloqueante de W5 que se cierra antes de la publicación, no después.
- Habilita `ThemeMatrix` para overlays, que era imposible mientras el contenido salía del ámbito.
