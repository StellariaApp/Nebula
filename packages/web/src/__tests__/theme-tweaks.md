# theme-tweaks

Temas **ad-hoc de test**, no temas del producto. Existen porque los temas oficiales son solo `light`
y `dark` (ADR-108) y ninguno de los dos apaga `glass`, baja `motion` a `minimal` ni trae un gradiente
de tres stops — pero el código que responde a esas tres cosas sigue en el catálogo y hay que probarlo.

Antes lo probaban `sober-light` y `playful`. Al retirarlos, la alternativa era borrar la cobertura del
camino de degradación, que es código vivo. Estas funciones devuelven un `NebulaTheme` derivado de
`nebulaLight` con **una** propiedad cambiada, y se pasan a `NebulaProvider defaultTheme={...}`, que
acepta un objeto de tema además de un nombre oficial.

No se exportan desde el barrel del paquete y no tienen `meta.name` propio: no son candidatos a tema
oficial ni semilla de los temas futuros.
