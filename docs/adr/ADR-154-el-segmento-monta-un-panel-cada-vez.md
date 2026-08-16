# ADR-154 — El segmento sin swipe no es un carril

- **Estado**: **propuesta** · 2026-08-15 — diseño dictado por el propietario, pendiente de su aceptación
- **Toca**: `SegmentProps` y `SegmentContentProps` de `@stellaria/nebula-web`, API pública en `0.1.0`.
- **Motiva**: el tirón de 3-4 s de la portada al montar `ProductSurface`, medido en móvil.

## Contexto

`Segment.Content` **no es un juego de pestañas que muestra y oculta: es un carril que traslada.**
Pone todos los paneles en fila, mide cada uno con un `ResizeObserver` para calcular `offsets` y
`widths`, y anima `x` con un muelle.

Eso hornea dos condiciones que no están escritas en ninguna parte:

1. **Todos los paneles tienen que estar montados a la vez**, aunque solo se vea uno.
2. **La transición es siempre un desplazamiento**, aunque el gesto esté apagado y nadie pueda
   arrastrar. Un carril que no se arrastra sigue comportándose como carril.

Para un segmento de tres pestañas de texto la primera es gratis. Para uno cuyos paneles son
aplicaciones enteras, no. Medido en la portada de `apps/web`, con seis escenarios:

| Síntoma                                | Causa                                                                 |
| -------------------------------------- | --------------------------------------------------------------------- |
| 3-4 s de bloqueo al aparecer, en móvil | monta el activo **y su vecino** de golpe                               |
| Se degrada según juegas, en escritorio | el consumidor acumulaba los vistos y **no desmontaba ninguno**         |
| Nunca se recupera                       | seis árboles vivos con sus observers, sus muelles y sus temporizadores |

## Decisión propuesta

### 1. La disposición del contenido se puede declarar en la raíz

`swipeable`, `fill`, `auto`, `autoWidth`, `loop` y `lazy` pasan a aceptarse también en `<Segment>` y
viajan por contexto. **Lo que se pase en `Segment.Content` gana**, para que un segmento con dos
contenidos pueda diferenciarlos.

No es un patrón nuevo: `size`, `variant`, `color`, `disabled`, `fullWidth`, `draggable` y
`overflowMode` ya se declaran en la raíz y bajan por el mismo contexto. Lo raro era que la mitad de
la configuración viviera dos niveles más abajo.

**`draggable` y `swipeable` NO se fusionan** aunque ahora vivan juntos. El primero es el arrastre del
indicador sobre las pestañas; el segundo, el barrido sobre los paneles. Comparten sitio, no
significado.

### 2. `swipeable={false}` cambia la transición a fundido

Si no hay gesto, no hay carril: el desplazamiento lateral solo existe para dar continuidad al dedo.
Sin dedo es una animación que mueve contenido de lado sin que nadie lo haya empujado.

Con `swipeable={false}` la entrada del panel pasa a ser un fundido. Sigue respetando `motion.tier` y
`prefers-reduced-motion` como el resto del catálogo.

**Es un cambio de comportamiento sobre una prop publicada**, no una prop nueva: quien hoy pase
`swipeable={false}` y espere el deslizamiento verá un fundido. Se acepta porque el deslizamiento sin
gesto era el comportamiento difícil de justificar, no al revés.

**Lo que se pierde y no tiene escotilla**: «sin gesto pero con deslizamiento» deja de ser
expresable. Si aparece un caso real, pide una prop de transición propia y otro ADR — no se inventa
por adelantado.

### 3. `lazy` monta un panel cada vez

`lazy?: boolean`, por defecto `false`. Con `false` el comportamiento publicado en `0.1.0` queda
intacto, así que es aditivo.

Con `lazy`, **solo el panel activo tiene hijos**. Los demás siguen existiendo como cajas —el carril
las necesita para medir— pero su árbol se desmonta al dejar de ser activos.

`lazy` **implica `swipeable={false}`**, y por tanto fundido: barrer hacia un panel exige que el
vecino esté montado, que es justo el coste que `lazy` quita.

Se descartó «`lazy` guarda ±1 vecino»: es lo que hacía la portada, y era la mitad del problema
medido.

### 4. La altura solo se sostiene si el cambio sería absurdo

Con `auto`, la altura del contenedor sigue a la del panel activo. Con `lazy` aparece un hueco: el
panel entrante mide **0** hasta que su contenido monta, así que el recorrido sería `600 → 0 → 500`.

La regla es **sostener la altura saliente mientras la entrante sea 0**, y soltarla en cuanto mida. El
recorrido queda `600 → 500`, un solo tramo.

No se sostiene más allá de eso: si el panel entrante ya mide algo al montar, la altura lo sigue desde
el primer frame como hoy. Sostenerla siempre convertiría un cambio legítimo en un salto tardío.

## Consecuencias

- **Aditivo salvo el punto 2.** `lazy` por defecto `false` y las props en la raíz no rompen nada. La
  transición bajo `swipeable={false}` sí cambia lo que ve quien ya usaba esa prop, y por eso se
  documenta en `Segment.md` y en la ficha.
- **Dos modos de disposición, no una prop.** Es lo que hace que esto merezca ADR: `lazy` cambia lo
  que el componente *puede hacer* —sin barrido, sin deslizamiento—, no solo cuándo monta.
- **Coste para quien use `lazy`**: volver a una pestaña vuelve a montar su árbol. El chunk ya está en
  caché, así que es coste de render, no de red. Quien necesite conservar estado lo sube por encima
  del panel, que es lo que ya tenía que hacer.
- **A11y sin cambio**: APG admite crear los paneles bajo demanda. El activo conserva `role`, `id` y
  `aria-labelledby`; los inactivos siguen siendo cajas vacías, como hoy cuando el consumidor pasa
  `null`.

## Alternativa descartada

**Dejarlo en el consumidor.** Funciona —`packages/demos` lo hace con un `position === index`— pero
obliga a cada consumidor a redescubrir que el carril monta todo, y a resolverlo pasando `null`. El
componente sabe cuál es el activo; es él quien debe saberlo.
