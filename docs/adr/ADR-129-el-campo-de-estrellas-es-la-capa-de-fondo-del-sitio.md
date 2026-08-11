# ADR-129 — El campo de estrellas es la capa de fondo del sitio

- **Estado**: aceptada · 2026-08-11 (decisión del propietario) · **WN** · implementada
- **Cambia API pública**: no cambia el contrato de `StarField`. **Enmienda `docs/06` §6**, que es doc
  cerrado, y con él el JSDoc de `StarFieldProps` —que es API por
  [ADR-105](ADR-105-el-jsdoc-de-api-publica-no-es-un-comentario.md)—.
- **Depende de**: [ADR-128](ADR-128-el-carril-lee-su-nivel-de-cristal.md): sin carril traslúcido, la
  capa de fondo se ve en toda la página menos en la columna que más la pedía.

## Contexto

`docs/06` §6 reserva el efecto dominante a hero, entrada y estado vacío, y prohíbe el fondo dominante
«en tablas, formularios ni lectura larga». Por eso el cromado del sitio encendía el degradado y
apagaba las estrellas: `SiteBackground stars={false}` en todas las rutas menos la portada.

El resultado es un sitio partido en dos: la portada tiene la firma visual de Stellaria y la
documentación —que es el 90 % de las páginas— no tiene ninguna. La regla se escribió pensando en un
efecto **por región**, donde compite con el contenido de esa región; una capa a pantalla completa
detrás de todo no es ese caso, y no había forma de decirlo con la redacción de §6.

## Decisión

**El campo de estrellas es la capa de fondo de todo el sitio**, y §6 gana una excepción con números en
vez de adjetivos. Vale a pantalla completa detrás de todo si cumple las cuatro:

| condición                                       | por qué                                                              |
| ----------------------------------------------- | -------------------------------------------------------------------- |
| vive en la capa de fondo, nada se apoya en ella | si el contenido se lee sobre él, vuelve a ser efecto de región       |
| rejilla en `translucency: 1`                    | la rejilla es lo que compite con una tabla: son líneas contra líneas |
| densidad `sm` o menos (20 estrellas)            | la densidad, no la opacidad, es lo que se nota bajo prosa            |
| es el único efecto dominante de la página       | ninguna región vuelve a montar el suyo encima                        |

**`translucency` es el alfa de la rejilla en tanto por ciento, no una opacidad global**: sube el
número y la rejilla se ve **más**. Las estrellas van a 70 % y la aurora a 24/12 % pase lo que pase, así
que el peldaño que de verdad calibra el peso es `density`. Por eso la excepción fija los dos y no uno.

`SiteBackground` expresa las dos calibraciones y no deja elegir a ojo:

- sin `ambient` — la portada: `density="md"`, `translucency={2}`. Es un hero, y ahí la regla vieja ya
  lo permitía.
- con `ambient` — el cromado: `density="sm"`, `translucency={1}`. Es la que cumple la excepción.

**La pantalla `Reserved` pierde el suyo.** Montaba un `StarField` propio dentro de su tarjeta; con la
capa global detrás sería el segundo campo de la misma página, que es justo lo que la cuarta condición
prohíbe. La tarjeta no tiene fondo, así que lo que se ve a través de ella es el campo del sitio.

## Consecuencias

- **La firma visual deja de ser exclusiva de la portada**, que era el motivo del cambio.
- **`docs/06` §6 y el JSDoc de `StarFieldProps` se actualizan en este mismo PR.** Un contrato que
  dice «no detrás de una tabla» mientras el sitio lo hace es peor que no tener contrato.
- **El gate de contraste no se entera y es correcto que no**: la capa va detrás de superficies opacas
  o de cristal, y ningún texto se apoya en ella. Lo que sí hay que mirar en revisión visual es la
  columna de lectura del sitio, que es donde la excepción se juega.
- `prefers-reduced-motion` y `motion.tier: "minimal"` siguen apagando parpadeo y parallax, y el campo
  se queda estático: eso ya lo garantizaba `StarField` y no cambia.
- **La excepción es medible**, así que un futuro gate puede comprobarla sin criterio: `fixed`,
  `translucency ≤ 1`, `density ≤ sm` y un solo campo por página.

## Alternativas descartadas

**Encenderlo con la calibración de la portada** (`density="md"`, `translucency={2}`). Es el mismo peso
que un hero detrás de una tabla de 158 filas: la rejilla y las líneas de la tabla se suman.

**Encenderlo solo en el chasis de guías.** Deja `/theme` y `/changelog` con su campo dentro de la
tarjeta y el resto del sitio sin nada: la misma partición que motivó el cambio, movida de sitio.

**Reescribir §6 entero para permitir el efecto ambiental sin condiciones.** La regla original protege
algo real —el fondo que compite con el contenido de su región— y sigue valiendo. Lo que faltaba era
distinguir la capa de página del efecto de región.
