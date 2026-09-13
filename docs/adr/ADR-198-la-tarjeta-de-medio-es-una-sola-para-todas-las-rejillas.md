# ADR-198 — La tarjeta de medio es una sola para todas las rejillas

- **Estado**: **aceptada** · 2026-09-12 — decidida por el propietario, con la alternativa recomendada · **implementada** el mismo día. Lote «Rosette → Nebula» (`docs/reviews/rosette-a-nebula-2026-09-12.md`),
  **segunda ola**: depende de ADR-195 (`VideoPlayer`) y ADR-194 (`ActionIcon pressed`).
- **Cambia API pública**: sí, y **solo añade**: `MediaCard` en el core.
- **Dependencias nuevas**: ninguna.
- **Toca**: `packages/web/src/components/MediaCard/` (nuevo), `src/index.ts`, `.size-limit.js`.
- Es el hallazgo #5 de C2 y `docs/07` §11.4.

## Contexto

Cuatro rejillas de Rosette —Explorar, Mis Avatares, Guardados, Galería— pintan la misma tarjeta
(`media-card.tsx`, 540 líneas + hoja de 284), y durante un tiempo la Galería tuvo la suya: «la
única rejilla que no se parecía a las demás». `CardComplex` agrupa media, insignias, acciones y
meta, pero no tiene nada de lo que hace a ésta una tarjeta **de medio**:

- galería que pasa sola al pasar por encima (300 ms la primera, 900 las demás; se para con
  `prefers-reduced-motion`), con la portada primero y la galería detrás, sin repetidos;
- clip de adelanto mudo, o `playable`: la tarjeta **es** un reproductor y esconde insignias, menú y
  pie mientras corre (`onPlaying`), con fundido y no de golpe;
- esquinas: rótulos que solo se leen (`cornerStart/End`) y botones que se pulsan
  (`action/actionStart`) **no comparten esquina** —cuando hay botón, el rótulo baja con el reloj—;
- velo arriba y abajo para que esquinas y pie se lean sobre cualquier lámina;
- «no ser enlace»: `href` **o** `onOpen` (una lámina del tamaño del marco, no un `button` alrededor
  de la tarjeta, que metería el menú dentro de un botón);
- celda de una lámina de seis vistas (`sheet`), que es de Rosette pero cabe como ranura de marco.

## Decisión

```tsx
<MediaCard index href | onOpen openLabel
           frames={[…]} clip poster playable seconds clock sheet
           cornerStart cornerEnd action actionStart
           avatar={{ src, name }} title subtitle count ceiling fallback labels />
```

- Marco `3/4` con `GradientBackground`, láminas por `frames` (strings ya resueltos: sin `?q=`), pie
  de cristal con `Avatar` 30 + título `body2` + subtítulo `caption`, y las seis reglas de arriba.
- `playable` monta `VideoPlayer defer fill` (ADR-195) hasta el pie y baja al borde mientras corre.
- Es un `Card variant="glass" r="xl" reveal={{ index }}`; el `Link` lo pone el consumidor con
  `component`, como en todo el catálogo.
- Ranuras: `frameProps`, `footProps`, `stampsProps`, y `renderFrame` para la celda de lámina.

## Alternativas

- **Extender `CardComplex`**: casi todo lo de arriba es del marco, no de la agrupación; sería
  `CardComplex` con veinte props condicionales.
- **Subirla sin `VideoPlayer`**: `playable` es la mitad del componente.

## Consecuencias

- Las cuatro rejillas de Rosette pasan a un import. `ceiling`/`count` son dos ranuras de texto y no
  saben qué es un roset.
- Compuesto ≤48 kB; `VideoPlayer` se mide aparte por ser módulo de `/media`… y aquí hay una decisión
  más: **`MediaCard` importa `VideoPlayer` del core o de `/media`**. Como no arrastra `react-player`,
  la propuesta es que `VideoPlayer` se exporte **también** desde el barrel (mismo módulo, dos
  entradas), igual que hoy `Lightbox` vive en el core.
