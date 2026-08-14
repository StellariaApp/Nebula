# Cierre de WB — Afinamiento de marca

> Verificación de los siete tramos de `prompts/2.2-brand-align/README.md` y del plan
> [`docs/reviews/brand-alignment-plan-2026-08-02.md`](reviews/brand-alignment-plan-2026-08-02.md).
> Fase ejecutada el 2026-08-02; documento de cierre escrito el 2026-08-14.
> Fases previas: `f0-closure.md`, `w1-closure.md`, `w2-closure.md`, `w3-closure.md`,
> `w4-closure.md`, `wr-closure.md`.

## Estado

**WB cerrada.** Los seis desalineamientos que el plan midió contra las tres landings en producción
están resueltos, cada uno con su ADR, y la primera vuelta de B6 demuestra el principio que ordenaba
la fase sobre el render, no sobre la intención.

## El principio, y por qué es medible

> **Entre productos solo cambia el color.** Si dos landings difieren en algo que **no** es color, la
> que difiere está mal — o el sistema no tiene ese algo.

Radio, ritmo, alto de control, mecánica del cristal, escalera de elevación y registro tipográfico no
son decisiones de producto. Que las tres landings difirieran en las seis no era variedad de marca:
era que el sistema no las había fijado y cada una rellenó el hueco a mano.

## Los tramos

| Tramo  | Desalineamiento                                                                             | Cierre                                                                     |
| ------ | ------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| **B0** | backlog visual abierto                                                                      | `StarField parallax` estaba mal anclado, no era motion                     |
| **B1** | D3 · la geometría de marca no cae en las escalas                                            | [ADR-072](adr/ADR-072-los-peldanos-de-la-marca-entran-al-contrato.md)      |
| **B2** | D1, D2 · el cristal de Rosette no es cristal, y el de un control no es el de una superficie | [ADR-078](adr/ADR-078-el-cristal-es-una-receta-por-clase-de-superficie.md) |
| **B3** | D4 · en dark la elevación no es sombra                                                      | ADR-065 implementado: escalera ≥1.08 en los cinco temas                    |
| **B4** | D5 · la tipografía del hero es fluida y apretada                                            | [ADR-076](adr/ADR-076-el-registro-display-del-titular.md)                  |
| **B5** | opacidad en las referencias de color                                                        | [ADR-071](adr/ADR-071-opacidad-en-referencias-de-color.md)                 |
| **B6** | reconstruir las tres landings sobre Nebula                                                  | primera vuelta — ver abajo                                                 |

**B3 absorbió el T3 de WR**, que era el tramo que aquella fase había dejado sin implementar. El
prompt de WB lo decía por escrito y así ocurrió.

D6 —el nav— no necesitó tramo: ya convergía, y el plan lo usó como prueba de que el método
funcionaba antes de aplicarlo a los otros cinco.

## La prueba de B6

`Patterns/Landing` rinde **la misma composición** —el componente `Page`— bajo tres temas: `rosette`
(rosa), `stellaria` (azul) y `lagrange` (rojo-naranja). Los dos nuevos se construyen con el mismo
patrón que ya usaba `rosette`: `nebulaDark` más escalas de color y gradiente de marca. Nada más.

Medido nodo a nodo sobre el render:

|                                |     |
| ------------------------------ | --- |
| nodos por producto             | 230 |
| geometría idéntica en los tres | sí  |
| color distinto en los tres     | sí  |

La huella de geometría compara ancho, alto, `font-size`, `padding` y `border-radius`; la de color,
`color`, `background-color` y `border-color`. El principio de la fase queda demostrado sobre el
render, que es la única forma de demostrarlo.

**Es la primera vuelta, y el propio plan acota lo que prueba** (§5.7): que una composición se puede
tematizar sin recablear. No prueba que las tres landings de producción se puedan migrar tal cual —eso
es trabajo de sus repos, no de Nebula— ni sustituye a la migración real, que sigue fuera de la etapa
web.

## Deuda declarada

- **La cabecera del plan quedó desactualizada.** Dice «propuesta, pendiente de checkpoint del
  propietario» mientras su propia tabla marca los siete tramos cerrados el 2026-08-02. Se conserva
  como estaba: el documento es un registro fechado, y su tabla es la que manda.

- **WB no estaba en `05-roadmap.md`.** La fase nació solo en `prompts/`, igual que WN. Este cierre le
  añade su entrada.

## Lo que WB NO hizo

No migró ninguna de las tres landings de producción: `B6` reconstruye una composición de prueba, no
sus páginas. No tocó la forma del catálogo —eso es WN— ni añadió componentes.
