# C3 — Alineación visual de un producto contra las recetas de Nebula

> Para una sesión limpia por producto, **nuevo o ya establecido**. Modelo recomendado: **Opus 5**
> (Fable 5.1 si va a juzgar capturas). Se parametriza con `<PRODUCTO>` y su ruta; no depende de
> Rosette ni de ningún otro producto: la norma que aplica está en **`docs/07-recetas-de-producto.md`**
> y en el `.md` de cada componente.
>
> **Diferencia con C1 y C2.** C1 lleva una landing a Nebula. C2 alinea un producto con Rosette
> pieza a pieza, leyendo el código de Rosette. **C3 no lee ningún producto: lee Nebula.** Es el
> que se pega cuando el producto no tiene a nadie al lado, y el que mantiene vivo `docs/07`: lo
> que un producto descubre vuelve a las recetas, no se queda en el producto.

---

## Cómo se mantiene la norma (léelo aunque no vayas a ejecutar el prompt)

`docs/07-recetas-de-producto.md` es un doc de consumidor: cambia cuando un producto encuentra una
receta mejor **y la demuestra**. El circuito es:

1. El producto aplica la receta tal cual está.
2. Si no le sirve, lo anota en su veredicto (`docs/reviews/alineacion-<producto>-<fecha>.md`) con la
   receta alternativa y **la razón medida** (una captura, un número, un bug reproducido).
3. El propietario decide: o la receta cambia en `docs/07` (y los demás productos la heredan en su
   próxima pasada de C3), o el producto es la excepción y lo escribe en su veredicto.
4. Si la receta pide algo que el catálogo no tiene, es un ADR de Nebula, no un componente del
   producto. Mientras tanto, se copia desde donde `docs/07` §16 diga, sin cambiarle la forma.

Un producto **nunca** edita `docs/07` por su cuenta; propone.

---

```text
Actúa como ingeniero de UI en <RUTA DE PRODUCTO> y, para leer, en
/Users/skr13/Documents/Github/Nebula.

Objetivo: que <PRODUCTO> componga sus pantallas con Nebula exactamente como dicen las recetas de
docs/07-recetas-de-producto.md. No hay otra referencia: si una pantalla de <PRODUCTO> se organiza
distinto que su receta, o la explicación es «porque el dominio lo exige» —y queda escrita— o es
deuda.

ELIGE EL CAMINO
  A · PRODUCTO NUEVO. Antes de esto corre prompts/7-arranque/N1-next-desde-cero.md (raíz, tema,
      primera pantalla). Después, aquí, saltas la Fase 1 y construyes por recetas desde la Fase 2.
  B · PRODUCTO ESTABLECIDO EN NEBULA. Fase 1 entera: auditoría contra la rúbrica, tabla, tramos.
  C · PRODUCTO FUERA DE NEBULA (HeroUI, Mantine, Tailwind a mano…). No es alineación: es migración.
      Primero prompts/6-consumidores/C1-landings-a-nebula.md sobre su landing; sólo cuando esa
      landing salga limpia se abre aquí la Fase 2. No alinees lo viejo: se sustituye.

LEE ANTES, EN ESTE ORDEN — y no leas nada más del propio producto hasta la Fase 1
  1. Nebula/CLAUDE.md — guardrails y política de trabajo con el propietario.
  2. Nebula/docs/07-recetas-de-producto.md — ENTERO. Es la rúbrica. Cada sección numerada es
     una fila de tu auditoría.
  3. Nebula/docs/06-visual-language.md §1, §5, §6 y §7 — jerarquía, superficies, presupuesto de
     efectos y las seis preguntas de una review visual.
  4. Nebula/docs/02-theming.md §2 y §4 + prompts/6-consumidores/C1-landings-a-nebula.md
     «Lo que ya está comprobado» y «De dónde se importa cada cosa». No lo repitas: aplícalo.
  5. Para CADA componente que vayas a usar, antes de escribir una línea:
       packages/web/src/components/<Nombre>/<Nombre>.md        → el porqué y lo que no hace
       packages/web/src/components/<Nombre>/<Nombre>.types.ts  → el contrato exacto
       apps/playground-web/src/stories/<Nombre>.stories.tsx    → «Composition» y «AllThemes»
     Si dudas de una prop, gana el .types.ts. Si dudas de un uso, gana el .md. Si dudas de cómo
     se ve, arranca el playground (pnpm --filter playground-web dev → :6006) y míralo.
  6. El sitio, Getting started: installation · styling · rsc · accessibility. Son las cuatro
     reglas del consumidor, y `styling` fija la única regla de precedencia: las style props ganan.

REGLAS QUE NO SE ROMPEN
  · No modificas Nebula para que <PRODUCTO> encaje, y no escribes CSS que una prop cubría. Lo
    que no sale con el catálogo y el tema es un HALLAZGO con el nombre del componente, la prop
    o el token que falta. Los huecos ya conocidos están en docs/07 §16: no los redescubras;
    copia desde donde dice, sin cambiar la forma, y cuenta cada copia en el veredicto.
  · No leas docs de diseño del producto que nombren un stack que no está en su package.json
    (HeroUI, Tailwind, Framer, Mantine). Anótalos para retirar.
  · Del tema es del producto sólo el color (docs/07 §3). Lo demás se copia del sistema; si no
    hay decisión cerrada sobre wash/lift/glass, usa los valores del §3 y anótalo.
  · Cada pantalla se mira. tsc verde y HTTP 200 no dicen que se vea bien.

═══════════════════════════════════════════════════════════════════════════════════════════
FASE 1 — LA AUDITORÍA (caminos B y C)
═══════════════════════════════════════════════════════════════════════════════════════════

Recorre <PRODUCTO> con docs/07 como rúbrica y escribe
docs/reviews/alineacion-<producto>-<fecha>.md con UNA tabla, una fila por receta:

  | § de docs/07 | receta | <PRODUCTO> hoy (fichero:línea) | delta | severidad | tramo |

  Severidad:  🔴 rompe la receta (otro componente, CSS a mano, estado que miente)
              🟠 la sigue con desvíos (radio, relleno, variante, copia)
              🟡 la sigue; pulido
  Tramo:      en qué fase de abajo se cierra.

  «Igual» también es una fila. Las secciones que no aplican (un producto sin panel no tiene §6
  ni §7) se marcan «no aplica» con la razón, no se omiten.

  Además, tres recuentos que no salen de la tabla:
    · Cuántos componentes de <PRODUCTO> reimplementan uno que Nebula ya tiene (grep del barrel
      packages/web/src/index.ts contra los nombres del producto).
    · Cuántos ficheros .css.ts hay y cuántas de sus reglas cubría una prop (display/p/gap/r/c/fz).
    · Cuántos hex, px de altura y transiciones a mano (grep: #[0-9a-f]{6}, height: \d, transition:).

CHECKPOINT 1 — enseña la tabla y los recuentos. Son decisiones del propietario, no tuyas:
    · Modal o ruta dedicada (docs/07 §8.1): se decide una vez para el producto.
    · Si el producto no tiene panel, si debe tenerlo.
    · Cualquier «porque el dominio lo exige».

═══════════════════════════════════════════════════════════════════════════════════════════
FASE 2 — RAÍZ Y TEMA (docs/07 §2, §3)
═══════════════════════════════════════════════════════════════════════════════════════════

Aplica §2 tal cual. Aplica §3: semilla, dos ficheros, dark-first, ThemeScript + NebulaProvider,
iconos como registro. Valida con pnpm check:contrast -- --theme y decide AA por escrito.

CHECKPOINT 2 — tema validado, en los dos esquemas, sobre la lámina Foundations/Visual QA del
playground con el tema del producto (ProductStage) o sobre una pantalla real.

═══════════════════════════════════════════════════════════════════════════════════════════
FASE 3 — ARMAZONES (docs/07 §4, §6)
═══════════════════════════════════════════════════════════════════════════════════════════

Landing: Main + Nav + dock + Footer del §4, sin listeners de scroll propios.
Panel (si lo hay): AppShell en carril del §6 con sus tres estados y sus esqueletos; cuenta las
entradas del carril contra la regla medida de §6.3.

Por cada pieza, tres preguntas y las tres se responden por escrito en el veredicto:
  1. ¿Es el componente canónico, con sus props, o hubo className? Si className, qué prop faltó.
  2. ¿Quedó de servidor? Si no, qué lo arrastró a cliente.
  3. ¿Se ve igual en dark y light, a 390 y a 1440?

CHECKPOINT 3 — armazones montados, mirados, sin contenido todavía si hace falta.

═══════════════════════════════════════════════════════════════════════════════════════════
FASE 4 — PANTALLAS (docs/07 §5, §7, §8, §9, §10, §11, §12, §13)
═══════════════════════════════════════════════════════════════════════════════════════════

Una pantalla por commit, en el orden de la tabla de la Fase 1 de más 🔴 a menos. Cada pantalla
cierra con el checklist de docs/07 §17 marcado en el mensaje del commit.

Las tres recetas donde más se falla, y por eso se revisan aparte:
  · La cabecera que se encoge (§7.3): absolute, no en flujo; sin sticky propio; números en
    metrics.ts con la suma; Transition para lo que desaparece. Si está en flujo, está mal
    aunque hoy no parpadee.
  · El modal (§8.1): Card de cristal dentro de content. Si se ve el panel de serie, está mal.
  · Los estados (§9): un fallo de la API pintado como «vacío» es 🔴 aunque el resto de la
    pantalla esté perfecta.

═══════════════════════════════════════════════════════════════════════════════════════════
FASE 5 — i18n Y COPIA (docs/07 §1.10, §13, §14)
═══════════════════════════════════════════════════════════════════════════════════════════

es/en tipados el uno del otro, GetDictionary / useDictionary, strings resueltos hacia cliente.
Pasa la copia de cada pantalla por la norma: español seco, minúscula tras dos puntos, sin
exclamaciones, y ninguna pantalla nombra a otra.

═══════════════════════════════════════════════════════════════════════════════════════════
FASE 6 — EL VEREDICTO
═══════════════════════════════════════════════════════════════════════════════════════════

Cierra docs/reviews/alineacion-<producto>-<fecha>.md con:
  · La tabla de la Fase 1 con la columna «después» rellena y qué severidades quedaron.
  · Los tres recuentos, antes y después.
  · Las copias desde docs/07 §16, sin cambios (suben a Nebula tal cual) y con cambios (cada
    cambio es un hallazgo).
  · Los hallazgos de catálogo, cada uno con componente/prop/token que habría hecho falta.
  · LAS PROPUESTAS A docs/07: recetas que no sirvieron, con la alternativa y la razón medida.
    Van aquí, no editadas en docs/07.
  · Lo que se retiró (docs viejos, listeners, <video controls>, hex, media queries).
  · Capturas a 390 / 768 / 1440, dark y light, de: landing entera, una pantalla con cabecera
    que se encoge (arriba y encogida), un modal, una lámina de error, la tira del móvil.
  · El peso: HTML de la landing antes y después en brotli a calidad 5 (lo que mide el gate de
    rutas de Nebula), y cuánto de eso es el tema. No lo maquilles.

GATES: pnpm typecheck && pnpm build en verde, y las capturas miradas. Un hallazgo no se
convierte en ADR por tu cuenta: se agrupan y los decide el propietario.
```

---

## Lo que este prompt NO hace

- No decide modales contra rutas, ni si un producto necesita panel, ni el juego común de
  `wash`/`lift`/`glass`: todo eso es del propietario y el prompt lo marca como checkpoint.
- No toca Nebula. Lo que le falta a Nebula sale como hallazgo y entra por ADR.
- No sustituye a la revisión visual con capturas (`Rosette/docs/reviews/00-prompt-revision-visual.md`
  es el modelo de ese otro prompt): éste alinea la **composición**; aquél juzga el **resultado**.
