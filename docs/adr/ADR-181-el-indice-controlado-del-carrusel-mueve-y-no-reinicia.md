# ADR-181 — El índice controlado del carrusel mueve, y no reinicia

- **Estado**: **aceptada** · 2026-08-26 — decidida por el propietario
- **Cambia API pública**: sí, **no rompe**. Dos props nuevas y opcionales en `Carousel` —`duration` y
  `containScroll`— con los valores de hoy por defecto. Lo demás es corrección: `index` deja de
  alimentar el `startIndex` de Embla.
- **Toca**: `packages/web/src/components/Carousel`.

## Contexto

`Carousel` monta Embla así:

```tsx
useEmblaCarousel({ …, startIndex: index ?? defaultIndex, duration: reduced ? 0 : 25 })
```

y dos efectos más abajo mueve el modo controlado:

```tsx
useEffect(() => {
  if (index === embla.selectedScrollSnap()) return
  embla.scrollTo(index, reduced)
}, [embla, index, reduced])
```

Las dos piezas se pisan. `embla-carousel-react` compara sus opciones **por valor** —`areOptionsEqual`—
y llama a `reInit` en cuanto una cambia; `startIndex` es una de ellas. Así que **cada cambio de `index`
reinicia el carrusel** y lo replanta en ese slide de un salto, antes de que el `scrollTo` tenga nada
que recorrer. El resultado es que en modo controlado el carrusel **nunca anima**: ni con el clic que
cambia el índice, ni al soltar un arrastre que a su vez actualiza el índice del consumidor.

Medido en Rosette contra el navegador, muestreando la traslación del contenedor cada 25 ms:

| montaje | posición |
| ------- | -------- |
| con `index` | `330 → −930` en un fotograma, y quieto |
| sin `index` | `−22 → −35 → −43 → −49 → −54 → −60 → −65 → −70 → −73 → −76` |

Embla anima bien. Lo que no anima es el reinicio.

En el mismo sitio aparecieron dos límites que no se pueden sortear desde fuera:

1. **La primera y la última no pueden centrarse.** Con `containScroll` en su defecto —`"trimSnaps"`—
   Embla no se desplaza más allá de su contenido, así que con `align="center"` los extremos se quedan
   pegados a su borde. Con pocas láminas en una pantalla ancha no hay desbordamiento y **ninguna** se
   centra: el grupo entero se queda donde cae. Se intentó rellenar el contenedor por CSS (Embla recorta
   justo esos topes) y meter láminas vacías a los lados (todas miden lo mismo, así que el hueco se
   queda corto de la media pantalla que hace falta).
2. **La duración del recorrido está clavada** en 25 y no hay forma de pedir un gesto más largo.

## Decisión

1. **`startIndex` se lee una vez.** Se congela al montar con `useState`, así que las opciones de Embla
   dejan de cambiar y no hay `reInit`. El modo controlado se mueve **sólo** por el `scrollTo` del
   efecto, que es el que anima. `defaultIndex` conserva su papel: de dónde arranca.
2. **`duration` pasa a ser prop**, con 25 por defecto. `prefers-reduced-motion` sigue mandando por
   encima y lo lleva a cero: es la regla de `docs/03` y no la toca una prop.
3. **`containScroll` pasa a ser prop**, con `"trimSnaps"` por defecto — el de Embla y el de hoy.

## Consecuencias

- Un consumidor controlado que cambie `index` ve un recorrido en vez de un salto. **Es un cambio de
  comportamiento visible**, y es el que se quería: el salto era el fallo.
- `duration` no es milisegundos y la prop lo dice; quien quiera pensar en tiempo tiene que traducir.
  No se convierte aquí porque la unidad es de Embla y traducirla sería inventar una equivalencia.
- `containScroll: false` deja centrar cualquier lámina, y con ello aparece hueco a los lados en los
  extremos. Es lo que pide un selector; quien quiera la fila pegada a los bordes no lo activa.
- Nada de esto cambia el contrato de `items`/`getKey`/`renderItem` ni la semántica APG.
