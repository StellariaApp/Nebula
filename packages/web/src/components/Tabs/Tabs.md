# Tabs

## Es un envoltorio de conveniencia, no un componente con lógica propia

`Tabs` compone `Segment.Control` + `Segment.Content` y nada más: no tiene estado, ni comportamiento de
teclado, ni contrato de accesibilidad propios. Todo eso vive en `Segment`, que ADR-026 definió como el
compound canónico de selección segmentada y que absorbió al antiguo `SegmentedControl`.

Se mantiene (decisión del propietario, 2026-07-28, deuda #4 del cierre de W2) porque «tabs» es el nombre
por el que se busca este patrón y el coste de conservarlo es prácticamente nulo mientras siga siendo una
composición.

## La regla

**No añadir lógica aquí.** Si aparece una necesidad que `Tabs` no cubre —orientación vertical, scroll de
la lista, cierre de pestañas—, se resuelve en `Segment` y `Tabs` la hereda por composición. En el momento
en que este archivo tenga estado, un hook o un `useEffect`, habrá dos fuentes de verdad para el mismo
patrón APG y la decisión de mantenerlo deja de sostenerse.

El corolario práctico: los tests de `Tabs` verifican que la composición expone el contrato correcto
(`tablist`, `tab`, panel vinculado, flechas, deshabilitados), no vuelven a probar la mecánica de
`Segment`.
