# ADR-046 — Re-fase de la escala de radius a múltiplos de 4

- **Estado**: **aceptada** · 2026-07-28 (checkpoint de la comparación de geometría; decisión del
  propietario, **contra la recomendación del análisis**)
- **Análisis de origen**: `docs/reviews/geometria-figma-vs-nebula-2026-07-28.md` §1 y §4 nivel 2.

## Contexto

Las dos escalas son progresiones de +4 desfasadas 2 px:

| Escala             | Valores en px                          |
| ------------------ | -------------------------------------- |
| Nebula (`radius`)  | 0 · **2** · **6** · **10** · **14** · 20 · 28 |
| Figma (medidos)    | — · **4** · **8** · **12** · 14 · **16** · 999 |

Solo coinciden en 6 —el ítem de paginación— y en 14. El diseño redondea sistemáticamente más: 12 en
cards y paneles contra 10 de Nebula, 16 en el Modal contra 14.

El censo de consumidores es de **72 usos** en `packages/web/src`:

| Token | Usos |
| ----- | ---: |
| `sm`  |   22 |
| `full`|   17 |
| `md`  |   15 |
| `xs`  |    6 |
| `lg`  |    6 |
| `xxs` |    2 |
| `xxl` |    2 |
| `xl`  |    2 |

Todos consumen el token por nombre, ninguno escribe un valor: re-fasar la escala mueve los 72 sin
tocar un solo `.css.ts`.

## Decisión

1. **Los cuatro peldaños centrales se re-fasan a múltiplos de 4**:

   | Nombre | Antes | Después |
   | ------ | ----: | ------: |
   | `xxs`  |     0 |       0 |
   | `xs`   |     2 |   **4** |
   | `sm`   |     6 |   **8** |
   | `md`   |    10 |  **12** |
   | `lg`   |    14 |  **16** |
   | `xl`   |    20 |      20 |
   | `xxl`  |    28 |      28 |
   | `full` |  9999 |    9999 |

2. **`xl` y `xxl` no se tocan.** El extremo grande no aparece en el diseño y moverlo solo añadiría
   cambio visual sin referencia que lo justifique. La progresión resultante es +4 constante hasta `xl`
   y +8 al final, que es la forma que ya tenía.

3. **Ningún componente cambia de token.** La re-fase es un cambio de valor, no de API: `radius.sm`
   sigue llamándose `radius.sm` y sigue siendo el radio de un control pequeño. El catálogo entero se
   mueve con la escala.

## Alternativas

- **No tocarla**, aceptando que las cards queden 2 px menos redondas: coste cero y ningún baseline
  invalidado. **Era la recomendación del análisis**, por ser la diferencia menos visible del informe y
  la más cara de revertir. El propietario la rechazó: prefiere alinearse con el diseño y con la
  convención dominante ahora, antes de que existan capturas de referencia.
- **Re-fasar la escala completa a 4·8·12·16·20·24**, moviendo también `xxl` de 28 a 24: progresión +4
  perfecta, a cambio de encoger el radio máximo sin motivo medido. Rechazada.
- **Añadir peldaños en vez de moverlos** (mantener 2·6·10·14 y añadir 4·8·12·16): duplica la escala,
  deja dos radios casi idénticos disponibles a la vez y garantiza que el catálogo derive. Rechazada.

## Consecuencias

- **Cambio visual simultáneo en todo el catálogo.** Es la consecuencia principal y fue advertida en el
  checkpoint: 72 usos se mueven a la vez. No hay migración progresiva posible ni deseable —una escala
  a medio fasar es peor que cualquiera de las dos.
- **Invalida cualquier baseline de regresión visual previo.** ADR-037 aún no ha capturado el suyo, que
  es justo por lo que este cambio se hace **ahora** y no después: capturarlo antes obligaría a
  regenerarlo entero.
- **El contrato no cambia de forma**: `RadiusName` conserva sus 8 miembros. No hay ampliación de API,
  no hay tema que deje de validar, y el schema de Zod no se toca.
- **Riesgo de composición**: los componentes que anidan superficies —Card dentro de Modal, input dentro
  de Card— pasan de una diferencia de 4 px entre niveles a la misma diferencia de 4 px. La relación se
  conserva porque todos los peldaños se mueven igual.
- **`docs/06`** registra la escala nueva y la razón del desfase corregido.
- **Precondición del nivel 3** del plan de geometría junto con ADR-045: Segment pide `full`, Card pide
  12 y Modal pide 16, y los dos últimos no existían.
