# ADR-183 — La barra inferior es una fila de pestañas, y una pestaña lleva su nombre

- **Estado**: **aceptada** · 2026-08-27 — decidida por el propietario
- **Cambia API pública**: **no**. Ninguna prop cambia; es CSS del modo carril por debajo de
  `tablet`. **Sí cambia el aspecto**, y ese es el punto: los destinos de la barra inferior pasan a
  llevar su rótulo debajo del icono.
- **Toca**: `packages/web/src/components/AppShell/AppShell.css.ts`.
- Va sobre la barra que tendió [ADR-153](ADR-153-el-carril-declara-que-hace-cuando-no-cabe.md) y
  después de que [ADR-182](ADR-182-quien-scrollea-la-barra-cambia-con-el-ancho.md) hiciera que el
  destino activo se vea.

## Contexto

`AppShell.Label` se apaga por debajo de `laptop`, y con razón: ahí el carril es una columna de
iconos de 64 px y un rótulo al lado no cabe. Bajo `tablet` el carril deja de ser esa columna y se
tiende como **barra inferior**, pero heredaba la misma regla — así que la barra quedaba en una fila
de iconos pelados.

Un icono sin nombre obliga a adivinar, y en Rosette la fila tenía diez: dos engranajes distintos
—«Saldo y gasto» y «Ajustes»— y dos siluetas —«Usuarios» y el avatar del pie—. Con ADR-182 ya se
sabe **dónde estás**; sin rótulo seguía sin saberse **a dónde vas**.

El contenedor tampoco ayudaba: `links_content` gastaba `paddingInline: md` por grupo, que en una
barra de cuatro grupos son 128 px de los 366 dedicados a aire entre separadores.

## Decisión

Por debajo de `tablet`, y sólo ahí:

1. **El enlace se apila.** `flex-direction: column`, icono arriba y rótulo debajo, los dos
   centrados, con `min-width: 64` para que un destino de nombre corto no se estreche por debajo de
   la diana táctil.
2. **Y el rótulo deja de crecer.** `NavLink` le pone `flex: 1` al cuerpo para que en su fila se
   quede con el ancho sobrante. Apilado, ese mismo `1` se queda con el **alto** sobrante —38 px de
   los 64— y el rótulo se pega al borde de arriba con el hueco muerto debajo, así que la pestaña se
   veía descentrada aunque el enlace pidiera `justify-content: center`. Con `flex: 0 0 auto` el
   cuerpo mide lo que mide su texto y los dos quedan centrados: medido, `9/9` arriba y abajo en las
   de dos líneas y `15/15` en las de una.
3. **El rótulo vuelve.** La regla se ata al enlace —`${link} ${body} ${label}`, tres clases— para
   que las otras dos `AppShell.Label` de la barra, la de la cabecera y la del pie, sigan apagadas:
   ésas sí desbordan.
4. **Dos renglones, no uno.** `NavLink` escribe su rótulo en una línea con elipsis, que es lo que
   quiere una fila vertical porque ahí el enlace tiene todo el ancho. Debajo de un icono no lo
   tiene: «Volver al inicio» en una línea sale «Volver al i…». Con `-webkit-line-clamp: 2` y
   `overflow-wrap: break-word` cabe entero, y el recorte queda para lo que de verdad no entra en
   dos — con su elipsis, que la hereda de `NavLink`.

   `break-word` y no `anywhere`: los dos evitan que una palabra larga desborde la caja, pero
   `anywhere` parte también cuando **sí** había un espacio donde cortar, y «Volver al inicio» salía
   «Volver a / l inicio».
5. **El rótulo tope 64 px y la pestaña 80.** Sin tope, cada destino mide lo que mida su nombre y la
   barra deja de leerse como una rejilla; con uno holgado la pestaña sale rectangular. Con estos
   dos, un destino mide 60×64 o 72×64 según su nombre.
6. **El rótulo baja a 11 px con interlínea 1,1.** Por debajo del `caption` de los tokens, que es 12
   y aquí queda grande: el rótulo de una pestaña acompaña al icono, no compite con él. No hay token
   más pequeño y no se añade uno: sería una escala nueva con un solo consumidor.

   **La interlínea va en la regla del rótulo, no en la del cuerpo.** `NavLink` fija la suya —`normal`,
   1,45— en el propio rótulo, así que heredarla desde arriba no vale: gana la del componente, y con
   letra de 11 el renglón seguía midiendo 16 px en vez de 12.
7. **Las dos ranuras de los extremos miden lo suyo y nada más.** La marca y el bloque de usuario
   son fijos a los lados y lo que sobra es lo único por donde se navega; con `min-width: 64` y
   relleno `md` se llevaban 135 px de 366 —el 37 %— para un sello de 30 y un avatar de 38. Sin
   mínimo y con relleno `xs` son 82, y las pestañas pasan de 229 a 282: **un 23 % más de barra
   dedicada a navegar**, que es una pestaña más a la vista.
8. **El contenedor suelta relleno lateral y gana vertical**: `paddingInline` de `md` a `xs`, hueco
   entre destinos de `sm` a `xxs`, y `paddingBlock` de `0` a `xxs` para que la fila no vaya pegada
   al filo de la barra. Lo que se ahorra a los lados se lo quedan los enlaces.

## Consecuencias

- Un destino ocupa más ancho que un icono suelto, así que caben menos a la vez y la barra desplaza
  más. Es un intercambio deliberado: con ADR-182 el activo siempre se ve, y saber qué es cada icono
  vale más que ver dos iconos más sin nombre.
- Medido en Rosette con WebKit a 390, los diez destinos: siete caben en una línea y tres —«Volver al
  inicio», «Mis Avatares», «Saldo y gasto»— pasan a dos por su espacio. **Ninguno se recorta**, y el
  icono queda centrado en los diez. Metiendo a mano un rótulo de 34 caracteres sale a dos líneas y
  se recorta con elipsis; una palabra larga sin espacios —«Internacionalizacion»— se parte y **no**
  desborda.
- El carril vertical y el mini de `laptop` no cambian: todas las reglas viven dentro de
  `SmallerThan("tablet")`.
- El tamaño del icono lo sigue poniendo el consumidor. `AppShell` no lo toca, porque el icono llega
  en `leftSection` y es suyo.
