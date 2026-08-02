# ADR-075 — El chrome fijo entra en la navegación por ancla

- **Estado**: **aceptada** · 2026-08-02 — reportado por el propietario durante WB
- **Resuelve**: tres defectos con la misma raíz — **una barra fija que nadie descuenta**: el ancla
  dejaba la sección debajo del nav, el indicador activo se pasaba a la siguiente sección, y el salto
  era seco.
- **Amplía**: `chrome` en `useScrollSpy`, `smooth` en `Main` con `useAnchorSpring`, y las reglas de
  borde del activo de `Nav`.
- **Enmienda**: el modo `hash` de [ADR-068](ADR-068-nav-de-sitio-en-web.md), que resolvía el activo
  **solo** por scroll-spy.

## Contexto

Medido sobre la landing antes de tocar nada: al pulsar un enlace del nav, el scroll saltaba de golpe
—`1684` en la primera muestra y en todas— y **el comportamiento era idéntico con `momentum`
encendido y apagado**. No había regresión que arreglar: el salto suave de página nunca existió. El
único `scroll-behavior: smooth` del catálogo está dentro de `Scroll`, detrás de su prop.

Los otros dos síntomas venían de lo mismo. `useScrollSpy` sitúa su marcador en
`scrollY + innerHeight * 0.34` sin descontar la barra: al saltar a una sección, su borde queda tapado
por el chrome y el marcador cae ya dentro de la siguiente. Y `scroll-padding-top` no lo ponía nadie.

## Decisión

1. **`useScrollSpy` recibe `chrome`** y sitúa el marcador dentro del alto **visible**:
   `chrome + (innerHeight - chrome) * offset`. Sin ese descuento, el `offset` mide sobre una zona que
   incluye píxeles que el usuario no ve.

2. **El nav se mide solo.** `useStickyChrome` sube por los ancestros del `<nav>` hasta encontrar el
   primero `sticky` o `fixed` y observa su alto con `ResizeObserver`. El consumidor no calcula nada:
   por el principio §0 del plan de marca, si cada landing tuviera que pasar la altura a mano, el
   sistema no tendría el dato — lo tendría cada landing.

3. **`Main` publica `scroll-padding-top`** con la altura de esa misma barra, sobre
   `document.documentElement` y solo mientras está montado. Es la mitad que le toca al componente de
   página: el spy decide qué se resalta, `scroll-padding` decide dónde para el scroll.

4. **`Main` gana `smooth`**, encendido por defecto y apagado por `reduced-motion` o
   `tier: "minimal"`.

5. **El salto de ancla lo lleva el muelle del tema, no `scroll-behavior`.** La curva del
   `scroll-behavior: smooth` nativo la decide el navegador y **no se puede calibrar**: con él, la
   rueda tendría la física del tema y los enlaces la de Chrome. `useAnchorSpring` se queda los clics
   que puede resolver —ancla interna, destino existente, sin modificador—, descuenta el
   `scroll-padding-top` y anima con el mismo `ScrollSpring` que la rueda, así que `spring` gobierna
   las dos.

   El CSS se mantiene como respaldo para lo que el hook no intercepta: teclado, `scrollIntoView` y
   `scrollTo` programáticos.

   Medido con la media query **real** —la story de Storybook inyecta CSS pero no cambia
   `matchMedia`, así que no sirve para verificar esto—:

   | `prefers-reduced-motion` | `scrollY` tras el clic |
   | ------------------------ | ---------------------- |
   | `no-preference`          | 80 → 510 → 1198        |
   | `reduce`                 | 1326 → 1326 → 1326     |

6. **El activo lo sigue decidiendo el scroll, con tres reglas nuevas.** Se probó fijarlo al hash
   pulsado, y resolvía un caso rompiendo otros —el primer enlace quedaba activo al cargar, y volver
   al inicio no lo soltaba—. El scroll sigue mandando; lo que faltaban eran los bordes:

   - **Sin sección cruzada, no hay activo.** Antes se devolvía `ids[0]` por defecto, así que el
     primer enlace aparecía activo nada más cargar aunque su sección estuviera más abajo.
   - **Al final del recorrido, el último.** La última sección puede no llegar nunca al marcador si el
     documento se acaba antes, y sin esta regla es inalcanzable.
   - **El marcador no se sale de la sección que ocupa la parte alta.** Es la corrección de fondo, y la
     encontró el propietario: pulsar «Solución» dejaba el activo en «Capacidades».

     El marcador estaba a una fracción del **viewport** —0.34— sin ninguna relación con el tamaño de
     las secciones. Cuando una sección es más corta que esa distancia, el marcador cae dentro de la
     siguiente y **es imposible que la sección de destino se active**. Medido, saltando a `#solucion`
     con secciones de 380 px:

     | alto de viewport | 800 | 900 | 1080 |  1250 |  1440 |
     | ---------------- | --: | --: | ---: | ----: | ----: |
     | activo (antes)   |  OK |  OK |   OK | **✗** | **✗** |

     Ahora el marcador se acota al final de la primera sección cuyo borde inferior queda por debajo
     del chrome. Con secciones largas no cambia nada; con secciones cortas, la de destino gana. Los
     cinco altos pasan.

7. **El activo se adelanta al scroll.** Sin esto, pulsar un enlace movía la página y el indicador
   llegaba después, que es exactamente al revés de lo que el gesto comunica: el usuario ya eligió.

   `useAnchorSpring` publica el hash **al empezar** el viaje, no al terminar, y `useNavActive` lo fija
   como activo mientras dura. El pin se suelta solo, en cuanto el spy alcanza ese mismo destino —o
   antes, si el usuario se desplaza por su cuenta—, así que no sobrevive al viaje y no reintroduce el
   defecto de un activo pegado. Medido a los 120 ms del clic, con el scroll aún en `y=113` de 527: el
   indicador ya está en su sitio.

## Consecuencias

- **Verificado sobre el render**, con la barra midiendo 74 px:

  | clic           | activo         | top de la sección |
  | -------------- | -------------- | ----------------: |
  | `#solucion`    | `#solucion`    |             74 px |
  | `#capacidades` | `#capacidades` |             74 px |
  | `#precios`     | `#precios`     |             74 px |
  | `#seguridad`   | `#seguridad`   |            234 px |

  `scroll-padding-top` computa 74 px, exactamente el alto medido de la barra. Ninguna sección queda
  tapada. `#seguridad` para en 234 porque es la última y el documento se acaba: comparte viewport con
  la anterior y **ese es justo el caso que el spy solo no podía resolver**.

- **`Main` toca dos propiedades del elemento raíz** —`scroll-behavior` y `scroll-padding-top`—
  guardando y restaurando el valor previo al desmontar. Es la única forma de gobernar el scroll de la
  página desde un componente que no es el scroller, y está acotada al tiempo de vida del componente.

- **Tres presupuestos suben 0.5–1 kB**: `Scroll`, `Main` y `Nav`, por el rebote, los dos efectos de
  página y el observador del chrome.
