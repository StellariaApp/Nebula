# PinInput

## El valor no tiene huecos

El valor es una cadena seguida, sin espacios entre celdas: lo que se escribe o se pega en una celda
más allá del final entra justo detrás de lo que ya hay. Antes la celda con el foco mandaba y las de
delante se rellenaban con espacios, así que una clave pegada en el segundo grupo de un
`PinInput` de 12 salía como `"    K56PM89P"`: contaba 12 caracteres, el formulario la daba por
completa y el servidor la rechazaba. Pasó en la activación de Visage (2026-10-23).

## Un código entero se pega desde la primera celda

Si lo pegado trae al menos `length` caracteres válidos —con guiones o espacios en medio, que se
descartan—, se escribe desde la primera celda, sea cual sea la que tenía el foco. Un pegado más corto
se escribe desde la celda del foco, con la regla de arriba.

## Escribir sobre una celda llena la reemplaza

La celda selecciona su carácter al recibir el foco, y sin `maxLength` el navegador deja escribir
encima aunque la selección se pierda: el `onChange` recibe los dos caracteres y se queda con el
nuevo. Con `maxLength={1}` el navegador bloqueaba la tecla y había que borrar antes.
