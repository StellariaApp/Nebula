# Prompt WR3 — Consolidación y plan de alineación

> 1 prompt. Requiere los ocho informes de WR2 en `docs/reviews/visual-audit/`.
> **No audita más componentes y no toca código.**

---

## Prompt WR3.1 — De ocho informes a un plan

```
Actúa como diseñador de sistemas en C:\Users\Skr13\Documents\GitHub\Nebula.
Las ocho auditorías de familia están en docs\reviews\visual-audit\. Este prompt consolida y
planifica: no audita componentes nuevos y no toca código.

LEE ANTES: los ocho informes completos, docs\06-visual-language.md y docs\02-theming.md §2.

MISIÓN

1. AGRUPAR POR CAUSA, NO POR COMPONENTE.
   Es la lección de docs\reviews\code-design-audit-2026-07-28: seis defectos reportados por el
   propietario eran TRES causas. Un plan por componente son 144 tareas; un plan por causa son las
   que de verdad hay.

   Para cada causa: enunciado, cuántos componentes toca, cuáles, y en qué temas se manifiesta.
   Una causa que aparece en varias familias es la señal más valiosa del informe: significa que el
   sistema tiene un hueco, no que un componente esté mal escrito.

2. REPARTIR EN TRES CUBOS. Cada causa va a uno y solo uno:

   a. CALIBRACIÓN — se arregla cambiando qué token usa un componente. Sin contrato nuevo.
      Es el cubo que se puede ejecutar sin preguntar.

   b. CONTRATO — el token correcto NO EXISTE en NebulaTheme. Cada una es un ADR y toca los cuatro
      temas, el schema de Zod, el Theme Creator y la paridad con native. Preséntalas TODAS JUNTAS
      al propietario: aprobar tres ampliaciones de contrato de una vez cuesta menos que tres
      checkpoints separados, y permite ver si en realidad son una.

   c. ESPECIFICACIÓN — docs\06 no lo dice. Sale de los hallazgos C. Se enmienda docs\06, con ADR
      si cambia algo ya escrito.

3. ORDENAR POR DEPENDENCIA, NO POR SEVERIDAD.
   Una causa de contrato que afecta a 20 componentes va ANTES que veinte calibraciones que la
   parchean. Di explícitamente qué bloquea a qué y por qué. Un plan ordenado por severidad hace
   trabajo que luego se tira.

4. ESTIMAR EL IMPACTO EN EL BASELINE DE ADR-037.
   Qué componentes cambian de aspecto por cada tramo, para que el screenshot diff se capture DESPUÉS
   del último y no haya que regenerarlo. Si algún tramo se pospone, di qué parte del baseline queda
   contaminada.

5. SEPARAR LO QUE NO SE VA A HACER.
   Un hallazgo C que el propietario no quiera incorporar es una decisión válida, pero tiene que
   quedar escrita como tal en vez de desaparecer del plan sin explicación.

ENTREGABLES

1. docs\reviews\visual-audit-<fecha>.md — el consolidado:
   - Tabla causa → nº de componentes → familias afectadas → cubo.
   - Recuento total de A/B/C por familia y global.
   - Las causas que cruzan varias familias, destacadas.
   - Lo NO medido, agregado de las ocho secciones: es la frontera de confianza del informe.

2. docs\reviews\visual-alignment-plan-<fecha>.md — el plan por tramos ejecutables, cada uno con:
   - Nombre y causa que resuelve.
   - Componentes que toca.
   - Criterio de aceptación verificable.
   - Gates (los cuatro de siempre) y si necesita ADR.
   - Qué tramo lo bloquea, si alguno.
   El formato es el de los prompts de fase: un bloque copiable por tramo, porque WR4 los ejecuta.

3. Una lista NUMERADA de las decisiones que BLOQUEAN el plan y necesitan al propietario.

CHECKPOINT OBLIGATORIO: no se ejecuta ni un tramo sin que el propietario apruebe el cubo de
CONTRATO. Ampliar NebulaTheme no es una decisión que esta auditoría pueda tomar sola: afecta a los
cuatro temas oficiales, al Theme Creator y a la paridad con native, que todavía no existe.
```
