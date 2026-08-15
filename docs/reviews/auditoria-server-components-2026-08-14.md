# Auditoría — qué componentes podrían ser de servidor

> **Fecha**: 2026-08-14 · **Para**: P5 del [plan de performance](plan-performance-web-2026-08-14.md)
> **Método**: clasificación de los 158 componentes de `packages/web/src/components` por lo que los
> ata al cliente. Se leen todos los `.tsx`/`.ts` del componente, incluidas las partes de compound en
> `components/`, y manda la señal más fuerte.

## El número

|                                            |         |
| ------------------------------------------ | ------- |
| Componentes                                | **158** |
| Ya de servidor                             | **29**  |
| De cliente                                 | **129** |
| De cliente **sin un solo bloqueante real** | **20**  |

Bloqueantes encontrados, contando que un componente puede tener varios:

| Señal      | Componentes | Qué es                                        |
| ---------- | ----------- | --------------------------------------------- |
| `handler`  | 76          | escribe `onX={…}` en JSX o `addEventListener` |
| `estado`   | 39          | `useState`, `useEffect`, `useReducer`…        |
| `ref`      | 35          | `useRef` o `forwardRef`                       |
| `aria`     | 29          | hooks de React Aria                           |
| `motion`   | 22          | `motion/react`                                |
| `browser`  | 15          | `window`, `document`, observers…              |
| `contexto` | 10          | `createContext` / `useContext`                |

> El recuento de `handler` es **indicativo, no veredicto**: casa también con componentes que se
> limitan a reenviar una prop del consumidor, y ésos no necesitan ser de cliente. Los 20 candidatos
> sí están verificados por ausencia de todas las señales.

## Lo que decide el orden: los contenedores mandan

**Un componente de servidor dentro de un componente de cliente sigue hidratando.** En RSC, lo que un
componente de cliente importa y renderiza pasa a ser cliente, se declare lo que se declare. Solo
sobrevive lo que baja como `children` desde un padre de servidor.

Traducido a la portada: `Hero` es de cliente, así que el `Badge`, el `GradientText` y los `Button`
que renderiza dentro hidratan **aunque los convirtiéramos a los tres**. Convertir hojas sin convertir
contenedores no ahorra nada.

Los contenedores del camino de la portada, y qué los ata:

| Componente    | Estado   | Lo que lo bloquea                      |
| ------------- | -------- | -------------------------------------- |
| `Box`         | servidor | —                                      |
| `Text`        | servidor | —                                      |
| `SimpleGrid`  | servidor | —                                      |
| **`Hero`**    | cliente  | **contexto de compound** + `useTheme`  |
| **`Section`** | cliente  | **`motion`** + contexto de compound    |
| `Card`        | cliente  | `motion` + handler                     |
| `Button`      | cliente  | `motion` + React Aria + ref — legítimo |

`Hero` es el que más pesa: **es el dueño del elemento que marca el LCP**. Y no lo ata solo el tema,
como se dijo en el diagnóstico inicial — lo ata también `Hero.context.ts`, el contexto con el que las
partes del compound se coordinan. Son dos trabajos, no uno.

## Los 20 candidatos

Cero señales bloqueantes. La columna dice qué queda por resolver, que en todos los casos es blando.

| Componente       | Queda     |     | Componente       | Queda     |
| ---------------- | --------- | --- | ---------------- | --------- |
| `Affix`          | nada      |     | `NoiseOverlay`   | tema      |
| `Badge`          | tema      |     | `Overlay`        | nada      |
| `BlurOverlay`    | tema      |     | `PermissionGate` | nada      |
| `CardComplex`    | `useMemo` |     | `Progress`       | tema      |
| `Countdown`      | `useMemo` |     | `Scroll`         | memo+tema |
| `DateTimePicker` | nada      |     | `Stat`           | nada      |
| `Drawer`         | nada      |     | `Table`          | nada      |
| `EmptyModule`    | nada      |     | `Tabs`           | `useMemo` |
| `Feature`        | nada      |     | `ThemeIcon`      | tema      |
| `Indicator`      | nada      |     | `Timeline`       | tema      |

Tres grupos, con esfuerzo muy distinto:

1. **Los 9 de «nada»** — `Affix`, `Drawer`, `EmptyModule`, `Feature`, `Indicator`, `Overlay`,
   `PermissionGate`, `Stat`, `Table`, `DateTimePicker`. Llevan `"use client"` y **no lo necesitan**:
   componen otros componentes y no tocan nada de cliente. `Drawer` es el caso puro — su archivo
   entero es un `<Modal>` con props. Quitar la directiva y ver que compila es todo el trabajo.
2. **Los 4 de `useMemo`** — trivial: `useMemo` es una optimización, no una necesidad. Se calcula y ya.
3. **Los 8 de tema** — necesitan la decisión de P5: resolver el tema sin contexto de React.

## Lo que esto significa para P5

El ADR de P5 no es «quitar `useTheme`». Son **tres decisiones separadas**, y solo una toca el
contrato cerrado:

- **A. Los que sobran.** 9 componentes con la directiva puesta de más. **No pide ADR** — no cambia
  API pública ni contrato, solo quita una etiqueta que no hacía falta. Se puede hacer ya.
- **B. Los contextos de compound.** `Hero` y `Section` se coordinan por contexto. Hay patrones para
  compounds sin contexto —inspeccionar `children`, o componer por props—, y `Hero` ya usa
  `ContainsPart` para algo parecido. Es rediseño de dos componentes, no del catálogo.
- **C. El tema fuera del render.** Los 8 de arriba más los que hoy están tapados por otro bloqueante.
  **Es la que toca `docs/02` §2 y pide ADR.**

Y hay una cuarta, que es de la app y no de la librería: **la portada monta el catálogo para
enseñarlo**. `ThemePanel` arrastra todos los temas, `ProductSurface` monta un escenario entero y
`StarField` pinta un canvas — nada de eso es necesario para pintar el Hero. Eso es P2 y no depende de
ninguna de las tres.

## Recomendación de orden

1. **A primero.** 9 componentes, sin ADR, medible por bytes con `check:budget`. Es lo único de esta
   lista que se puede hacer y verificar hoy mismo.
2. **B después**, porque `Hero` y `Section` son los contenedores del camino del LCP y **desbloquean
   todo lo que llevan dentro**. Sin esto, convertir hojas no ahorra nada.
3. **C al final**, con su ADR, cuando A y B hayan enseñado cuánto se mueve el número.
