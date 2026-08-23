# ADR-177 — Los lados del haz son una ventana, no un reparto del ciclo

- **Estado**: **aceptada** · 2026-08-22 — decidida por el propietario
- **Cambia API pública**: sí, **no rompe**. `edges` conserva su tipo y cambia lo que significa;
  `sequence` conserva sus dos valores y su sentido, con otra implementación detrás. `trail` pasa a
  leerse siempre.
- **Enmienda**: [ADR-081](ADR-081-el-anillo-de-gradiente-puede-orbitar.md) (la tabla de props del haz)
  y [ADR-152](ADR-152-la-cola-del-haz-se-monta-por-piezas-y-se-afina-por-prop.md) §«`trail` se lee
  solo en la vuelta entera», que deja de ser cierto: ahora no hay otro montaje.
- **Toca**: `packages/web/src/components/GradientBorder`, `apps/playground-web`.

## Contexto

`edges` repartía el ciclo en tramos: cada lado encendido era un `<span>` con su propio barrido
—`offset-distance` del vértice de entrada al de salida— y una compuerta de opacidad que lo encendía
durante su turno. `sequence` decidía si los turnos se encadenaban solo entre los lados elegidos
(`continuous`) o si cada lado guardaba su cuarto del marco (`spaced`).

El montaje tenía tres defectos que se ven a simple vista y que son el mismo defecto:

1. **La luz aparece y desaparece hecha.** El arco lleva su ancla en el centro, así que al empezar su
   turno ya está medio montado sobre el lado y al acabarlo se apaga con la otra mitad dentro.
2. **Un adelanto de media estela por punta lo tapaba, pero pintaba en los lados apagados**: el arco
   entraba desde el lado anterior y salía por el siguiente, que era justo lo que `edges` decía que no
   se iluminara.
3. **Y hacía que la velocidad dependiera del número de lados**, porque el adelanto añadía longitud
   dentro del mismo compás.

La forma directa de arreglarlo —darle al hueco oscuro tiempo propio, para que el arco entre y salga
por él sin verse— **no es expresable con keyframes estáticos**. Exige que todos los arcos compartan
periodo con el ciclo, o sea paradas cuyos porcentajes dependen de la configuración (cuántos lados,
cuáles y en qué orden); son 15 combinaciones de `edges` × 4 posiciones, y vanilla-extract no emite
keyframes dinámicos. Con CSS estático solo hay una manera de tener a la vez velocidad constante, nada
pintado en los lados apagados y entrada progresiva: que la luz **no** se reparta.

## Decisión

**La luz da siempre la vuelta entera, y `edges` es una ventana sobre ella.**

- Una sola animación, `loop`, de `offset-distance: 0%` a `100%` en `duration.expressive × 13` (los
  5.5 s de la referencia). El porcentaje lo resuelve el navegador contra la longitud real del
  trazado: velocidad constante y radio contado, sin geometría de esquinas en la hoja.
- Los lados elegidos se aplican como **máscara** sobre un envoltorio nuevo (`edge_window`), una capa
  por lado con `mask-position` y `mask-size`. Cada franja es la región del anillo que le toca a un
  lado —media curva de entrada, su tramo recto y media curva de salida—, centrada en él y recortada
  por los dos extremos por igual. El corte va a `(1 − 1/√2)·r` del vértice, que es donde el arco cruza
  la bisectriz: la luz aparece y desaparece **doblando**, no en los extremos de la curva. Las franjas
  llevan un parche opaco en la esquina cuando sus dos lados están encendidos: las capas de una
  máscara se componen una sobre otra en vez de sumarse, así que dos bordes que se tocan dejan una
  muesca de `0.75` de alfa justo donde la luz cambia de franja. Con los cuatro lados no se escribe
  ninguna capa: la unión sería el anillo entero.
- La cola por piezas, que antes era exclusiva de la vuelta completa, pasa a ser el **único** montaje.
  `trail` se lee en todas las configuraciones.

```tsx
<GradientBorder beam edges={[1, 3]} />
```

La luz entra y sale por la boca de la franja, que es lo que se pedía: en los lados apagados sigue
viajando —de ahí viene— pero no se ve, y en los encendidos aparece deslizándose desde la esquina en
vez de materializándose encima.

**`sequence` sigue significando lo que decía**, con otra implementación: `continuous` se salta lo
apagado —el ciclo dura lo que el tramo encendido, así que la luz vuelve enseguida en vez de esperar a
oscuras— y `spaced` conserva la vuelta entera. Lo que cambia es que ya no reparte el ciclo entre lados:
recorta el recorrido y el ciclo **a la vez**, que es lo que deja la velocidad quieta.

**Y para eso hay que medir el marco.** Acortar el ciclo en la misma proporción que el recorrido exige
saber cuánto mide el recorrido, y en CSS una duración no se deriva de una longitud. `continuous` mide
ancho, alto y radio resuelto sobre la capa del haz (`ResizeObserver`), calcula el perímetro real y las
dos puntas del tramo, y las escribe en vars: `beamFrom`, `beamTo` y el ciclo escalado. Sin medida
—servidor, primer pintado, `spaced`, o lados que no forman un tramo seguido— sale la vuelta entera, que
es el mismo HTML que hidrata.

## Alternativas

**Máscara sin tocar los tiempos** (dejar los tramos y solo recortar lo que sobresale). Arregla que
se pinte en los lados apagados y devuelve la velocidad de antes, pero sin tiempo de tránsito la luz
sigue apareciendo de golpe en las esquinas: la ventana recorta la mitad que sobresale y se ve la
otra. Es medio arreglo.

**`clip-path` en vez de máscara.** No vale para un subconjunto disperso: la unión de las franjas del
1 y el 3 son dos rectángulos sueltos, y eso no es un polígono que `clip-path` pueda escribir.

**Generar los keyframes en runtime** con un `<style>` inyectado. Resolvería el reparto con tránsito,
y se descarta: el componente es de servidor por `children` (ADR-157) y un `<style>` por instancia lo
devuelve al cliente, además de romper el primer pintado.

**Dejar `continuous` sin medir, con la vuelta entera siempre.** Es lo que se probó primero y el
propietario lo rechazó con razón: los lados apagados cuestan su parte del ciclo aunque no se vean, así
que `edges={[1, 2]}` espera al 3 y al 4 antes de volver a empezar.

**Recortar el recorrido sin escalar el ciclo.** Sería puro CSS y devuelve el fallo que este ADR
arregla: el mismo tiempo para menos camino es más velocidad, y la luz iría más rápida cuantos menos
lados se enciendan.

**Cuadrar el aspecto con `@container` y saltarse la medida.** Bucketizar la proporción de la caja en
consultas de contenedor daría el factor sin JS, con error de unos puntos; se descarta por lo que
cuesta en CSS —el factor depende de qué lados y de la proporción, y son 15 × N reglas— para ahorrar un
observador en un componente que es un acento, no un patrón de lista.

## Consecuencias

- **La velocidad deja de depender de `edges`.** Un lado suelto y los cuatro recorren el marco al
  mismo ritmo; lo que cambia es cuánto rato se ve.
- **`continuous` es de cliente.** El primer pintado hace la vuelta entera y la medida la refina al
  hidratar; en `spaced` no se mide nada. Un `ResizeObserver` por instancia con haz, que es un acento
  por región (docs/06 §6), no un patrón de lista.
- **`edges={[1, 3]}` no se puede saltar nada**: son dos tramos sueltos y una sola animación no recorre
  los dos. Ahí `continuous` y `spaced` dan lo mismo.
- Desaparece el reparto en tramos: `BOUND`, `RUN`, los barridos por lado, las compuertas y el
  descuento de esquinas —unas 80 líneas de geometría en unidades de contenedor— se borran. El radio
  sigue haciendo falta, ahora para el ancho de las franjas.
- **`trail.bloom` empieza a funcionar.** Estaba asignado y ninguna hoja lo leía; ahora es el
  `blur()` del contenedor del haz, donde además ablanda la boca de la franja.
- Un elemento más por instancia con haz (la ventana), y una máscara más. A cambio, entre uno y tres
  `<span>` menos que el montaje por tramos.
