# ADR-146 — El registro display sube un peldaño

- **Estado**: **aceptada** · 2026-08-14 — aprobada por el propietario
- **Enmienda**: [ADR-076](ADR-076-el-registro-display-del-titular.md), que fijó `font.display.size`
  igualando la referencia de marca medida sobre la landing.
- **Afecta**: `display.size` en `@stellaria/nebula-tokens`, y con él `Hero size="xl"`, que es su único
  consumidor.

## Contexto

ADR-076 midió el titular del `Hero` en `xl` —rendía 40 px fijos— y lo llevó al registro de la
referencia de marca, que pedía `clamp(52px, 5.2vw, 68px)` con interlineado 0.95 y tracking −0.055.
El valor no se eligió: se copió de lo medido.

Lo que cambió desde entonces es **la página, no la referencia**.
[ADR-141](ADR-141-la-portada-se-queda-en-tres-piezas-y-el-movimiento-entra-en-el-escenario.md) dejó
la portada en tres piezas —hero, prueba y cierre— donde antes montaba cinco bandas. El titular pasa
de abrir una de cinco a abrir una de tres, y sostiene una proporción de la primera pantalla que el
registro medido sobre la portada anterior no contemplaba.

## Decisión

**1. El registro sube un peldaño, conservando su forma.**

|         | suelo | fluido | techo | suelo hasta | techo desde |
| ------- | ----- | ------ | ----- | ----------- | ----------- |
| ADR-076 | 52 px | 5.2 vw | 68 px | 1000 px     | 1308 px     |
| ADR-146 | 60 px | 5.7 vw | 76 px | 1053 px     | 1333 px     |

Los dos extremos suben 8 px y la pendiente medio punto, así que la curva conserva su forma: el
titular sigue siendo fijo en móvil, fluido en la banda intermedia y fijo otra vez en pantallas
anchas, con los codos casi donde estaban.

**2. `lineHeight` y `letterSpacing` no se tocan.** ADR-076 insistió en que las tres van juntas
porque juntas definen un registro. Siguen juntas: `0.95` es una razón, no un valor absoluto, así que
escala con el tamaño y la relación entre altura de línea y cuerpo es la misma a 76 px que a 68. El
tracking es en `em` y escala igual.

**3. No se separa del contrato.** `display` sigue siendo un bloque del `ThemeFont`, así que un tema
puede seguir redefiniéndolo entero, y un producto que quiera el registro anterior lo escribe en su
tema sin forkear nada.

## Alternativas

**Dejarlo en el valor de ADR-076 y agrandar el titular solo en la portada.** Descartada porque es la
vía que ADR-076 existió para cerrar: antes de él, `Hero.titleSize.xl` usaba `font.size.h2` y cada
página resolvía su titular por su cuenta. Un `fz` en la portada devuelve exactamente ese estado.

**Subir solo el techo, dejando el suelo en 52.** Descartada: estira la pendiente y con ella la banda
donde el titular cambia de tamaño al redimensionar, que es justo lo que un `clamp` con codos cerca
existe para acotar.

## Consecuencias

- **Repinta en los cinco temas y en cualquier consumidor de `Hero size="xl"`.** Es un token del
  contrato, así que el cambio viaja por CSS sin recompilar componentes — y por lo mismo alcanza a
  todo tema que no redefina `display`.

- **El baseline visual ya lo tenía dentro.** La recaptura del 2026-08-14 se hizo con este valor en el
  árbol, así que las 75 láminas guardan el registro nuevo y el gate está en verde con él. Revertirlo
  ahora pondría rojo el gate.

- **Se aleja de la referencia de marca que ADR-076 midió.** Aquel ADR igualaba la landing de
  Stellaria; este la deja 8 px por encima en los dos extremos. Si las landings se reconstruyen sobre
  Nebula —el B6 de WB—, la que quede corta será la landing, no el sistema. Conviene tenerlo presente
  cuando se retome esa migración, porque es la clase de divergencia que WB existió para no crear.
