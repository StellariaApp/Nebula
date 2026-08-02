# WB — Afinamiento de marca

> Fase posterior a WR. Alinea el catálogo web con la identidad de Stellaria tomando como referencia
> las tres landings en producción. El plan y la evidencia están en
> [`docs/reviews/brand-alignment-plan-2026-08-02.md`](../../docs/reviews/brand-alignment-plan-2026-08-02.md).

## Prompt de arranque — pegar en una sesión limpia

```text
Actúa como ingeniero de UI en C:\Users\Skr13\Documents\GitHub\Nebula.

Fase WB — afinamiento de marca. Nebula tiene que ser la base sobre la que se construyen las
landings y los productos de Stellaria.

EL PRINCIPIO QUE ORDENA LA FASE — no lo pierdas de vista en ninguna decisión:
  **Entre productos solo cambia el color.** Nebula es indigo→violet porque es el neutro del
  sistema, no el color de un producto: Rosette es rosa, Stellaria azul, Lagrange rojo-naranja,
  y cada uno llega por tema, nunca por fork.

  La vara de medir que sale de ahí:
    Si dos landings difieren en algo que NO es color, la que difiere está mal — o el
    sistema no tiene ese algo.

  Radio, ritmo, alto de control, mecánica del cristal, escalera de elevación y registro
  tipográfico NO son decisiones de producto. Que hoy las tres difieran en las seis cosas no
  es variedad de marca: es que el sistema no las fijó y cada landing rellenó el hueco a mano.

ANTES DE TOCAR NADA, LEE EN ESTE ORDEN
  1. CLAUDE.md — guardrails, convenciones y política de trabajo con el propietario.
  2. docs/reviews/brand-alignment-plan-2026-08-02.md — el plan: los seis desalineamientos
     medidos (D1-D6), los siete tramos (B0-B6) y el backlog mapeado.
  3. docs/wr-estado-2026-08-01.md — de dónde viene el árbol y qué quedó pendiente de WR.
     Ojo: **T3 sigue sin implementar** y es el tramo B3 de este plan.
  4. docs/06-visual-language.md — dirección visual vigente, ya enmendada por T2.

LAS TRES REFERENCIAS, CON LO QUE APORTA CADA UNA
  Rosette    C:\Users\Skr13\Documents\GitHub\Rosettee\src\app
             ritmo, jerarquía, animaciones de borde y geometría de acción.
             Su cristal de cards está MAL: velo blanco sin backdrop-filter.
  Stellaria  C:\Users\Skr13\Documents\GitHub\Stellaria\src\app
             la receta de cristal CORRECTA. Mal: sombras, scroll, espaciados y nav.
  Lagrange   C:\Users\Skr13\Documents\GitHub\Lagrange\src\web\src\app
             la más limpia, un solo efecto dominante por región. Mal: exceso de texto,
             nav antiguo, ritmo y jerarquía.

  El destino es la suma: ritmo de Rosette + cristal de Stellaria + contención de Lagrange.

POR DÓNDE EMPEZAR
  B0 primero — cerrar el backlog visual abierto, que es barato y despeja:
    · StarField parallax no funciona. DIAGNOSTICA antes de tocar: comprueba si es
      prefers-reduced-motion, motion.tier o el propio efecto. No asumas.
    · Consolidar y MEDIR los espaciados de Hero, Nav y Footer ya tocados en el árbol.

  Después, B1 con CHECKPOINT — no lo abras sin preguntar. Mueve peldaños del contrato que
  consumen los 158 componentes:
    radio de card 32 (hoy radius.xxl=28) · radio de acción 9 (sm=8) ·
    alto de acción 48 (control.md=42, lg=50) · padding de sección 120 (space.xxxl=64)
  Por el principio de arriba, la decision es UNA para los tres productos: estos peldanos son
  del sistema, no de Stellaria. No cabe «radio 32 en Rosette y 28 en Lagrange».
  Las semillas del tema por defecto NO se tocan: indigo→violet se queda como neutro.

CÓMO TRABAJAR AQUÍ — lo que esta fase aprendió por las malas
  · MIDE, no estimes. Usa tools/render-measure/ sobre el Storybook estático. Cuatro bugs
    reales de esta sesión salieron de medir el render y NINGUNO lo habría cazado un gate:
      - backdrop-filter que nunca se aplicó (vanilla-extract se come la propiedad estándar
        cuando declaras también el alias -webkit- dentro de un bloque `selectors`)
      - opacity sobre color resuelto rompiendo AA (check:contrast mide el token, no el
        color compuesto)
      - ExtractStyleProps mutando el style del consumidor
      - styleVariants fuera de baseLayer pisando en silencio las style props
  · Los gates no ven lo visual. axe no marca contenido a opacidad cero, check:contrast no
    ve opacidades compuestas, y size-limit no ve un peldaño mal elegido.
  · Cambio de API pública o de dependencias ⇒ ADR previo. El siguiente número libre es
    ADR-071.
  · Sin comentarios en el código: lo que necesite explicación va al <Nombre>.md del módulo.
  · Gates antes de commitear: pnpm turbo build typecheck lint test, + check:contrast si
    tocas tokens o themes, + turbo a11y --filter=playground-web.
    Si turbo falla con `spawn UNKNOWN` (pasa en este entorno), ejecuta los scripts
    directamente: npm run build / npx vitest run / npm run a11y por paquete.
  · Commits convencionales con scopes de Nebula. Si prettier reformatea medio repo, aísla
    el formato en su propio commit antes de los de contenido.

CRITERIO DE CIERRE DE LA FASE
  B6: reconstruir las tres landings en el playground con UNA SOLA composición y TRES TEMAS.
  Si para pasar de una a otra hace falta una prop distinta —y no solo un color distinto—,
  el sistema todavía no está alineado. Ese es el único veredicto que cuenta.

Empieza leyendo los cuatro documentos y dime qué encuentras antes de escribir código.
```

## Qué hay ya hecho y no hay que rehacer

- **`Nav`** (ADR-068) ya converge con el `landing-chrome` de Stellaria: transparente arriba, cristal
  y pastilla al hacer scroll, indicador deslizante con muelle del tema, scroll-spy y modo `pathname`.
- **El carril** ya es una familia: `Nav`, `Section`, `Hero` y `Footer` comparten 1180 por defecto
  (ADR-070 enmienda 2), verificado midiendo los cuatro a 1600 y 1280 px.
- **`Reveal`** (ADR-070) cubre la entrada por viewport con la regla de visibilidad: el contenido se
  rinde visible y el estado oculto lo aplica un efecto en cliente.
- **`Footer`** y **`Hero`** existen como componentes del catálogo.
- La **landing de demostración** vive en `Patterns/Landing` del playground y es el banco de pruebas
  natural de B6.
