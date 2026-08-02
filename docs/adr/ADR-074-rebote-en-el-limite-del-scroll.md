# ADR-074 — El rebote en el límite del scroll

- **Estado**: **aceptada** · 2026-08-02 — a petición del propietario durante WB
- **Resuelve**: con `momentum`, el scroll **paraba en seco** al llegar al tope. La inercia comunicaba
  peso durante todo el recorrido y lo perdía justo en el único sitio donde hay que comunicar un
  final.
- **Amplía**: `bounce` y `onBounce` en `useMomentumScroll` / `useMomentumPage`, y la prop `bounce` de
  `Scroll` y de `Main`.
- **Enmienda**: la regla de [ADR-069](ADR-069-indicadores-de-scroll-y-momentum.md) según la cual «en
  el tope el evento no se cancela». Con `bounce`, sí se cancela.
- **Reubica**: `Rubber` pasa de `packages/web/src/utils` a `@stellaria/nebula-hooks`.

## Contexto

`Clamp(target + delta, room)` recortaba el destino al límite y descartaba el sobrante. El muelle
llegaba al tope y se detenía: correcto de comportamiento, mudo de lenguaje.

La curva de resistencia ya existía —`Rubber`, la usan `Switch` y `Segment` para sus gestos— pero
vivía en `web`, y el hook vive en `hooks`, que **no puede importar de `web`**: el grafo de
dependencias va en una sola dirección (`docs/01` §8).

## Decisión

1. **El sobrante no se descarta: se acumula como tensión.** Lo que excede el límite alimenta una
   segunda magnitud, `strain`, con su propio muelle hacia cero. El scroll real nunca se pasa del
   límite —`scrollTop` no puede— así que la tensión se comunica al componente como **offset visual**
   a través de `onBounce`, y es el componente quien decide qué transformar.

2. **El hook no toca el DOM del rebote.** Devuelve un número por `onBounce`; `Main` y `Scroll` lo
   aplican donde a cada uno le corresponde. Es lo que permite que el mismo hook sirva a dos
   estructuras muy distintas sin saber nada de ninguna.

3. **Mientras el gesto sigue vivo, el muelle no tira.** Es la parte que no era obvia y la que hace
   que el efecto se sienta bien. Una rueda no genera un evento sino una ráfaga, y con el muelle
   integrando desde el primer frame cada muesca añadía tensión que el muelle ya había empezado a
   devolver: el resultado eran dientes de sierra, no un estiramiento.

   Un `wheel` contra el límite marca el gesto como **activo** y rearma un temporizador de 120 ms.
   Mientras esté activo, `strain` se acumula y se pinta, pero no se integra. Al expirar sin más
   muescas, el gesto se suelta y el muelle recupera.

   Medido sobre la landing, seis muescas contra el tope cada 40 ms:

   | muesca |     1 |     2 |      3 |      4 |      5 |      6 |
   | ------ | ----: | ----: | -----: | -----: | -----: | -----: |
   | offset | 78.26 | 94.74 | 101.89 | 105.88 | 108.43 | 110.20 |

   Cero retrocesos, y cada muesca añade menos que la anterior porque la resistencia es asintótica.
   Al soltar: 108 → 76 → 2.7 px.

4. **Con `bounce`, el evento en el tope sí se cancela.** ADR-069 decidió no cancelarlo para conservar
   el encadenamiento al contenedor padre. Con rebote esa decisión se invierte, y es coherente: un
   scroller que dibuja su propio límite se queda el gesto en vez de pasarlo. Sin `bounce` —el
   comportamiento por defecto de un `Scroll` sin `momentum`— nada cambia.

5. **`bounce` viene encendido cuando `momentum` lo está.** No es una prop que haya que descubrir: el
   frenazo en seco era un defecto del momentum, no una funcionalidad que ampliar. Se apaga con
   `bounce={false}`.

6. **`Rubber` sube a `hooks`** y `web/utils/rubber.ts` lo reexporta, de modo que `Switch` y `Segment`
   no se enteran y sigue habiendo una sola implementación de la curva.

## Dónde se aplica el offset, y por qué es distinto en cada uno

**`Main` transforma `main.content`.** Es el único de los cinco hijos que debe rebotar: el `backdrop`
no, y ahí está la razón de fondo. Un `transform` crea _containing block_ para los `position: fixed`
descendientes, así que transformar un ancestro común habría **roto el `StarField parallax`**, que es
`fixed`. Como el backdrop es hermano del contenido y no su padre, el parallax no se entera.

Verificado en el render durante un rebote de 99 px: `position: fixed` y `top: 0` constantes en las
tres muestras, y al terminar, con `scrollY` 1319, el parallax valía 59.355 px contra 59.35 esperados.

**`Scroll` transforma sus hijos directos**, con `globalStyle` sobre `> *` y una variable de tema. La
alternativa era envolver el contenido en una caja, y eso altera el flex o el grid del consumidor;
transformar el propio scroller movería también su fondo, su borde y su barra. Dos consecuencias que
se asumen: un hijo con `transform` propio no rebota, y un nodo de texto suelto tampoco, porque no es
un elemento.

## Consecuencias

- **Reduced motion y `tier: "minimal"` lo apagan** con el resto del momentum, y en `Scroll` además
  hay una regla `@media` que anula el transform.

- **`onBounce` no re-renderiza.** Se escribe sobre el nodo, igual que hace el parallax de
  `StarField`: un `setState` por frame de rebote volvería a renderizar el árbol entero de la página.

- **El rebote no mueve el scroll.** Medido: `scrollY` permanece en 0 durante todo el estiramiento. Es
  desplazamiento visual, así que no dispara `scroll`, no altera el scroll-spy y no confunde a los
  observadores de viewport.
