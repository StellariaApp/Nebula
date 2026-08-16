# Línea base de hidratación — primera captura

> **Fecha**: 2026-08-15 · **Instrumento**: [`tools/hydration-measure`](../../tools/hydration-measure/)
> **Entregable 3 de P0** del [plan de performance](plan-performance-web-2026-08-14.md), que hasta hoy
> no se había capturado.

## Cómo se obtuvo

```bash
pnpm --filter web build
pnpm --filter web exec next start -p 3100
NEBULA_URL=http://127.0.0.1:3100 NEBULA_ROUTES=/,/changelog node tools/hydration-measure/measure.mjs
```

7 pasadas medidas + 3 de calentamiento por ruta, throttling de CPU ×4.

**Entorno**: Windows 11 local, build de producción de Next 16.2.12, con el resto de la sesión de
trabajo en la misma máquina. **No es el «entorno único»** que piden ADR-037 §3 y ADR-149; hasta que
lo sea, esta captura vale para comparar contra sí misma, no como número absoluto.

**Estado del árbol**: incluye las nueve conversiones a componente de servidor del 2026-08-15
(catálogo en 50 de servidor / 108 de cliente).

## Portada `/`

| Métrica            | Mediana | Rango       | Dispersión |
| ------------------ | ------- | ----------- | ---------- |
| CPU script         | 1879 ms | 1391–2770   | **11 %**   |
| CPU tareas         | 5704 ms | 3733–7013   | 29 %       |
| CPU recalc estilo  | 839 ms  | 459–1166    | 50 %       |
| CPU layout         | 822 ms  | 535–951     | 17 %       |
| TBT                | 2077 ms | 1445–2310   | 22 %       |
| tareas largas (ms) | 3164 ms | 2652–3602   | **12 %**   |
| tareas largas (n)  | 14      | 12–17       | 21 %       |
| FCP                | 760 ms  | 504–876     | 23 %       |
| LCP                | 760 ms  | 504–876     | 23 %       |
| CLS (×1000)        | 23      | 0–34        | 92 %       |
| load               | 1634 ms | 1242–2985   | 24 %       |

## `/changelog`

| Métrica            | Mediana | Rango       | Dispersión |
| ------------------ | ------- | ----------- | ---------- |
| CPU script         | 2178 ms | 947–2426    | 44 %       |
| CPU tareas         | 5005 ms | 2263–5367   | 37 %       |
| CPU recalc estilo  | 247 ms  | 216–357     | 41 %       |
| CPU layout         | 449 ms  | 336–595     | 46 %       |
| TBT                | 1622 ms | 561–1994    | 62 %       |
| tareas largas (ms) | 3070 ms | 1490–3211   | 35 %       |
| tareas largas (n)  | 12      | 9–16        | 42 %       |
| FCP                | 1024 ms | 848–1180    | 30 %       |
| LCP                | 5208 ms | 3208–5672   | 37 %       |
| CLS (×1000)        | 0       | 0–0         | 100 %      |
| load               | 2189 ms | 831–2615    | 40 %       |

## De qué te puedes fiar

Solo dos columnas están lo bastante apretadas para comparar entre sesiones: **`CPU script` de la
portada (11 %)** y **`tareas largas (ms)` (12 %)**. Ésas son las que hay que mirar cuando entren
`Hero` y `Section`.

El resto es ruido de esta máquina. `CPU recalc estilo` al 50 % y `CLS` al 92 % no dicen nada todavía.

**El gate de P0 NO está cumplido**: pide dos pasadas consecutivas dentro del ±5 % y esto es una sola
captura con dispersiones de 11 % a 92 %. Queda como punto de partida, no como gate en verde.

## Dos cosas que esto destapa y el plan no contemplaba

**`/changelog` tiene el LCP peor, por un factor de 7.** 5208 ms contra 760 de la portada. El plan
asume lo contrario —«`/changelog` es texto plano y sirve el 96 % del JS de la portada»— y lo usa para
argumentar que el margen está en el cromado común. Con 37 % de dispersión no es veredicto, pero pide
una segunda pasada antes de seguir optimizando la portada.

**La portada tiene CLS medible y muy inestable**: 0.023 de mediana con 92 % de dispersión, entre 0 y
0.034. Sigue dentro de «bueno» (<0.1). Es sospechoso de P2: `StarField` y `ProductSurface` pasaron a
montarse diferidos y pueden estar empujando el layout al entrar.
