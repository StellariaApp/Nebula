# Tooltip

Sobre `useTooltipTrigger` + `useTooltip` de React Aria, con posicionamiento por `useOverlayPosition` y presencia por `useOverlayPresence`.

## Los tiempos de apertura son de Nebula, no de React Aria

`useTooltipTriggerState` trae `delay: 1500` y `closeDelay: 500` por defecto —su propio código anota «this seems to be a 1.5 second delay, check with design»—. Un segundo y medio de espera se percibe como que el tooltip no funciona.

Nebula fija **apertura inmediata (0 ms) y 150 ms para cerrar**, ambos configurables con las props `delay` y `closeDelay`.

El 0 es la elección deliberada del propietario y alinea con Mantine y Bootstrap; el resto del ecosistema se reparte entre los ~500 de macOS y Material y los 700 de Radix. La ventaja es que el tooltip se percibe como parte del control y no como una consulta que hay que esperar.

**Su contrapartida está en las superficies densas**: sin retardo de intención, arrastrar el puntero por una barra de acciones enciende los tooltips uno tras otro. Donde eso moleste, la salida no es cambiar el default sino pasar `delay` en esa barra —200 ms bastan para que solo abra aquello sobre lo que el puntero se detiene—. Con un valor > 0 entra además el _warmup_ de React Aria: solo el primero de la secuencia paga la espera y los siguientes abren al instante.

El 150 al cerrar mantiene la regla de asimetría de ADR-034 —una salida nunca dura más que su entrada—, que con el 500 de React Aria quedaba invertida. La ventana de agrupación no cambia: React Aria la calcula con `Math.max(500, closeDelay)`, así que bajar `closeDelay` no rompe el warmup.

Ninguno de los dos es token de tema: son tiempos de intención de puntero, no duraciones de animación. Mezclarlos con `motion.duration` haría que recalibrar la animación cambiase el comportamiento del hover, que son cosas distintas.

## Por qué ningún test dispara el tooltip por hover

El warmup de React Aria vive en **variables de módulo compartidas entre instancias** —`globalWarmedUp`, `globalWarmUpTimeout`, un registro de tooltips— y no se reinicia entre casos. Eso hace que cualquier aserción sobre hover dependa de lo que hicieran los tests anteriores del mismo archivo: la misma aserción pasa o falla según su posición en la suite. Se comprobó de las dos maneras.

A eso se suma que, bajo jsdom, un tooltip con `delay > 0` no llega a abrirse por hover ni esperando tres segundos, y que la aserción inversa —«recién pasado el hover todavía no está»— es cierta también con `delay={0}`, porque la apertura no es síncrona al evento.

Conclusión: en jsdom no hay ninguna aserción de hover que sea a la vez estable y capaz de distinguir un retardo de otro. Los casos de la suite disparan por **teclado**, que es determinista, y la calibración de los tiempos se valida en el playground. Escribir aquí un test de hover daría una señal falsa, no cobertura.

## `maw` es prop propia, no style prop

`maw` existía como prop de Tooltip antes de que el catálogo aceptara style props, y es el atajo de `max-width` de `StyleProps`. Gana la prop del componente: se omite del lado de `StyleProps` y su valor se aplica **después** del spread del estilo de sprinkles, de modo que acota el ancho del globo pase lo que pase. Es la cuarta clase de colisión de ADR-032 regla 3.
