# ADR-080 — Los temas de esquema se llaman `dark` y `light`

- **Estado**: **aceptada** · 2026-08-02 — a petición del propietario durante WB
- **Enmienda**: los nombres del registro fijados en [ADR-020](ADR-020-identidad-visual-nebula.md) y
  documentados en `docs/02-theming.md` §3.
- **No toca**: `sober-light` ni `playful`, que no llevan prefijo de marca.

## Contexto

El registro de temas oficiales nombraba dos de sus cuatro entradas con el prefijo del sistema:
`nebula-light`, `nebula-dark`, `sober-light`, `playful`. Dentro de Nebula ese prefijo no distingue
nada —los cuatro son temas de Nebula—, así que sólo aparecía en dos de las cuatro claves y las
desalineaba.

El coste real de dejarlo estaba en la tesis de WB. La frase que gobierna la fase es «entre productos
sólo cambia el color»: un producto se declara tomando un tema base y sustituyendo su escala. Con el
nombre anterior, ese gesto se escribía `{ ...nebulaDark }` para acabar en un tema llamado `rosette`,
y el gemelo claro no tenía nombre natural. Con `dark` y `light` el par de esquemas es una dimensión
ortogonal a la marca, que es lo que de verdad es.

## Decisión

Las claves del registro y el tipo pasan a ser:

| Antes           | Ahora          |
| --------------- | -------------- |
| `nebula-light`  | `light`        |
| `nebula-dark`   | `dark`         |
| `sober-light`   | `sober-light`  |
| `playful`       | `playful`      |

`OfficialThemeName` queda en `"light" | "dark" | "sober-light" | "playful"`, y `meta.name` de cada
tema acompaña a su clave.

**Los exports con nombre no cambian**: siguen siendo `nebulaLight` y `nebulaDark`. Un `export const
dark` sería un identificador demasiado genérico para un paquete que se importa por nombre, y el
prefijo ahí sí distingue —distingue el módulo, no el esquema—.

**Los registros históricos no se reescriben.** ADRs anteriores, `docs/reviews/` y `prompts/` siguen
diciendo `nebula-dark`: recogen lo que se decidió cuando se decidió, y este ADR es el que los
sustituye. Se renombra el código, los docs vivos y el playground.

## Consecuencias

- **Rompe el tema persistido.** El provider guarda el nombre del tema en `storage`; un usuario con
  `"nebula-dark"` guardado de antes ya no resuelve contra el registro. Cae al `defaultTheme`, que es
  el comportamiento correcto para un nombre desconocido y el que ya cubría los temas borrados. No se
  añade migración: los paquetes son `private: true` y no hay consumidor publicado.
- El toolbar del playground rotula «Light» y «Dark», y las láminas de `ThemeMatrix` muestran `dark` y
  `light`.
- `tools/render-measure/` mide contra los nombres nuevos.
