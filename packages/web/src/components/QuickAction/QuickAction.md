# QuickAction

## Por qué declara la unión `Variant` entera

Decisión del propietario en el checkpoint de apertura del bloque C de W3.3, y queda registrada en la
enmienda de ADR-038. `docs/00-inventory.md` §1.18 lo describe como «Card+ActionIcon preset», y de ahí
salían las dos alternativas evaluadas: el subconjunto de `Card` —seis miembros— o un subconjunto propio
`filled · outline · light · ghost`, argumentado sobre `docs/06` §6 porque un QuickAction vive en
rejilla y ni `glow` ni `gradient` deberían repetirse seis veces en la misma región.

Se eligió la lectura de **acción**: QuickAction se comporta como `Button` —es un control pulsable con
su ciclo de press completo—, así que expone el mismo eje que `Button` y `ActionIcon`. La contención de
`glow` y `gradient` en rejilla pasa a ser responsabilidad de quien compone, no del tipo.

`unstyled` entra con la unión. La regla 3 de ADR-038 dice que «no se propaga» porque el caso está
resuelto por `UnstyledButton`, pero esa regla habla de los componentes de **superficie** que ganaron
`variant` en V2–V5; aquí llega por la puerta de `Button`, que también la tiene. `ResolveVariant`
devuelve la receta `UNSTYLED` —todo transparente, sin borde ni glow— y la geometría del tile se
conserva.

## No compone `Card`

El preset es conceptual: geometría de tarjeta y afordancia de icono pulsable. Componer `Card` de verdad
obligaría a resolver dos superficies anidadas —la de la Card y la del control— y a reconciliar
`CardVariant` (seis miembros) con la unión entera, que es justo lo que la decisión de arriba descarta.
El tile resuelve su propia superficie con `ResolveVariant`, que es la fuente única que ADR-038 exige;
lo que no hace es escribir una receta local.

## El icono no lleva `ActionIcon`

Sería un botón dentro de un botón. El icono es decorativo (`aria-hidden`) y el nombre accesible sale de
`label`; quien necesite dos acciones separadas —abrir y, aparte, un menú— compone `Card` con sus slots,
que es el caso de `CardComplex` en W3.5.
