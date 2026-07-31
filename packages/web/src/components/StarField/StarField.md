# StarField

La retícula con estrellas de Stellaria, traída al sistema. La referencia es
`Rosettee/src/components/stellaria-background.tsx` con su CSS en `globals.css`
(`.background-grid` + `.background-stars`); aquí se conservan la geometría y el gesto —celda de
56 px, máscara elíptica al 30 % de altura, parpadeo de 4 s, parallax de 0.018/0.045— y se sustituyen
sus colores libres por roles del tema.

**No estaba en `00-inventory` §1.15.** Entra en W4.1 a petición del propietario y se añade como fila
del catálogo en el mismo cambio, para que la cobertura que W4.4 tiene que verificar siga cuadrando.

## Por qué las estrellas no son una tabla fija

La referencia hardcodea 32 posiciones. Aquí las genera `BuildStars` con una **secuencia de baja
discrepancia** (razón áurea y su prima de plata): reparte los puntos de forma visualmente aleatoria
pero **determinista**, así que SSR y cliente producen el mismo DOM y no hay hidratación rota. Es la
razón de no usar `Math.random()`, que en un componente de librería es un fallo de hidratación
garantizado.

Que sea determinista además hace que `density` y `seed` sean props de verdad: cinco densidades y
cualquier semilla, sin mantener cinco tablas a mano.

## El retardo del parpadeo es negativo y viene de tokens

Cada estrella arranca en un punto distinto del ciclo con
`animation-delay: calc(var(--duration-expressive) * -k)`, con `k` derivado de la misma secuencia. Un
retardo **negativo** empieza la animación ya avanzada, así que el campo se ve desincronizado desde el
primer frame en vez de encenderse a la vez y desperdigarse después.

La duración es `expressive × 6`, que es el «breathing» de `docs/06` §6. Ni el retardo ni la duración
llevan un número de milisegundos: los dos son `calc()` sobre la var del tema, de modo que un tema con
otro `duration.expressive` reescala el campo entero.

## Las tres paradas

1. `prefers-reduced-motion` — `still` más el sustituto estático (opacidad 0.6, escala 1). Sin el
   sustituto, las estrellas quedarían congeladas en el frame que tocara: unas invisibles a 0.2 y otras
   a 1, que es peor que el campo quieto y uniforme.
2. `motion.tier: "minimal"` (sober) — mismo resultado por `data-twinkle="false"`, decidido en JS.
3. **Parallax** — solo se suscribe al scroll si `parallax`, el tier no es minimal y el media query no
   está activo. Por eso el listener se monta dentro del `useEffect` y no siempre: en sober no hay ni
   handler registrado, no solo un handler que no hace nada.

El parallax escribe `transform` directamente sobre el nodo desde un `requestAnimationFrame` con
coalescencia (un frame pendiente como máximo) y el listener es `passive`. No pasa por estado de React:
un `setState` por evento de scroll re-renderizaría hasta 72 estrellas por frame.

## Colores

`color` tiñe retícula y estrellas (6 % la retícula, 70 % las estrellas) y `accentColor` marca una de
cada `accentEvery` — la «estrella rosette» de la referencia, aquí un rol del tema. En `sober-light` el
acento es teal y el conjunto queda casi monocromo; en `playful`, cian sobre un canvas claro.

En `forced-colors: active` el componente entero desaparece: es decorativo y en alto contraste solo
sería ruido.

## Cómo se monta

Es un absoluto (`inset: 0`, `pointer-events: none`, `aria-hidden`) y **no crea su contenedor**: la
región que lo aloja tiene que estar posicionada y, si el contenido va encima, llevar su propio
`z-index`.

```tsx
<Box pos="relative" style={{ isolation: "isolate" }}>
  <StarField density="lg" parallax />
  <Container style={{ position: "relative" }}>{hero}</Container>
</Box>
```
