# AudioPlayer

El reproductor de una nota de voz (ADR-195): reproducir, arrastrar, el tiempo y el volumen. Propio
porque `<audio controls>` pinta el tema del navegador —gris sobre el cristal— y no admite ni color
ni forma.

Enseña **dónde va y cuánto dura**, los dos: con un número solo, parado decía la duración y andando
decía el punto, y el mismo sitio significaba dos cosas. La duración cae a `0:00` hasta que llega el
metadato; enseñarlo es mejor que reservar el hueco.

El volumen vive en un `Popover` (`components/Volume.tsx`, que `VideoPlayer` comparte) y no en un
absoluto propio: el hilo scrollea, y un panel anclado a mano se recortaba contra el borde. El
silencio no pone el deslizador a cero —son dos cosas: cuánto suena y si suena— y el botón que lo
conmuta es un `ActionIcon pressed` (ADR-194).

La pista es un `range` de verdad con la hoja de `styles/player-controls.css.ts`, que es la misma del
vídeo: el mismo grosor, el mismo pulgar, el mismo relleno.
