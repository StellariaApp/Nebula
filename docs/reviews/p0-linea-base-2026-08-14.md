# P0 — Línea base de performance

> **Fecha**: 2026-08-14 · **Fase**: P0 del [plan de performance](plan-performance-web-2026-08-14.md)
> **Build medido**: `apps/web/.next` del 16:29 · **Servido con** `next start` en `127.0.0.1:3100`
> **Host**: Windows 11, con el servidor de desarrollo del sitio corriendo en paralelo.

## 1. Bytes por ruta — el gate corregido

`tools/route-budget` excluía mal y comprimía distinto a producción. Corregido, la portada mide:

| Métrica          | Antes      | Después        | Por qué cambia                                                                      |
| ---------------- | ---------- | -------------- | ----------------------------------------------------------------------------------- |
| JS sin comprimir | 1.196,5 kB | **1.086,9 kB** | Fuera el chunk `noModule` de core-js: 110,0 kB que un navegador con módulos no pide |
| JS brotli        | 333,2 kB   | **295,9 kB**   | ídem                                                                                |
| HTML brotli      | 61,2 kB    | 61,2 kB        | sin cambio                                                                          |

Y ahora el gate dice además **lo que producción sirve hoy**, que no es brotli:

| Ruta            | JS gzip  | HTML gzip | HTML brotli | Desperdicio en el documento |
| --------------- | -------- | --------- | ----------- | --------------------------- |
| Portada         | 315,3 kB | 116,8 kB  | 61,2 kB     | **55,6 kB**                 |
| Fichas          | 303,8 kB | 117,5 kB  | 65,8 kB     | 51,7 kB                     |
| Páginas sueltas | 301,1 kB | 99,8 kB   | 52,6 kB     | 47,2 kB                     |

Los topes de `route-budget.json` se recalibraron a la medida corregida con la regla de holgura de WN
(`max(medido × 1,05, medido + 1 kB)`): la portada baja de 1.396,75 a **1.141,5 kB** de tope, y todos
los grupos quedan con 4,8 % de holgura en lugar de entre el 4,7 % y el 22 %.

## 2. Tiempo de CPU — el instrumento nuevo

`tools/hydration-measure`, 7 pasadas + 3 de calentamiento, CPU ×4, móvil 412×915.

| Métrica           | Portada `/`      | `/changelog`     | Relación  |
| ----------------- | ---------------- | ---------------- | --------- |
| CPU script        | 2.595 / 3.132 ms | 1.320 / 1.264 ms | **~2×**   |
| CPU tareas        | 4.722 / 5.678 ms | 2.983 / 2.869 ms | ~1,8×     |
| CPU layout        | 719 / 765 ms     | 205 / 225 ms     | **~3,5×** |
| CPU recalc estilo | 280 / 332 ms     | 155 / 155 ms     | ~2×       |
| TBT               | 2.181 / 2.706 ms | 751 / 686 ms     | ~3×       |
| Tareas largas (n) | **13 / 13**      | 10 / 9           | ~1,4×     |
| FCP               | 760 / 900 ms     | 724 / 732 ms     | —         |
| LCP               | 760 / 900 ms     | 3.416 / 3.248 ms | —         |

Dos valores por celda: **dos sesiones consecutivas sin tocar una línea de código.**

## 3. Lo que esta línea base sí sostiene

- **La portada cuesta el doble que una página de texto en CPU de script** (1,97× y 2,48× en las dos
  sesiones) y 3,5× en layout. Concuerda con los bytes: `/changelog` sirve el 95 % del JS de la portada,
  así que la diferencia es lo que la portada hidrata de más, no lo que descarga de más.
- **13 tareas largas en la portada**, idéntico en las dos sesiones. Los recuentos son lo más estable
  que da el instrumento.
- **`/changelog` tiene un LCP de ~3,3 s con un FCP de ~0,73 s.** Es la peor relación de las dos rutas
  y no estaba en el diagnóstico inicial, que solo miró la portada. Queda anotado para su fase.

## 4. Lo que NO sostiene — y el gate de P0 que no pasa

El plan pedía que dos pasadas consecutivas cayeran dentro del **±5 %**. No lo hacen: la dispersión
intra-sesión se quedó entre el 12 % y el 34 %, y entre sesiones el `ScriptDuration` de la portada se
movió de 2.595 a 3.132 ms, un **+21 % sin cambiar nada**.

Se intentaron y no lo cerraron: descartar pasadas de calentamiento, y cambiar reloj de pared por
contadores de CPU de CDP.

**Consecuencia**: hoy el instrumento detecta cambios de **~30 % para arriba**. Sirve para P5, que se
espera grande. No sirve para verificar P2 ni P3, que son de menor calibre. La causa es el host
compartido, y cerrarlo pide un entorno fijo — el mismo «entorno único» que
[ADR-037](../adr/ADR-037-gate-de-regresion-visual.md) §3 lleva pidiendo para el gate visual. **Es una
decisión del propietario, no una verificación**, y por eso P0 queda abierta.

## Estado de P0

| Entregable               | Estado                                                         |
| ------------------------ | -------------------------------------------------------------- |
| Arreglar `route-budget`  | ✅ hecho y verificado — gate en verde, topes recalibrados      |
| Medidor de tiempo de CPU | ✅ construido y funcionando                                    |
| Línea base capturada     | ✅ este documento                                              |
| **Gate ±5 %**            | ❌ **no se cumple** — ~30 % de suelo de detección en este host |
