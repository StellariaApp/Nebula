# ADR-196 — El visor sin panel es un componente aparte del `Lightbox`

- **Estado**: **aceptada** · 2026-09-12 — decidida por el propietario, con la alternativa recomendada · **implementada** el mismo día. Lote «Rosette → Nebula» (`docs/reviews/rosette-a-nebula-2026-09-12.md`).
  **Decisión abierta**: `Viewer` nuevo (recomendado) o `Lightbox variant="bare"`.
- **Cambia API pública**: sí, y **solo añade**: `Viewer` en el core.
- **Dependencias nuevas**: ninguna. **No** usa `Carousel`: la tira de miniaturas es una fila con
  `scroll-snap`, como el `filmstrip` que `Lightbox` ya tiene.
- **Toca**: `packages/web/src/components/Viewer/` (nuevo), `src/index.ts`, `.size-limit.js`.
- Es el hallazgo #2 de C2 y `docs/07` §11.

## Contexto

`Lightbox` monta un `Modal` con su panel: zoom por teclado (`+`/`-`/`0`), pan con flechas, pase de
diapositivas con pausa, miniaturas. Es el visor de una galería de documentación. Para mirar una
foto de cerca en un producto de imágenes, «una foto dentro de una tarjeta es la foto más pequeña y
el marco más grande» (`viewer.tsx`).

Rosette llegó a tener **tres** visores en el mismo producto —un `Modal` con una `img`, uno con
acercamiento al doble y descarga, y éste— y los redujo a uno que abren cinco pantallas. Lo que
tiene y `Lightbox` no:

- **sin panel**: fondo `surface.base` al 96 % con desenfoque de 24 px y la pieza encima, hasta el
  borde;
- **arrastre continuo**: la posición es un `offset` con decimales mientras el dedo está puesto y
  el índice cambia al pasar de la mitad, no al soltar (por eso no es `Carousel`, que es de Embla y
  avisa al terminar el gesto);
- **pellizco, rueda y doble toque** para acercar; acercada, el arrastre mueve la imagen y la tira se
  apaga;
- **flechas solo con puntero fino** (`(hover: hover) and (pointer: fine)`): en táctil taparían la
  pieza donde cae el pulgar;
- **el fondo cierra** solo si el clic empezó en el hueco y el dedo no recorrió nada;
- **solo imágenes**, por decisión: un vídeo dentro tendría que adivinar si el dedo va a la barra
  de tiempo o a pasar de pieza.

Con una sola pieza no pinta ni tira ni contador ni flechas.

## Decisión

```tsx
<Viewer images index onIndexChange opened onClose caption actions withDownload labels />
// ViewerImage = { src, alt, thumbnail? }   ·   labels: region close counter previous next download
```

- `Viewer` es un componente del core, `Portal` + `role="dialog" aria-modal`, con las seis reglas
  de arriba. `Lightbox` **se queda** para el visor con panel, pase de diapositivas y zoom por
  teclado; `Lightbox.md` y `Viewer.md` dicen cuándo cada uno.
- La tira de miniaturas es una fila con `scroll-snap-type: x mandatory` que desplaza la activa al
  centro con `scrollTo`; no monta Embla. Así `Viewer` vive en el barrel sin arrastrar `/carousel`.
- `withDownload` pinta un `<a download>` **de verdad** —ningún componente de acción lo da— con la
  medida de `vars.size.control.md`, la del `ActionIcon` de al lado.
- Ranuras: `stageProps`, `imageProps`, `barProps`, `counterProps`, `stripProps`, `thumbProps`.
- Índice controlado, como `Carousel` desde ADR-181: quien lo abre conoce la pieza y arma
  `actions` para ella.

## Alternativas

- **`Lightbox variant="bare"`**: obliga a que un componente tenga dos modelos de gesto (teclado y
  clamp de pan contra arrastre continuo y pellizco) y dos anatomías (Modal con panel contra Portal
  sin él). Lo compartido es el `<img>`.
- **Miniaturas con `Carousel`**: mete Embla en el core (ADR-014 regla 3) o manda `Viewer` a
  `/carousel`, donde nadie lo buscaría.
- **Vídeo dentro del visor**: descartado por la razón de Rosette; el clip se reproduce donde está
  con `VideoPlayer` (ADR-195).

## Consecuencias

- `viewer.tsx` y `viewer.css.ts` de Rosette se sustituyen por un import; la tira de miniaturas
  deja de pasar por `/carousel` en esas cinco pantallas.
- Dos visores en el catálogo con criterio escrito. Si el propietario prefiere uno, la alternativa es
  reescribir `Lightbox` sobre `Viewer` con el panel como opción: más obra y otro ADR.
- Budget compuesto ≤48 kB (Lightbox mide 38,05). Story `Viewer` con una pieza, con veinte, acercada
  y en táctil (viewport `phone`); test de teclado (Escape, flechas) y del cierre por fondo.
