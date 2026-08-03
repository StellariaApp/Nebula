# Reveal

Entrada por viewport. Mismo vocabulario que [`Transition`](../Transition/Transition.tsx) —los siete
`TransitionPreset`— con otro disparador: `Transition` se dispara por `mounted`, este por posición.
Decisiones de fondo en
[ADR-070](../../../../../docs/adr/ADR-070-reveal-por-viewport-y-carril-de-pagina.md).

```tsx
<Reveal>
  <Hero />
</Reveal>;

{
  cards.map((card, index) => (
    <Reveal key={card.id} index={index} preset="slide-up">
      <Card>{card.title}</Card>
    </Reveal>
  ));
}
```

## La regla que gobierna el componente: el contenido se rinde visible

El estado oculto **no existe en el render inicial ni en el CSS**. Se aplica desde un
`useLayoutEffect`, en cliente, y solo después de comprobar que hay `IntersectionObserver` y que el
movimiento está permitido. Mientras `armed` es `false`, el `m.div` no recibe `animate` y el contenido
está simplemente ahí.

No es una precaución teórica. Un reveal que arranca en `opacity: 0` desde la hoja pierde el contenido
en cuatro casos reales:

1. **Sin JS** — el hidratado nunca llega y la página se queda en blanco por debajo del pliegue.
2. **El observer no monta** — un error en cualquier efecto anterior del árbol y el contenido no
   vuelve.
3. **El elemento ya está en pantalla al cargar** — si la implementación solo desoculta «al entrar»,
   lo que ya entró no dispara nada.
4. **Dentro de un `Scroll`** — el observer mira el viewport, no el contenedor desplazable, así que el
   contenido de un panel con scroll propio nunca cruza el umbral.

Y **ningún gate del repo lo detecta**: axe no marca contenido a opacidad cero, y los tests de render
lo ven presente en el DOM. Es la misma clase de fallo silencioso que T0 documentó con `Paper`, que
pasó meses en verde pintando el color del lienzo.

El `useLayoutEffect` corre **antes del pintado**, así que armar no produce parpadeo: el navegador
nunca llega a pintar el estado visible intermedio.

El caso 4 sigue siendo una limitación real, no un fallo: `Reveal` dentro de un `Scroll` con
desplazamiento propio no se dispara. La salida es no usarlo ahí.

## Por qué `IntersectionObserver` y no `animation-timeline: view()`

ADR-069 metió los _scroll timelines_ de CSS en el catálogo para las sombras de `Scroll`, así que la
alternativa sin JS existe y era la coherente. La descarta un motivo de producto, no de soporte: **un
timeline es estrictamente posicional**. La progresión se ata al scroll en vez de reproducirse, de
modo que el elemento vuelve a animarse cada vez que reentra y **«animar una sola vez» no es
expresable**. Y `once` es el defecto de este componente.

## Por qué `once` vale `true`

Reanimar cada vez que un bloque reentra es lo que hace que una landing se sienta barata. Y el
movimiento repetido y no solicitado es un problema vestibular, no una preferencia estética: quien
sube y baja por la página se lleva la animación entera cada pasada. La salida al abandonar el
viewport existe —`once={false}`— y es opt-in.

## Degradación

`prefers-reduced-motion` o `motion.tier: "minimal"` resuelven en `MotionOff()`, y entonces
**el mecanismo no se arma**: no hay estado oculto, no hay observer, no hay animación. El contenido
aparece y ya. No es un fade corto ni una duración cero — es la ausencia de la maquinaria.

Lo mismo si no hay `IntersectionObserver` en el entorno.

## El escalonado sale del helper, no de un retardo propio

`index` alimenta `StaggerDelay` de `utils/motion.ts`, con su **tope de ocho elementos**
(`docs/03` §2 regla 5). Una fila de veinte cards no encadena un retardo perceptible en la última:
a partir de la octava, todas comparten el mismo.

## `component`: el reveal no tiene por qué añadir un `<div>`

`Reveal` rinde un `<div>` por defecto, pero `component` cambia el elemento —igual que en el resto del
catálogo—, así que en una landing no hace falta pagar un envoltorio sin semántica por cada bloque:

```tsx
<Reveal component="article">…</Reveal>
<Reveal component="section" id="precios">…</Reveal>
<Reveal component={Card} p="lg">…</Reveal>
```

Con una etiqueta se resuelve por `m.<tag>`; con un componente, por `m.create(Component)` memoizado
por identidad. **El componente tiene que reenviar su `ref`** o motion no encuentra el nodo y no anima:
51 de los del catálogo lo hacen —todos los derivados de `Box`—, pero no todos.

## `useReveal`: por qué los componentes del catálogo no se envuelven

Un envoltorio alrededor de un `<section>` es un `div` sin significado entre el contenedor y su
contenido, y en una landing eso se multiplica por cada bloque. Por eso la lógica vive en el hook
`useReveal`, y los componentes del catálogo la aplican **sobre su propio elemento**:

```tsx
const revealed = useReveal();
const Root = reveal ? m.section : "section";
<Root ref={revealed.ref} data-reveal={revealed["data-reveal"]} animate={revealed.animate} …/>
```

`Section reveal` es exactamente eso: el `data-reveal` va en el `<section>`, no hay nodo intermedio, y
las style props y el `id` siguen aterrizando donde siempre. `Reveal` es el mismo hook con la capa
polimórfica encima, para lo que no es un componente del catálogo.

Cuando un componente no anima por sí mismo, `Reveal component={X}` sigue siendo la vía.

## Por qué el disparo recorta el viewport por abajo

`amount` es un umbral sobre **el alto del elemento**, no sobre el del viewport, y esa diferencia se
nota en una landing: una sección de 500 px alcanza su 20 % en cuanto asoma 100 px, así que la
animación termina mucho antes de que el lector llegue a ella.

Medido sobre la landing con el default anterior, las secciones se revelaban con su borde superior a
**~800 px** de un viewport de 900 — es decir, casi fuera de pantalla.

Por eso el `rootMargin` por defecto es `0px 0px -25% 0px`: el cuarto inferior del viewport deja de
contar como visible, y el disparo se retrasa hasta que la sección está de verdad entrando. Medido
después, el borde superior queda entre **547 y 583 px**. `amount` sigue disponible para ajustar por
caso, y `rootMargin` se puede sobrescribir entero.
