# hydration-measure — qué cuesta arrancar una ruta

Instrumento de **P0** del [plan de performance](../../docs/reviews/plan-performance-web-2026-08-14.md).
Los diez gates de `docs/03` §4 miden bytes y corrección; ninguno mide tiempo de CPU. Este mide eso.

```bash
pnpm --filter web build
pnpm --filter web exec next start -p 3100      # produccion, NO `next dev`
cd tools/hydration-measure && node measure.mjs
```

| Variable        | Por defecto             | Qué hace                                      |
| --------------- | ----------------------- | --------------------------------------------- |
| `NEBULA_URL`    | `http://127.0.0.1:3000` | Origen a medir                                |
| `NEBULA_ROUTES` | `/`                     | Rutas separadas por coma                      |
| `NEBULA_RUNS`   | `7`                     | Pasadas medidas                               |
| `NEBULA_WARMUP` | `3`                     | Pasadas descartadas antes de medir            |
| `NEBULA_CPU`    | `4`                     | Factor de throttling de CPU                   |
| `NEBULA_SETTLE` | `4000`                  | Espera tras `load` para recoger tareas largas |
| `NEBULA_CHROME` | —                       | Ruta a un Chrome concreto                     |
| `NEBULA_JSON`   | —                       | `1` para volcar JSON en vez de tabla          |

## Qué mide y por qué

`ScriptDuration`, `TaskDuration`, `RecalcStyleDuration` y `LayoutDuration` salen de
`Performance.getMetrics` de CDP: son **contadores de tiempo de CPU**, no de reloj de pared, y aguantan
mejor la contención de la máquina. TBT, tareas largas, FCP y LCP salen de `PerformanceObserver` en la
página, con la misma definición de TBT que usa Lighthouse (lo que cada tarea excede de 50 ms, contado
tras el FCP).

**Medir `next dev` no vale**: sirve HMR y devtools, y el número no se parece al de producción.

## Precisión — leer antes de sacar conclusiones

La columna `dispersion` es el rango intercuartílico sobre la mediana, y **está ahí para que no te
creas la mediana sin mirarla**.

Medido el 2026-08-14 sobre Windows 11 con el servidor de desarrollo del sitio corriendo en paralelo:
la dispersión intra-sesión se quedó entre el 12 % y el 34 %, y dos sesiones consecutivas de la misma
página sin cambiar una línea dieron **2.595 ms y 3.132 ms** de `ScriptDuration` (+21 %). El
calentamiento y los contadores de CPU lo mejoraron, pero no lo cerraron.

Consecuencia práctica: **en un host compartido este instrumento detecta cambios de ~30 % para
arriba, no menos.** Sirve para P5, que se espera grande; no sirve para verificar un 10 %. Cerrar esa
brecha pide un entorno fijo — el mismo «entorno único» que [ADR-037](../../docs/adr/ADR-037-gate-de-regresion-visual.md)
§3 lleva pidiendo para el gate visual.

Lo que sí aguanta entre sesiones son los **recuentos** (tareas largas: 13 y 13 en la portada) y
algunas **relaciones** entre rutas (CPU de layout portada/changelog: 3,51 y 3,40).
