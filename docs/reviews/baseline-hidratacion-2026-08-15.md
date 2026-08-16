# Línea base de hidratación — primera captura

> **Fecha**: 2026-08-15 · **Instrumento**: [`tools/hydration-measure`](../../tools/hydration-measure/)
> **Entregable 3 de P0** del [plan de performance](plan-performance-web-2026-08-14.md), que hasta hoy
> no se había capturado.

## Cómo se obtuvo

```bash
pnpm --filter web build
pnpm --filter web exec next start -p 3100
NEBULA_URL=http://127.0.0.1:3100 NEBULA_ROUTES=/,/changelog NEBULA_RUNS=11 \
  node tools/hydration-measure/measure.mjs
```

11 pasadas medidas + 3 de calentamiento por ruta, throttling de CPU ×4, con la máquina en reposo.

**Entorno**: Windows 11 local, build de producción de Next 16.2.12. **No es el «entorno único»** que
piden ADR-037 §3 y ADR-149; hasta que lo sea, esta captura vale para comparar contra sí misma, no
como número absoluto.

**Estado del árbol**: incluye las nueve conversiones a componente de servidor del 2026-08-15
(catálogo en 50 de servidor / 108 de cliente).

## Portada `/`

| Métrica            | Mediana | Rango     | Dispersión |
| ------------------ | ------- | --------- | ---------- |
| CPU script         | 2093 ms | 1794–2658 | 28 %       |
| CPU tareas         | 5964 ms | 5018–6665 | **13 %**   |
| CPU recalc estilo  | 801 ms  | 568–925   | 16 %       |
| CPU layout         | 768 ms  | 681–1075  | 18 %       |
| TBT                | 2279 ms | 1759–2799 | 32 %       |
| tareas largas (ms) | 3487 ms | 2810–4115 | 23 %       |
| tareas largas (n)  | 15      | 12–18     | **13 %**   |
| FCP                | 652 ms  | 560–1016  | 23 %       |
| LCP                | 652 ms  | 560–1016  | 23 %       |
| CLS (×1000)        | 23      | 0–35      | 111 %      |
| load               | 1522 ms | 1227–2325 | 19 %       |

## `/changelog`

| Métrica            | Mediana | Rango     | Dispersión |
| ------------------ | ------- | --------- | ---------- |
| CPU script         | 1247 ms | 691–2796  | 31 %       |
| CPU tareas         | 3057 ms | 2302–5669 | 38 %       |
| CPU recalc estilo  | 187 ms  | 179–356   | 37 %       |
| CPU layout         | 337 ms  | 245–736   | 45 %       |
| TBT                | 722 ms  | 397–3087  | 46 %       |
| tareas largas (ms) | 1697 ms | 1287–4127 | 50 %       |
| tareas largas (n)  | 10      | 7–26      | **20 %**   |
| FCP                | 776 ms  | 692–1372  | 27 %       |
| LCP                | 3408 ms | 2828–5516 | 37 %       |
| CLS (×1000)        | 0       | 0–0       | 100 %      |
| load               | 1394 ms | 819–2083  | 28 %       |

## La dispersión intra-sesión NO es el error del instrumento

Esto se aprendió capturando, y es lo más útil de la primera toma. Se hicieron **tres** pasadas antes
de fijar la de arriba:

| Pasada                              | `/changelog` LCP | Portada `CPU script` |
| ----------------------------------- | ---------------- | -------------------- |
| 7 runs, con builds de la sesión     | 5208 ms          | 1879 ms              |
| 11 runs, en reposo, solo /changelog | 2976 ms          | —                    |
| 11 runs, en reposo, ambas rutas     | 3408 ms          | 2093 ms              |

`CPU script` de la portada dio **11 % de dispersión intra-sesión** en la primera pasada y aun así
cambió un **11 % de mediana entre sesiones** (1879 → 2093). La dispersión que imprime el medidor
describe el ruido *dentro* de una tanda; el error real entre tandas es mayor. Coincide con lo que su
README ya avisaba (2595 vs 3132 ms, +21 %).

**Consecuencia**: no dar por bueno un cambio por debajo del ~30 % aunque la dispersión parezca
pequeña, y **medir siempre con la máquina en reposo** — con builds en paralelo el número se dobla.

## Dos cosas que esto destapa y el plan no contemplaba

**El LCP de `/changelog` es ~5× el de la portada** — 3408 ms contra 652. El plan asume lo contrario:
usa que «`/changelog` es texto plano y sirve el 96 % del JS de la portada» para argumentar que el
margen está en el cromado común y no en la portada. En LCP no se comporta así.

Reproducido en las tres pasadas (5208 / 2976 / 3408), así que la dirección es firme aunque la
magnitud baile. La primera pasada lo infló a un factor de 7 por contención; el número bueno es ~5×.

**La portada tiene CLS medible**: 0.023 de mediana, idéntico en dos sesiones independientes, con
rango 0–35. Sigue dentro de «bueno» (<0.1), pero que la mediana se repita clavada mientras el rango
va de 0 a 0.035 dice que hay cargas que sí desplazan y otras que no. Es sospechoso de P2: `StarField`
y `ProductSurface` pasaron a montarse diferidos y pueden estar empujando el layout al entrar.

## El gate de P0 sigue sin cumplirse

Pide **dos pasadas consecutivas dentro del ±5 %**. Las dos de 11 runs sobre `/changelog` dieron 2976
y 3408 ms de LCP — un 14 % de diferencia. Esto queda como punto de partida, no como gate en verde, y
cerrarlo pide el entorno fijo de ADR-149.
