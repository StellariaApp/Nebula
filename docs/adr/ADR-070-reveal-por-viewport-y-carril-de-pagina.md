# ADR-070 — `Reveal` por viewport, y el carril de página de `Main`

- **Estado**: **aceptada** · 2026-08-01 — aprobada por el propietario e implementada el mismo día
- **Resuelve**: el catálogo sirve bien al dashboard (`AppShell`) y se queda corto en la landing. Dos
  huecos concretos: no hay entrada por viewport, y no hay medida de contenido a nivel de página.
- **Amplía**: la API pública de `Section` y `Main` (`docs/00-inventory.md` §1.1) y añade una fila al
  catálogo.
- **Depende de**: [ADR-034](ADR-034-capa-de-motion-compartida.md) (idioma único de motion),
  [ADR-032](ADR-032-style-props-en-todo-el-catalogo.md) (style props), y la regla 2 de
  [`docs/03`](../03-a11y-motion-performance.md) §2 (reduced-motion obligatorio).
- **Vecino de**: [ADR-069](ADR-069-indicadores-de-scroll-y-momentum.md), que introdujo los
  _scroll timelines_ de CSS en el catálogo. La decisión 3 explica por qué aquí **no** se usan.

## Contexto

`AppShell` resuelve el dashboard: shell, slots, landmarks. La landing usa otra pareja —`Main` como
página y `Section` como bloque— y ahí faltan dos cosas que hoy cada consumidor recablea:

**1. No hay entrada por viewport.** `Transition` existe y cubre los siete presets
(`fade`, `scale`, `pop`, `slide-up/down/left/right`, `Transition.tsx:24-32`), pero se dispara por
**`mounted`**, no por posición. Para una landing hace falta el mismo vocabulario con otro disparador.

**2. No hay medida de contenido en la página.** `Main` tiene `padded` (`padding: lg`) y `centered`
(`Main.css.ts:60-66`), las dos de página, pero **ninguna acota el ancho del contenido**. La
consecuencia práctica es que cada landing envuelve cada `Section` en un `Container`, y que la barra
—que desde [ADR-068](ADR-068-nav-de-sitio-en-web.md) sí tiene `contentWidth`— y el cuerpo comparten
carril por convenio y no por construcción.

Y **`Main` no necesita animarse**, que era la tercera pregunta del propietario. Es el landmark, el
skip link, los slots sticky y el backdrop: una entrada a nivel de página anima todo lo que hay
dentro, se solapa con el reveal por sección sobre el mismo contenido, y retrasa el LCP percibido en
el sitio donde `docs/03` §3 pone presupuesto. Lo que le falta no es movimiento.

## Decisión

### `Reveal`

1. **`Reveal` es un primitivo propio, no un puñado de props de `Section`.** Una landing revela más
   cosas que secciones —el hero, las cards, las stats, las imágenes—, y si el comportamiento vive
   dentro de `Section` todo lo demás necesita otro mecanismo. Además `Section` ya expone doce props;
   meterle tres más lo convierte en el componente-cajón que la auditoría ya señaló como ancho.

   Reutiliza **el mismo `TransitionPreset`** que `Transition`, para que el catálogo tenga un solo
   vocabulario de entrada con dos disparadores: `mounted` (`Transition`) y posición (`Reveal`).

2. **La regla que gobierna todo: el contenido se rinde visible.** El estado oculto lo aplica un
   efecto **en cliente**, después de que el observer esté montado; nunca el render inicial ni el CSS.

   No es una precaución teórica. Un reveal que arranca en `opacity: 0` desde la hoja pierde el
   contenido en cuatro casos reales —sin JS, si el observer no llega a montar, si el elemento ya
   está en pantalla al cargar, y si vive dentro de un `Scroll` cuyo desplazamiento el observer no
   vigila— y **ningún gate del repo lo detecta**: axe no marca contenido a opacidad cero, y los
   tests de render lo ven presente en el DOM. Es exactamente la clase de fallo silencioso que T0
   documentó con `Paper`.

   Corolario: `Reveal` es `"use client"`, y su fallback es el contenido tal cual.

3. **`IntersectionObserver`, no `animation-timeline: view()`.** ADR-069 metió los _scroll timelines_
   de CSS en el catálogo, así que la alternativa es legítima y hay que descartarla con motivo: **un
   timeline es estrictamente posicional**, de modo que el elemento vuelve a animarse cada vez que
   reentra y la progresión se ata al scroll en vez de reproducirse. Eso hace **inexpresable el
   defecto de la decisión 4** —animar una sola vez—, que es la decisión de producto de este ADR. El
   soporte desigual entre navegadores es motivo secundario, no el principal.

   `IntersectionObserver` ya está en el paquete (`InfiniteList.tsx:66`), así que no entra
   dependencia ni técnica nueva.

4. **`once` vale `true` por defecto.** Reanimar cada vez que un bloque reentra es lo que hace que una
   landing se sienta barata, y el movimiento repetido y no solicitado es un problema vestibular, no
   una preferencia estética. La salida al abandonar el viewport existe como `once={false}` y es
   **opt-in**, en la misma línea que ADR-069 decisión 1 («ambas apagadas por defecto»).

5. **El escalonado sale del helper que ya existe.** `Stagger`/`StaggerDelay` de `utils/motion.ts`,
   con su **tope de ocho elementos** (`docs/03` §2 regla 5). `Reveal` no vuelve a escribir un
   retardo: una fila larga de cards no encadena un retraso perceptible en la última.

6. **La física sale de `utils/motion.ts`**, como el resto: `Tween(duration, "decelerate")` por
   defecto y `Spring(name)` cuando se pida, igual que `Transition.tsx:58-62`. Cero
   `{ stiffness, damping, mass }` escrito a mano — el guard de ADR-034 regla 6 lo verifica.

7. **Solo `transform` y `opacity`** (`docs/03` §2 regla 1). Los siete presets ya lo cumplen; `Reveal`
   no añade ninguno que toque layout.

8. **Degradación.** Con `prefers-reduced-motion` o `motion.tier: "minimal"`, `MotionOff()` resuelve
   en un solo sitio y **el estado oculto no se aplica nunca**: el contenido aparece y ya. No es un
   fade corto ni una animación instantánea — es la ausencia del mecanismo.

9. **`Section` gana una prop `reveal` que delega**, sin recibir los ejes de configuración. Quien
   necesite preset, umbral o escalonado envuelve con `Reveal` a mano. Así `Section` gana una prop, no
   cuatro, y el punto de configuración queda en un solo componente.

### `Main`

10. **`contentWidth` acota el contenido, y por defecto no acota.** Es el mismo eje que ADR-068
    decisión 14 dio a `Nav`, con **defecto opuesto y a propósito**: `Nav` es una barra cuyo contenido
    siempre quiere medida, mientras que el uso dominante de `Main` hoy es el dashboard dentro de
    `AppShell`, donde un carril rompería los layouts existentes. Landing lo enciende; dashboard no
    lo nota.

    Va sobre el `<main>`, no sobre la raíz. Eso deja el **backdrop a sangre** —es `position:
absolute; inset: 0` (`Main.css.ts:21-30`)— con el contenido acotado, que es justo la composición
    que pide una landing con `MeshGradientBg` o `StarField` detrás.

11. **`spacing` gobierna el ritmo vertical entre bloques**, y por defecto no gobierna nada. Hoy
    `<main>` no tiene `gap` y sus hijos no son flex salvo con `centered`; encender flex por defecto
    cambiaría el colapso de márgenes y el comportamiento de altura de todo consumidor existente. Por
    eso el `gap` se aplica **solo cuando `spacing` viene dado**, vía `data-spacing`, y sin él el CSS
    resultante es idéntico al de hoy.

    Es la causa **C11** del plan de alineación —ritmos— aplicada al caso landing: la separación entre
    secciones la decide la página, no cada sección adivinando su propio margen.

12. **`Main` no se anima.** Queda escrito aquí para que no se redescubra como hueco: la entrada de
    página se compone con `Reveal` sobre los bloques, que es donde el movimiento significa algo.

## Enmienda 1 — el carril baja a `Section`, y el reveal deja de envolver (2026-08-01)

Decisión del propietario tras revisar el DOM que producía la landing. **Enmienda las decisiones 1, 9
y 10**; el resto sigue en pie.

13. **`Reveal` es polimórfico y la lógica vive en un hook.** `useReveal` devuelve `ref`, `animate`,
    `transition` y `data-reveal`, y los componentes del catálogo lo aplican **sobre su propio
    elemento**. `Section reveal` ya no se envuelve: el `data-reveal` va en el `<section>`.

    El motivo es el DOM. Envolver metía un `<div>` sin semántica entre el contenedor y cada bloque, y
    en una landing eso se multiplica por sección, por card y por feature. `Reveal` conserva su forma
    de componente —con `component` para elegir etiqueta o componente— para lo que no es del catálogo.

14. **`Section` gana `contentWidth`, y vale 1180 por defecto** —el mismo número que `Nav`—, de modo
    que una landing hecha de `Section` sale acarrilada sin configurar nada y la barra y el cuerpo
    comparten medida por construcción.

    **Consecuencia asumida explícitamente**: `Section` también se usa en dashboards dentro de
    `AppShell`, y ahí toda sección existente pasa a toparse a 1180 y centrarse. Se recupera con
    `contentWidth="none"`. El propietario lo aceptó sabiéndolo; queda escrito para que no se
    redescubra como regresión.

    Esto **cierra la deuda declarada** de la decisión 10: con el carril en la sección, una sección
    puede romperlo por sí sola sin renunciar al de la página.

15. **`Main.contentWidth` se queda, apagado.** Es el carril de las páginas cuyos bloques no son
    `Section` —documentación, un checkout, un formulario largo—. Los dos componen sin pelearse: el
    interior nunca puede ser más ancho que el exterior.

16. **`Section` y `Banner` reenvían el resto de props a su elemento.** Ninguno lo hacía, así que un
    `id` pasado a cualquiera de los dos **se descartaba en silencio**. Es lo que obligaba a la landing
    a envolver cada sección en un `Box id` solo para tener el ancla del scroll-spy — otro `<div>` de
    más, y el motivo real de la mitad de los que había.

17. **`Banner` gana `order` y es el hero.** Sin `order` sigue rindiendo su título como `<p>`, como
    hasta hoy; con él rinde un heading real y etiqueta su `<section>` por `aria-labelledby`. No se
    crea un componente `Hero`: `Banner` ya era un `<section>` con hiper, título, subtítulo,
    descripción, acciones, imagen y velo — la estructura entera— y lo único que le faltaba para
    serlo era que su título no fuese un párrafo.

18. **El muelle de la pastilla de `Nav` pasa a `snappy`.** Recogerse es un cambio de estado, no una
    entrada; con `default` el asentamiento se notaba lento para lo poco que recorre.

19. **Hallazgo colateral, y es un bug de verdad: el cristal de `Nav` nunca se aplicó.** Dentro de un
    bloque `selectors`, vanilla-extract emite **una sola** de `backdropFilter` /
    `WebkitBackdropFilter` —gana la última— así que el CSS solo llevaba el alias `-webkit-` y
    `backdrop-filter` computaba `none` en Chrome y Firefox. `GlassSurface` y `BlurOverlay` se salvan
    porque las declaran al nivel raíz del estilo, no dentro de un selector.

    La regla que queda: **dentro de `selectors`, solo la propiedad estándar**. Está escrita en
    `Nav.md` para que nadie la «arregle» volviendo a añadir el alias.

20. **Segundo hallazgo colateral: `Banner` atenuaba tres textos con `opacity` y rompía AA.** `hiper`
    (0.85), `subtitle` (0.9) y `description` (0.85) multiplicaban la opacidad sobre el color ya
    resuelto de la variante. Lo cazó axe en la lámina `AllThemes` de la landing, sobre la
    descripción en variante `light`.

    Es de la misma familia que los tres defectos que T2 documentó: **`check:contrast` mide el token,
    no el color compuesto**, así que una opacidad encima de un par válido lo puede tumbar sin que
    ningún gate de tokens se entere. Solo aparece cuando axe mide el píxel renderizado.

    Los tres se retiran. La jerarquía ya la dan el tamaño y el peso —`hiper` va en `caption`,
    semibold y versalitas; `subtitle` en `body1`; `description` en `body3`—, así que la atenuación
    aportaba poco y arriesgaba mucho.

21. **Tercer hallazgo, y el más serio: `ExtractStyleProps` mutaba el `style` del consumidor.**
    Tomaba `props.style` **por referencia** como acumulador y le hacía `Object.assign` con las props
    de dimensión. Se manifestó como un crash en la landing —`Cannot assign to read only property
'maxWidth'`— al pasar `style` junto a `maw`, porque el objeto literal estaba izado y congelado.

    El crash era el síntoma benigno. El silencioso es peor: **el objeto del consumidor se quedaba
    contaminado entre renders y entre instancias** que compartieran ese literal, así que un bloque
    podía heredar el `maxWidth` calculado para otro. Es un util que usa **todo el catálogo**
    (ADR-032), así que el fallo estaba en todas partes y solo salía cuando alguien pasaba `style` y
    una prop de dimensión a la vez — combinación que ningún componente usaba hasta ahora.

    Dos correcciones, con siete tests de regresión en `utils/__tests__/style-props.test.ts`: el
    acumulador **se copia** en vez de tomarse por referencia, y `style` **deja de devolverse también
    en `rest`** — quien hiciera spread de `rest` después del `style` calculado lo pisaba entero,
    perdiendo las vars del componente.

## Enmienda 2 — el carril es una familia de cuatro bandas (2026-08-02)

Decisión del propietario tras ver la landing renderizada. **Enmienda las decisiones 10, 11 y 17.**

22. **Cuatro bandas de página comparten carril, y las cuatro lo traen por defecto a 1180**: `Nav`,
    `Section`, `Hero` y `Footer`. El consumidor no configura la medida — la hereda por construcción,
    y `contentWidth="none"` la desactiva donde estorbe.

23. **`Banner` se renombra a `Hero`**, con defectos de banda: `order={1}`, `contentWidth={1180}`, a
    sangre, sin radio y con el padding solo en el eje vertical. La enmienda 1 decisión 17 había
    decidido lo contrario —conservar `Banner` y darle `order`—; **el propietario lo revirtió y tenía
    razón**: la landing necesitaba **cuatro props para des-`Banner`-izarlo** (`order`,
    `contentWidth`, `px="none"`, `py="xxxl"`). Cuando hay que apagar la mitad de los defectos de un
    componente para usarlo, es otro componente.

24. **`Footer` entra al catálogo** como compound (`Footer.Brand`, `Footer.Group`,
    `Footer.Group.Link`, `Footer.Legal`), emite el landmark `contentinfo` y pone los enlaces de cada
    grupo en un `<ul>` — que es lo que un lector de pantalla anuncia como lista. Sin enlaces no
    inventa la lista.

25. **`Main` deja de envolver `header` y `footer`, y pierde `stickyHeader`/`stickyFooter`.** Eran
    booleanos que configuraban la posición de otro componente, y no sabían expresar lo que `Nav` ya
    hacía mejor con `floating`. Ahora los slots son hijos directos y **quien renderiza decide**:
    `<Nav sticky>`, `<Footer sticky>`.

26. **El `backdrop` sí conserva su envoltorio**, contra la intuición de simetría. No es un wrapper:
    es la definición de la capa —`inset: 0`, `overflow: hidden`, `z-index: base`,
    `pointer-events: none` y `aria-hidden`—. Quitarlo obliga a que los cinco componentes de fondo lo
    reimplementen, y **hoy ninguno se marca `aria-hidden` por su cuenta**: la landing pasa
    `MeshGradientBg` y lo decorativo lo pone el wrapper. Sin él, rompería a11y de inmediato.

27. **Cuarto hallazgo latente: `size` y `titleSize` de `Banner`/`Hero` estaban fuera de `baseLayer`.**
    Es exactamente lo que advierte `docs/patterns/web-component-template.md` §2: sin capa, la clase
    base gana a la atómica de sprinkles y **pisa en silencio la style prop del consumidor**. El
    síntoma era que `px` no surtía efecto y el hero se desalineaba 22 px del resto a 1280 px de
    ancho. Con la capa puesta, hero, secciones y barra caen en el mismo carril a cualquier ancho.

## Alternativas

- **Reveal como props de `Section` y nada más.** Cero componentes nuevos y cero filas de inventario.
  A cambio, el hero, las cards y las stats de la landing —que no son `Section`— se quedan fuera, y
  `Section` pasa de doce a quince props. Descartada por el propietario en el checkpoint.
- **`animation-timeline: view()` puro CSS.** Cero JS, cero `"use client"`, y coherente con ADR-069.
  Descartada por la decisión 3: no puede expresar «animar una sola vez».
- **Un `Reveal` que oculte desde el CSS y desoculte con JS.** Es la implementación habitual y es la
  que pierde contenido en los cuatro casos de la decisión 2. Descartada explícitamente para que
  nadie la reintroduzca como «optimización» al ver el flash de re-render.
- **Carril con un `Container` dentro de `Main`.** Compone piezas existentes sin API nueva, pero
  obliga a envolver en cada landing y deja el backdrop dentro o fuera del carril según cómo se anide
  — que es la ambigüedad que la decisión 10 elimina.
- **`gap` por defecto en `<main>`.** Más útil de primeras y **rompe** todo layout existente que
  dependa del flujo en bloque. Descartada por eso.

## Consecuencias

- **El catálogo web pasa de 156 a 157 componentes**: `Reveal` entra en `00-inventory.md` §1.1, junto
  a `Transition`, con el que comparte vocabulario.
- **`Section` gana una prop y `Main` dos.** Ninguna cambia el render por defecto: los tres
  componentes rinden hoy exactamente lo mismo si no se tocan las props nuevas. Es la condición para
  no reabrir la auditoría de las familias ya cerradas.
- **Presupuesto**: `Reveal` estrena entrada en `.size-limit.js` y `Main`/`Section` se vuelven a
  medir. Las cifras se fijan **al medir**, no antes — ADR-062 decisión 7.
- **Deuda declarada**: con `contentWidth` puesto en `Main`, **una sección no puede romper el carril**
  para pintar una banda a sangre. La salida es no usar `contentWidth` en `Main` y acotar por sección.
  Queda escrito para que no se redescubra como hallazgo.
- **Paridad W/N**: `Reveal` nace `W`. El equivalente native existe (Reanimated + `onLayout`), pero el
  contrato de viewport no se traduce directamente y no se decide aquí.
- **WR2 tiene otra familia que auditar.** `Reveal` entra al catálogo después de la auditoría de su
  familia. Es la cuarta vez —`Breadcrumbs`, `Header`, `Nav`, y ahora este—; el patrón está anotado en
  `docs/wr-estado` §5.
