# WN · N2 — Los siete candidatos a compound, uno a uno

Informe pedido antes de convertir nada. El criterio es el de ADR-097:

> Es compound si el consumidor necesita **reordenar o sustituir** sus partes.
> Si solo necesita **rellenarlas**, bastan props de ranura (N3).

Los siete salen de medir el catálogo por número de ranuras `ReactNode`, que es la única de las tres
señales del prompt que discrimina: la de "props que solo eligen orden" no tiene un solo caso, y
`order` en Hero, Section y Header es el nivel del encabezado, no el orden de las partes.

Dos preguntas deciden cada caso:

1. **¿Tiene `children`?** Sin `children`, el consumidor solo puede rellenar → es N3, no compound.
2. **¿El orden en que pinta las ranuras es editorial o semántico?** Si es editorial —alguien querrá
   las acciones antes de la descripción— hace falta compound. Si es semántico —izquierda, centro,
   derecha en una barra— reordenar no significa nada.

---

## Recomendación: SÍ

### Hero · 9 ranuras

Pinta en orden fijo `left → hiper → title → subtitle → description → children → actions → right →
bottom`. Ocho ranuras con nombre alrededor de un `children` que cae **en medio**, así que no sirve de
escape: un consumidor que quiera las acciones sobre la descripción, o el `hiper` bajo el título,
tiene que forkear. Es el caso más claro de los siete, y el orden es puramente editorial.

**Partes propuestas**: `Hero.Hiper`, `Hero.Title`, `Hero.Subtitle`, `Hero.Description`,
`Hero.Actions`, `Hero.Left`, `Hero.Right`, `Hero.Bottom`.

### Section · 8 ranuras

Pinta `title → description → actions → aside → error → footer` alrededor del cuerpo. El caso real es
la cabecera: `actions` va siempre después de `description`, y un panel con las acciones a la altura
del título —que es lo habitual en una vista de datos— no se puede expresar. Más flojo que Hero
porque `aside` y `footer` ya son regiones, no contenido en línea.

**Partes propuestas**: `Section.Header`, `Section.Actions`, `Section.Aside`, `Section.Footer`.

---

## Recomendación: NO — ya está resuelto

### Kanban · 12 ranuras

Las doce no son ranuras de maquetación: son campos de la columna (`title`, `badge`, `empty`) y de la
tarjeta (`title`, `description`, `meta`, `badge`), contados por el medidor a través de sus subtipos.
Y la sustitución **ya está resuelta** con una render prop: `renderCard: (item, columnId) =>
ReactNode`. El consumidor que quiera otra tarjeta la pasa entera.

Es además el contraejemplo útil: en un componente dirigido por datos, la render prop hace el trabajo
del compound sin duplicar la API.

### CardComplex · 7 ranuras

Es un preset —una composición ya montada de `Card`, que sí es compound—. El consumidor que necesite
otro montaje tiene la escapatoria a un nivel de distancia: usar `Card` directamente. Convertirlo
sería ofrecer dos formas de componer lo mismo.

---

## Recomendación: NO — son N3, props de ranura

### Header · 6 ranuras

Pinta `backIcon → leftSection → title → subtitle → rightSection → children`. El orden es
**semántico**, no editorial: es una barra, y sus posiciones son izquierda / centro / derecha.
Reordenarlas no quiere decir nada, y `leftSection` / `rightSection` ya dan la escapatoria lateral.

Lo que le falta no es composición sino ajuste fino del nodo que pinta: `titleProps`, `subtitleProps`.
Es exactamente el ejemplo que el prompt de WN usa para explicar N3.

### EmptyModule · 7 ranuras · sin `children`

`title`, `description`, `illustration`, `icon`, `action`, `secondaryAction`, `footer`. Sin
`children`, el consumidor no puede componer nada: solo rellena. Por definición, N3.

### Charts · 6 ranuras · sin `children`

`empty`, `title`, `description`, `action`, `content`. Mismo caso, con el añadido de que las series
llegan como datos.

---

## Resumen

| componente  | ranuras | `children` | orden      | veredicto                    |
| ----------- | ------: | ---------- | ---------- | ---------------------------- |
| Hero        |       9 | sí, en medio | editorial | **compound**                 |
| Section     |       8 | sí         | editorial  | **compound**                 |
| Kanban      |      12 | sí         | datos      | ya resuelto (render prop)    |
| CardComplex |       7 | sí         | editorial  | ya resuelto (usar `Card`)    |
| Header      |       6 | sí         | semántico  | N3 — props de ranura         |
| EmptyModule |       7 | **no**     | —          | N3 — props de ranura         |
| Charts      |       6 | **no**     | —          | N3 — props de ranura         |

Convertir Hero y Section es **API pública nueva**, y WN declara que no añade catálogo. Queda a
decisión del propietario abrirlo dentro de WN o después de W5.
