# player-controls

La hoja que comparten `AudioPlayer` y `VideoPlayer` (ADR-195): la pista con lo reproducido en
primario, el pulgar y el desplegable vertical del volumen. Que compartan hoja no es ahorro de
líneas: es lo que hace que la nota de voz y el clip **se reconozcan como el mismo mando**.

`--nebula-player-filled` es el porcentaje reproducido. La pista pinta lo hecho con un degradado que
corta justo ahí: es la única forma de rellenar «hasta el pulgar» en un `range` **de verdad** sin
duplicar la barra en un `div` — y un `range` de verdad es lo que da el teclado y el lector de
pantalla gratis. El anillo de foco es el de `focus.css.ts`.

`track_over_media` es la variante del vídeo: no crece —en una columna, `flex: 1` crece a lo alto y
la pista salía como un bloque sin línea— y el surco va más claro, porque encima de un fotograma a
mediodía el 18 % de la voz desaparece.
