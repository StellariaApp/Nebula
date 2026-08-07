# Timeline

## Las ranuras se esparcen sobre todas las entradas

`Timeline` recibe sus entradas por `items`, no por composición, así que `itemProps`, `bulletProps`,
`titleProps` y el resto caen sobre **todas** a la vez. No hay forma de ajustar una sola entrada desde
fuera, y eso es deliberado: si hiciera falta, el componente tendría que ser un compound, y el informe
de N2 no lo señaló como candidato.

`bulletProps` merece un aviso: la viñeta lleva `data-reached`, que es de donde sale su tinte al pasar
el índice activo. Un `bg` desde la ranura lo tapa.
