# MeshGradientBg

## La malla se deriva del token, no se inventa

`MeshCss` (`utils/effects.ts`) coloca **cinco** gradientes radiales en anclas fijas y les asigna
colores ciclando los `stops` del token. Con eso, un token de dos stops y uno
de tres producen mallas coherentes con la identidad de cada tema sin que el componente
elija un solo color.

Las anclas, sus alfas (72→38 %) y sus radios (50–62 %) son fijos a propósito: una malla con posiciones
aleatorias no es reproducible entre SSR y cliente, y una con posiciones configurables convierte el
componente en un editor de fondos. El color y la intensidad los pone el tema; la composición es del
sistema.

`MeshBase` pinta debajo el último stop al 24 % como color sólido, para que la malla no deje ver el
canvas entre los círculos.

## `grain` cubre `GrainyGradient`

`00-inventory` §1.15 lista `MeshGradient / GrainyGradient` como filas hermanas. Aquí son un componente
con una prop: `GrainyGradient` es exactamente esta malla más la capa de ruido del tema, y darle su
propio componente habría duplicado API, tests, story y entrada de size-limit para la misma
composición. Decidido en el checkpoint de apertura de W4.1.

Como el ruido sí es un material glass, `grain` responde a `effects.glass.enabled`: apagado no pinta
nada aunque se pase la prop. La malla, en cambio, sigue ahí — la decisión del mismo checkpoint es que
los gradientes se neutralizan por sus tokens, no por esa palanca (`GradientBackground.md` §Qué NO
degrada).

## `gradient` no acepta `GradientProp`

A diferencia de `GradientText`, `GradientBorder`, `GradientBackground` y `AnimatedGradient`, aquí solo
se admite un `GradientRole`. Un `{ from, to }` tiene exactamente dos colores y la malla necesita
recorrer stops con posición: con dos colores planos las cinco capas quedarían alternando A/B, que es
peor que el gradiente lineal que el consumidor ya tiene en `GradientBackground`.
