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
2. `motion.tier: "minimal"` — mismo resultado por `data-twinkle="false"`, decidido en JS.
3. **Parallax** — solo se suscribe al scroll si `parallax`, el tier no es minimal y ninguno de los dos
   media queries está activo. Por eso el listener se monta dentro del `useEffect` y no siempre: con tier
   minimal no hay ni handler registrado, no solo un handler que no hace nada.

La segunda consulta es `(pointer: coarse)`, y **es una parada de rendimiento, no de preferencia**. El
parallax escribe dos `transform` por fotograma de scroll sobre capas fijas del tamaño de la ventana, y
en un táctil eso se paga recorriendo la página entera con un presupuesto de compositor mucho más corto.
El efecto además se aprecia poco donde la ventana es alta y estrecha. Va aquí y no en el sitio de
llamada porque decidirlo fuera obliga a un `useMediaQuery`, y eso es una frontera de cliente nueva:
medido en `apps/web`, convertir `SiteBackground` en isla resharding las hojas de Vanilla Extract y
sumaba **7 ficheros CSS bloqueantes a cada página** sin cambiar un solo byte del total. El componente
ya es de cliente, así que dentro sale gratis.

Las estrellas siguen siendo las mismas: `density` es un coste de una vez —los nodos y su animación CSS,
que compone la GPU—, no un coste por fotograma en el hilo principal.

El parallax escribe `transform` directamente sobre el nodo desde un `requestAnimationFrame` con
coalescencia (un frame pendiente como máximo) y el listener es `passive`. No pasa por estado de React:
un `setState` por evento de scroll re-renderizaría hasta 72 estrellas por frame.

### `parallax` ancla el campo al viewport

Un campo `absolute` dentro de la página **ya se desplaza 1:1 con el scroll**, así que sumarle un
`translate3d` de 0.045 no produce parallax: produce un fondo que viaja al 95.5 % de la velocidad del
contenido. Medido sobre la landing antes de corregirlo, con el campo a 2850 px de alto: 18 px de
desfase a 400 de scroll y 54 px a 1200. Sobre 1200 px de recorrido, invisible.

Por eso `parallax` activa el mismo anclaje que `fixed`. Con el campo anclado, el `translate3d` deja de
sumarse al desplazamiento del contenedor y pasa a **ser** el desplazamiento: el fondo recorre esos
mismos 54 px mientras el contenido recorre 1200, que es el 4.5 % que los factores declaran.

La consecuencia a tener presente es de composición: **un `StarField` con `parallax` es un fondo de
página**, no un fondo de región. Para teñir solo una banda, el campo va sin `parallax`.

### `scroller`: en un panel no desplaza la página

`parallax` escucha el scroll de `window`, que es lo correcto en una landing y **inútil en un panel**:
ahí quien desplaza es un elemento. Medido sobre `Patterns/Dashboard`, al mover el contenido
`main.scrollTop` llega a 343 mientras `window.scrollY` se queda en 0 y el documento ni siquiera es
desplazable — el listener no se disparaba nunca.

`scroller` toma la ref del contenedor que sí desplaza y el campo lee su `scrollTop`:

```tsx
const scroller = useRef<HTMLElement | null>(null);
<AppShell mainRef={scroller} backdrop={<StarField fixed parallax scroller={scroller} />} … />
```

Medido con eso puesto: a 100, 200, 300 y 400 de scroll las capas van a 1.8/4.5, 3.6/9, 5.4/13.5 y
7.2/18 px, que son los factores 0.018 y 0.045 exactos.

No se detecta el contenedor solo: el campo es hermano del que desplaza, no su descendiente, así que
no hay ancestro que recorrer. La ref es explícita a propósito.

## Colores

`color` tiñe retícula y estrellas (6 % la retícula, 70 % las estrellas) y `accentColor` marca una de
cada `accentEvery` — la «estrella rosette» de la referencia, aquí un rol del tema. Un tema de acento
apagado deja el conjunto casi monocromo sin que el componente lo sepa.

En `forced-colors: active` el componente entero desaparece: es decorativo y en alto contraste solo
sería ruido.

## Cómo se monta

Es un absoluto (`inset: 0`, `pointer-events: none`, `aria-hidden`) y **no crea su contenedor**: la
región que lo aloja tiene que estar posicionada y, si el contenido va encima, llevar su propio
`z-index`.

```tsx
<Box pos="relative" style={{ isolation: "isolate" }}>
  <StarField density="lg" />
  <Container style={{ position: "relative" }}>{hero}</Container>
</Box>
```

Con `fixed` o con `parallax` deja de ser un absoluto y se ancla al viewport, que es el montaje de
fondo de página — el de `Main background`:

```tsx
<Main background={<StarField parallax />}>{sections}</Main>
```

## `aurora` — las manchas de color del fondo

Apagado por defecto. Enciende cuatro manchas radiales muy desenfocadas detrás de la retícula, con la
geometría medida de la landing de Stellaria:

| Blob | Posición                | Tamaño      | Opacidad | Ciclo |
| ---- | ----------------------- | ----------- | -------: | ----: |
| 1    | `top -20%`, centrado    | 70vh × 90vw |     0.40 |  18 s |
| 2    | `left -15%`, `top 30%`  | 60vh × 60vw |     0.30 |  22 s |
| 3    | `right -10%`, `top 55%` | 55vh × 55vw |     0.25 |  26 s |
| 4    | `left 60%`, `top 15%`   | 30vh × 30vw |     0.20 |  20 s |

Los cuatro ciclos son primos entre sí a propósito —18, 22, 26 y 20 segundos— para que no vuelvan a
coincidir en fase y el fondo no se lea como un latido único. Cada uno arranca además con un retardo
negativo distinto, así que el campo ya está desincronizado en el primer frame, igual que el parpadeo
de las estrellas.

**El color sale del tema, no de la receta.** El degradado va de `primary.500` al 26 % a `accent.400`
al 14 %, así que un tema de producto tiñe las auroras sin tocar el componente: medido, el mismo
`<StarField aurora />` da rosa en `rosette`, azul en `stellaria` y rojo en `lagrange`.

**Por qué vive aquí y no en un componente aparte**: el original de Stellaria monta las auroras en un
contenedor `fixed inset-0` que se desplaza con `scrollY * 0.04` y les superpone una retícula de 56 px
con máscara radial. Eso es exactamente lo que `StarField` ya hacía —`parallax` usa 0.045 y la retícula
es la misma—, así que separarlos habría duplicado el contenedor, el parallax y la máscara para acabar
apilando dos capas que se pisan.

Se apagan con `prefers-reduced-motion` y con `motion.tier: "minimal"`, como el parpadeo: quedan
quietas, no desaparecen.
