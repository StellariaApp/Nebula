# Prompts WR4 — Ejecución de la alineación y cierre

> 1 prompt de arranque + **N tramos** que salen del plan de WR3.1, más el cierre.
> Requiere `docs/reviews/visual-alignment-plan-<fecha>.md` y la aprobación del propietario sobre el
> cubo de CONTRATO.
>
> Este archivo no puede listar los tramos: los define el plan. Lo que fija es **cómo se ejecuta cada
> uno**, que es lo que evita que la alineación se convierta en un rediseño sin control.

---

## Prompt WR4.0 — Verificación de arranque

```
Actúa como diseñador de sistemas en C:\Users\Skr13\Documents\GitHub\Nebula.

ANTES DE TOCAR NADA, verifica y DETENTE si algo falta:
1. Existen los ocho informes de docs\reviews\visual-audit\ y el consolidado.
2. Existe docs\reviews\visual-alignment-plan-<fecha>.md.
3. Las decisiones de CONTRATO tienen respuesta registrada del propietario (ADR escrito o nota en el
   plan). Si no la tienen, PARA y pídelas: son la raíz del orden de ejecución.
4. Los gates están en verde AHORA: pnpm turbo build typecheck lint test + check:contrast + size +
   a11y. Se arranca desde verde o no se sabe qué rompió qué.

Reporta el estado de los cuatro puntos y, si están, el orden de tramos que vas a seguir.
```

---

## Harness de tramo — se aplica a CADA tramo del plan

```
[Pega aquí el bloque del tramo, tal cual salió de docs\reviews\visual-alignment-plan-<fecha>.md]

REGLAS DE EJECUCIÓN (vinculantes para todos los tramos):

CERO VALORES CRUDOS
  Todo ajuste sale de un rol del tema o de un token. Si el color, la altura o el espaciado correcto
  no existe en el contrato, la salida es PARAR y proponer el rol —con ADR—, no escribir el valor.
  Un hex en un .css.ts es el fallo que esta fase existe para eliminar, no una solución rápida.

LOS CUATRO TEMAS O NINGUNO
  Un ajuste que arregla nebula-dark y rompe nebula-light no está hecho. `pnpm check:contrast` es
  condición NECESARIA Y NO SUFICIENTE: pasa el gate y aun así puede verse mal. Mira los cuatro.

UNA CAUSA POR COMMIT, NO UN COMPONENTE
  El plan está ordenado por causa. Si una causa toca 20 componentes, es un commit de 20 ficheros y
  no 20 commits. Así el historial explica el porqué, y revertir revierte la decisión entera.

LA ARQUITECTURA NO SE REABRE
  Style props (ADR-032), capa de motion (ADR-034), escalas de tamaño (ADR-033), anillo de foco
  (ADR-036) y el alcance de glass (ADR-059) están cerrados. Si un ajuste visual exige tocarlos, se
  reporta y se PARA.

SIN COMENTARIOS EN EL CÓDIGO (ADR-019)
  El porqué de un ajuste no evidente va al <Nombre>.md del módulo. Si el ajuste corrige algo que el
  .md afirmaba, corrige también el .md: un .md que miente es peor que no tenerlo.

GATES ANTES DE COMMITEAR, TODOS
  pnpm turbo build typecheck lint test + check:contrast + size + a11y.
  Los ajustes de espaciado y tipografía mueven el bundle poco pero lo mueven; los de superficie
  pueden romper contraste. No commitees en ámbar.

ANTES/DESPUÉS OBLIGATORIO
  Cada relación de color, densidad o escala que cambies se documenta con su valor anterior y el
  nuevo. Sin eso, la próxima auditoría no puede saber si un valor es una decisión o un descuido —
  que es la situación de partida de esta fase.

Trabaja en main. git add explícito por ruta.
```

---

## Prompt WR4.F — Cierre de la fase

```
Actúa como diseñador de sistemas en C:\Users\Skr13\Documents\GitHub\Nebula.
Todos los tramos del plan están ejecutados o explícitamente pospuestos.

MISIÓN

1. Verifica el gate completo de la fase (prompts\2.1-web-refine\README.md §Gate).

2. Escribe docs\wr-closure.md con:
   - Estado: qué se auditó, qué se corrigió, qué se pospuso y por qué.
   - Tabla por familia: componentes auditados, hallazgos A/B/C, cuántos corregidos.
   - Las causas resueltas, con su antes/después.
   - Los ADRs que salieron.
   - Lo NO medido: qué quedó fuera del volcado de Figma o del alcance, y qué haría falta para
     cerrarlo. Es la frontera de confianza y tiene que estar escrita.
   - Deuda declarada, en el formato de w3/w4-closure.

3. Actualiza el estado en CLAUDE.md y en docs\05-roadmap.md.

4. Declara explícitamente si el aspecto está ESTABLE para capturar el baseline de ADR-037. Si algún
   tramo quedó pospuesto y afecta al aspecto, di qué parte del baseline nacería contaminada.

5. Anota en el cierre qué de esta fase debe repetirse en native (N1–N3): las causas de CONTRATO
   valen para las dos plataformas, y descubrirlas dos veces sería el desperdicio más caro del
   proyecto.

REPORTE: el cierre + la lista de lo que W5 hereda (si algo del aspecto queda pendiente, W5 publica
con ello y hay que decirlo antes, no después).
```

---

## Por qué esta fase termina y no continúa

La calibración visual no tiene final natural: siempre se puede afinar más. Lo que la cierra es el
**gate de ADR-037**: en cuanto el baseline de screenshots está capturado sobre un estado aprobado,
cualquier deriva posterior deja de ser opinión y pasa a ser una regresión que el CI detecta.

Por eso el último acto de WR4 no es «ya está bien», sino **declarar el estado estable para el
baseline**. Es la única definición de terminado que no depende de a quién se le pregunte.
