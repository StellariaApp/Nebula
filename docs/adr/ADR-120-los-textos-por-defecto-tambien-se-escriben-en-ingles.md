# ADR-120 — Los textos por defecto también se escriben en inglés

- **Estado**: aceptada · 2026-08-09 (decisión del propietario) · **WN · W5**
- **Extiende [ADR-114](ADR-114-el-jsdoc-publico-se-escribe-en-ingles.md)**, que decidió el idioma de
  la superficie pública y se aplicó solo al JSDoc.
- **Cambia API pública**: no cambia ninguna firma. **Cambia comportamiento**: 118 cadenas por defecto
  pasan de español a inglés.

## Contexto

ADR-114 decidió que la superficie pública se escribe en inglés. Se aplicó al JSDoc —500 bloques, ya
cerrados— y no a los **valores por defecto** de las props de etiqueta, que son igual de públicos: son
lo que un consumidor ve en su producto si no pasa nada.

El fallo apareció **cuatro veces seguidas** construyendo el sitio de documentación, que está en
inglés: el skip link decía «Saltar al contenido», el `Burger` «Abrir menú», el `Nav.Sidebar` «Cerrar
la navegación», y `Stat` metía «al alza» en el lector de pantalla. Cada una se tapó pasando la
etiqueta a mano. Cuatro parches para el mismo problema es la señal de que el problema no estaba ahí.

Medido con detección por palabras funcionales —no por tildes, que ya subestimó el JSDoc siete veces—:
**118 cadenas distintas en 135 sitios, repartidas por 51 componentes.**

## La medición que importa: casi todas tienen salida

Clasificadas por si el consumidor puede taparlas:

|                                                          |         |
| -------------------------------------------------------- | ------- |
| Tienen prop de etiqueta —`labels`, `*Label`, `linkText`— | **117** |
| **Sin ninguna salida**                                   | **1**   |

La única sin salida es `GridList.tsx:70`, un `aria-label="Modo de vista"` escrito a pelo. **Eso no es
un defecto discutible: es un fallo**, porque un consumidor angloparlante no puede arreglarlo de
ninguna manera. Las otras 117 son una molestia documentada.

Aparte hay **cinco mensajes de `Error()`** que solo ve un desarrollador —`Form`, `Hero`, `Section`,
`Segment` y el «Tema desconocido» de `NebulaProvider`—, que no son interfaz pero sí superficie
pública de una librería.

## Decisión

**Las 118 pasan a inglés, y con ellas los cinco mensajes de error.**

Se eligió sobre la alternativa mínima —traducir solo las seis sin salida— por una razón de calendario,
no de gravedad: **después de publicar, cada una de esas cadenas es una rotura para alguien**. Hoy el
único consumidor que depende de los defectos es el propio playground.

`GridList` recibe además la prop que le faltaba, porque traducir su `aria-label` sin darle salida
dejaría el mismo fallo en otro idioma.

### Lo que NO cambia

- **Ninguna firma.** Las props de etiqueta ya existían; solo cambia su valor por defecto.
- **El español del repo interno**: los ADRs, los `docs/` y los `.md` de módulo siguen en español.
  Son documentación interna, no superficie pública, y así lo fija el README del sitio.
- **Los tests que pasan su propia cadena.** Un test que escribe `aria-label="Cerrar"` y luego lo
  busca sigue siendo válido: prueba comportamiento, no idioma.

## Consecuencias

- **Rompe visualmente a quien dependa hoy de un defecto en español.** Se asume: es la ventana en la
  que ese coste es cero.
- **Los tests que asertan un defecto hay que actualizarlos**, y son los que prueban justo lo que este
  ADR cambia. Los que pasan su propia etiqueta se quedan como están.
- **`GridList` gana una prop de etiqueta.** Es la única ampliación de API del cambio.
- Un consumidor hispanohablante que quiera el español lo tiene igual de lejos que antes: pasando la
  prop. La diferencia es que ahora el defecto coincide con el idioma de la documentación.
