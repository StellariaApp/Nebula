# ADR-165 — El atributo del tema pierde la marca: `data-nebula-theme` pasa a `data-theme`

- **Estado**: **aceptada** · 2026-08-17 — decidida por el propietario
- **Cambia API pública**: sí, y **rompe**. Es un atributo del DOM contra el que un consumidor puede
  tener selectores escritos.
- **Toca**: `NebulaProvider`, `ColorSchemeScript`, `docs/02` §4.

## Contexto

El provider marca el elemento del tema con dos atributos, y no se parecen:

```html
<html data-nebula-theme="dark" data-scheme="dark">
```

Uno lleva la marca de la librería y el otro no. La incoherencia ya estaba, pero lo que la vuelve un
problema es lo que significa el nombre ahora que hay temas de producto: **`nebula` es también un
tema**. `data-nebula-theme="rosette"` se lee como «el tema nebula vale rosette», que es justo lo que
no dice — el atributo nombra **el tema activo**, sea de quien sea.

Con ADR-163 el catálogo de temas deja de ser «los dos oficiales y quizá algo inyectado» para ser una
lista que declara el consumidor. El atributo tiene que nombrar esa lista sin apropiarse de ella.

## Decisión

`data-nebula-theme` pasa a **`data-theme`**. El par queda `data-theme` / `data-scheme`, que es lo que
la incoherencia pedía desde el principio.

No se mantiene el atributo viejo en paralelo. Emitir los dos deja al consumidor sin saber cuál es el
bueno y garantiza que dentro de un año sigan los dos, que es como se acumulan los contratos que nadie
se atreve a retirar. La librería está en `0.x` y este es el momento barato de hacerlo.

## Alternativas

**Dejarlo como está.** Cero trabajo y el nombre sigue mintiendo cada vez que el tema no es de Nebula.

**Emitir los dos durante una versión.** La transición ordenada de manual. Se descarta por lo dicho
arriba y porque el alcance real es minúsculo: dos archivos de código en toda la librería, ningún
selector CSS interno, y ninguna app del monorepo lo usa.

**`data-nebula`** a secas, o `data-nebula-active`. Conserva la marca y no arregla la asimetría con
`data-scheme`. Si se quisiera marca, habría que ponérsela también al otro, y entonces el cambio es
mayor y el beneficio ninguno.

## Consecuencias

- **Rompe** para quien tenga `[data-nebula-theme="…"]` en su CSS o en un test. Va en las notas de la
  versión con el reemplazo literal, que es una sustitución de texto.
- `data-theme` es un nombre común: si el consumidor monta otra librería que también lo escribe sobre
  `<html>`, chocan. Es el precio de no llevar marca y se asume a sabiendas; quien tenga ese conflicto
  puede declarar el tema en un contenedor propio con `applyTheme="wrapper"`.
- Los ADR-030, 107, 117 y 155 mencionan el nombre viejo. **No se reescriben**: registran lo que se
  decidió cuando se decidió, y este ADR es el que dice qué se llama hoy.
