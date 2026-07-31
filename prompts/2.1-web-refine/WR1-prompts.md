# Prompts WR1 — Preparación

> 2 prompts secuenciales. Requiere W4 cerrado. Lee antes el [README de la fase](README.md): la
> rúbrica y el acceso a Figma viven ahí.
>
> **WR1.1 bloquea WR2.** No se audita el aspecto de un catálogo cuya extensión no está verificada.

---

## Prompt WR1.1 — Censo de cobertura contra el inventario

> Existe porque al cerrar W4 aparecieron **cuatro filas del inventario sin implementar** que dos
> cierres consecutivos habían dado por hechas —`Countdown`, `ScrollProgress`, `Breadcrumbs` y
> `useMediaQuery`—. La causa fue heredar la afirmación del cierre anterior en vez de reverificarla.

```
Actúa como auditor en C:\Users\Skr13\Documents\GitHub\Nebula. NO toques código: esto es un censo.

CONTEXTO: docs\w4-closure.md §Cobertura documenta los cuatro huecos que la primera pasada no vio y
la fila que sigue abierta (`Header (screen/TopBar)`). Tu trabajo es reverificar TODO desde cero,
no confiar en ese documento.

MISIÓN

1. Extrae TODAS las filas de docs\00-inventory.md §1 con `Plat` W o WN y destino `core`.
   Las filas que nombran varios componentes en una celda —"BarChart, LineChart, AreaChart,
   PieChart/Donut", "Conditional / Valid / Omit"— cuentan como un componente por nombre.

2. Cruza cada nombre contra, en este orden:
   - los directorios de packages\web\src\components
   - el barrel packages\web\src\index.ts
   - los siete subpaths (src\command, charts, datagrid, dnd, carousel, media, editor)
   - los barrels de packages\hooks y packages\icons
   - packages\web\src\provider (ColorSchemeScript, NebulaProvider)

3. Clasifica cada fila SIN rastro en uno de estos tres casos, y dilo explícitamente:
   a. HUECO REAL — hay que construirlo.
   b. NOMBRE DISTINTO — existe con otro nombre. Ejemplo confirmado: la fila `ThemeProvider` es
      `NebulaProvider`. Anota la fila del inventario para que la próxima auditoría no tropiece.
   c. EXCEPCIÓN — no aplica a web. Tiene que quedar ESCRITA como excepción en el inventario, no
      simplemente ausente. Ejemplo pendiente: `Header (screen/TopBar)`.

4. Verifica el sentido contrario: componentes en packages\web\src\components SIN fila en el
   inventario. Si los hay, o falta la fila o sobra el componente.

5. Verifica que cada componente tiene lo que la plantilla exige: entrada en el barrel o en un
   subpath, entrada en .size-limit.js, y al menos una story. Un componente exportado sin presupuesto
   ni lámina es un hueco de otra clase.

REGLAS
- NO te fíes de w4-closure.md ni de ningún cierre: reverifica contra el código.
- Un grep de subcadena da falsos positivos: `Card` casa con `CardComplex`, `Text` con `TextInput`.
  Cruza por nombre exacto de directorio o de export.
- No inventes excepciones: si una fila no está y no sabes por qué, es un hueco hasta que el
  propietario diga lo contrario.

ENTREGABLE
docs\reviews\coverage-census-<fecha>.md con cinco listas y su recuento:
  1. Huecos reales (bloquean WR2 para su familia)
  2. Renombrados (con la fila del inventario anotada)
  3. Excepciones que necesitan aprobación del propietario
  4. Huérfanos (código sin fila)
  5. Incompletos (sin story, sin budget o sin export)

CHECKPOINT: si hay huecos reales o excepciones sin aprobar, PARA y preséntalos. Construirlos o
aprobarlos es condición para abrir WR2.
```

---

## Prompt WR1.2 — Baseline de diseño ✅ HECHO (2026-07-31)

> **Ya ejecutado.** El propietario exportó 93 hojas de Polaris a `.figma/` (local, no versionado) y
> se construyó el instrumento de medida. Resultado en
> [`docs/reviews/figma-baseline/README.md`](../../docs/reviews/figma-baseline/README.md).
>
> Lo entregado:
>
> - **Escala verificada 1:1** contra dos anclas que julio sí midió por API.
> - `docs/reviews/figma-baseline/measurements.json` — geometría de las 93 hojas.
> - `docs/reviews/figma-baseline/type-scale.json` — tabla de Geist para deducir tamaños de fuente
>   sin estimar.
> - `tools/figma-measure/` — el instrumento, re-ejecutable.
>
> **No hizo falta la API**, que sigue en 429 hasta ~2026-08-02.

### WR1.2b — Lo que solo la API puede dar (tras el 2 de agosto)

```
Actúa como diseñador de sistemas en C:\Users\Skr13\Documents\GitHub\Nebula.

El baseline de imágenes ya está (docs\reviews\figma-baseline\README.md). Este prompt cubre SOLO lo
que una imagen no puede dar, listado en su §7:

  1. line-height — no deja tinta.
  2. Si el diseño tiene una escala NOMBRADA de espaciado y tipografía, o son valores sueltos.
  3. Estados que las hojas exportadas no dibujan.

ACCESO
  fileKey: SYZgKuK5o70lmfxVNljxww
  nodo raíz: 6:2252

MISIÓN
1. UNA llamada de profundidad 1 para comprobar la cuota. Si sigue en 429, reporta la fecha de
   reintento y PARA.
2. Prioridad absoluta: VARIABLES Y ESTILOS del archivo. Resuelve los puntos 2 y 3 de una vez y es
   lo que más rinde por llamada. Si el propietario los exporta a JSON desde Dev Mode, este paso se
   salta entero y no consume cuota.
3. Después, line-heights SOLO de los componentes que las auditorías de WR2 hayan marcado como NO
   MEDIDO. No de todos.
4. Guarda cada respuesta en docs\reviews\figma-baseline\<nodo>.json y actualiza su README.

REGLA: no repitas lo que las imágenes ya dieron. La cuota es el recurso escaso, no el tiempo.
```
