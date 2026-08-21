---
"@stellaria/nebula-web": minor
---

`Modal` acepta `content`, que sustituye su panel entero, y `children` pasa a ser opcional.

El modal dibujaba su superficie —fondo, sombra, radio— y dentro montaba cabecera, cuerpo y pie, y no
había forma de quitarla: `className` cae en el `<dialog>` y `bodyProps` en el cuerpo, por dentro. Eso
obligaba a que cualquier ventana con forma propia en el producto —una `Card` con su anillo de
degradado, por ejemplo— quedara **dentro** del panel, con dos superficies superpuestas, dos fondos y
dos radios que no coinciden.

Con `content` la superficie se queda en blanco: conserva el sitio, el ancho y el movimiento, y suelta
todo lo que se ve. El modal sigue aportando lo que nadie quiere reescribir —el `<dialog>` en el top
layer, el foco atrapado, el bloqueo del scroll, el velo desenfocado, las transiciones y el cierre por
fuera y por `Esc`—, y el panel lo dibuja quien lo trae.

Manda sobre `children`, `title`, `subtitle`, `footer`, `padding` y `withCloseButton`. **El nombre
accesible pasa a hacer falta a mano**: sin cabecera no hay `title` del que colgar `aria-labelledby`,
así que un `content` sin `aria-label` deja el diálogo sin nombre.
