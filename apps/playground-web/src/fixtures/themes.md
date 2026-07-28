# Fixtures de tema del playground

## `ThemeMatrix`

Renderiza la misma composición una vez por tema, **lado a lado en la misma vista**. Antes de esto las
stories `AllThemes` se limitaban a fijar un tema alternativo en la toolbar (`globals: { theme: … }`),
de modo que no comparaban nada: había que cambiar de story para ver el siguiente tema y la deriva entre
temas era imposible de detectar de un vistazo.

Funciona porque `NebulaProvider` monta su propio contenedor con la clase del tema, así que anidar varios
providers hermanos da a cada panel su propio ámbito de vars. Desde ADR-030 el provider también publica
un contenedor de portales dentro de ese ámbito, que es lo que permite meter overlays en la matriz: hasta
entonces su contenido se portalizaba a `document.body` y salía del tema.

## `MATRIX_A11Y`

La matriz repite la composición N veces, así que cualquier landmark que ésta contenga aparece duplicado
**por construcción** — `<nav aria-label="Paginación">` cuatro veces, por ejemplo. `landmark-unique` es
una regla de página, y una lámina de comparación no es una página: el duplicado es el objetivo del
ejercicio, no un defecto del componente.

`MATRIX_A11Y` desactiva únicamente esa regla, y `test-runner.ts` la aplica leyendo
`parameters.a11y.rules`. El resto del gate axe sigue activo en estas stories, incluido `color-contrast`,
que es justamente lo que la matriz existe para vigilar: si un tema rompe el contraste de un componente,
la lámina lo enseña.

## `rosette`

Tema de producto de prueba (`#F43F5E → #FB7185`), expresado sobre `NebulaTheme` sin ampliar el contrato
y deliberadamente **fuera de `officialThemeNames`**. Su función es detectar hardcodes del eje
indigo/violet que los cuatro temas oficiales no pueden exponer, porque todos comparten ese eje o sus
derivados.

Cumplió su función el día que se escribió: la primera versión usaba `palettes.rose` sin voltear en un
tema oscuro y el gate axe lo detectó como contraste insuficiente en `filled`, `outline` y `ghost`. En un
esquema oscuro la escala va invertida (`FlipScale`), y ese es exactamente el error que un tema de
producto ajeno debe cazar.
