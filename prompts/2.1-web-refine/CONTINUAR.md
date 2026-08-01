# Continuar WR en una sesión nueva

> Escrito al cierre de la sesión del **2026-08-01**. Pega el bloque de abajo tal cual.
>
> Sustituye al `WR4.0` genérico: es el mismo arranque, pero con el estado ya resuelto y con lo que
> esta fase aprendió por las malas.

---

## Prompt de arranque

```
Actúa como diseñador de sistemas en C:\Users\Skr13\Documents\GitHub\Nebula.

Retomas la fase WR (Web Refine), que está a medias. NO empieces por el código.

LEE PRIMERO, en este orden:
1. docs\wr-estado-2026-08-01.md — el traspaso. Trae qué está hecho, por dónde se sigue y, sobre
   todo, su §5 «frontera de confianza».
2. docs\reviews\visual-alignment-plan-2026-08-01.md — el plan por tramos. Los bloques son copiables.
3. docs\06-visual-language.md — la especificación, que es la vara.
4. prompts\2.1-web-refine\WR4-prompts.md §Harness de tramo — las reglas de ejecución.

VERIFICA Y PARA SI ALGO FALLA:
  pnpm turbo build typecheck lint test   (esperado 29/29)
  pnpm check:contrast                    (esperado 5 temas · 0 FAIL)
  pnpm --filter @stellaria/nebula-web size   (esperado 0 excedidas)
  pnpm turbo a11y --filter=playground-web    (esperado 82 suites / 557 tests · 0 violaciones)
Se arranca desde verde o no se sabe qué rompió qué.

ESTADO, para que no lo tengas que deducir:
  WR1 y WR2 cerrados · WR3 entregó consolidado y plan · de WR4 van T0 y T4 · T1 resuelto con
  ADR-063 y ADR-064 escritos y aceptados. Faltan T2, T3 y T5.
  El árbol tiene ~32 entradas SIN COMMITEAR de la sesión anterior. Es trabajo bueno y con gates en
  verde; no lo descartes.

TU TAREA: el tramo T2 — enmendar docs\06 con las seis causas de ESPECIFICACIÓN.
  Copia el bloque de T2 del plan y ejecútalo. No toca código: solo docs\06 y los ADRs que salgan.

  El criterio que decide si T2 está bien hecho: cada uno de los seis puntos queda con un NÚMERO o
  una REGLA OPERABLE, no con una descripción. «El cuerpo contrasta» no es especificación;
  «≥1.15 entre niveles adyacentes» sí. T3 no se puede ejecutar hasta que C4 tenga un número.

CUATRO COSAS QUE ESTA FASE APRENDIÓ POR LAS MALAS

1. NO HEREDES NINGUNA AFIRMACIÓN DE CIERRE. Es la lección que motivó WR1.1: dos cierres seguidos
   dieron por hecha una cobertura que no existía. Si un documento dice «verificado», reverifícalo
   contra el código antes de apoyarte en ello. Incluye los documentos de la sesión anterior.

2. LA AUDITORÍA CUBRIÓ MEDIA FASE DE SU PROPIO MÉTODO. Nadie MIRÓ el catálogo —las ocho familias
   midieron el render con getComputedStyle— y no se abrió Figma, así que hay CERO hallazgos C y
   ~65 de 145 componentes sin medida. Está en §5 del traspaso. No trates WR2 como exhaustiva.

3. HAY INSTRUMENTO, Y TIENE TRAMPAS. tools\render-measure\ mide el catálogo renderizado por tema.
   Su README documenta las tres que ya costaron un falso positivo:
     - medir background-color sin mirar background-image (los temas con gradiente engañan);
     - medir el nodo equivocado en un compound;
     - backdrop-filter y blur NO son medibles en headless.
   Cuatro falsos positivos se descartaron así en la sesión anterior. Verifica antes de reportar.

4. CERO VALORES CRUDOS. Si el token correcto no existe, la salida es PARAR y proponer el rol con
   ADR, no escribir el número. Es el fallo que esta fase existe para eliminar.

DECISIONES ABIERTAS QUE NECESITAN AL PROPIETARIO (§4 del traspaso)
  Agrúpalas en UN checkpoint, no las gotees. Las que bloquean:
  - C4: ¿cuánto separa un nivel de elevación del siguiente? Sin número, T3 no arranca.
  - C5: ¿gana docs\06 §5 o gana el código en la escalera de sombras?
  Las que no bloquean pero conviene cerrar en el mismo lote: C10 (¿la prosa puede tener escala
  propia?), C8 (¿un control puede no tener altura fija?), C3 (¿Rating pasa a control?), y si se
  renombran los ocho informes, que llevan fecha 2026-07-31 y se ejecutaron el 01.

DESPUÉS DE T2: T3 (calibrar superficies y bordes) y T5 (ritmos, labels y Kanban), más implementar
ADR-063 y ADR-064. El baseline de ADR-037 se captura DESPUÉS de T3 y T5, nunca antes: T3 toca once
componentes de tres familias.
```

---

## Si en vez de seguir el plan quieres cerrar el hueco del método

La alternativa legítima —y la que más valor añade si hay tiempo— es **ejecutar lo que WR2 no hizo**
antes de seguir alineando:

```
Actúa como diseñador de sistemas en C:\Users\Skr13\Documents\GitHub\Nebula.

Lee docs\wr-estado-2026-08-01.md §5 y prompts\2.1-web-refine\README.md §Rúbrica.

WR2 ejecutó los pasos 2 y 3 de su método (MIDE y CONTRASTA) y NO ejecutó el 1 (MIRA) ni el 4
(Figma). Tu tarea es cerrar uno de los dos huecos, no seguir con el plan de alineación.

OPCIÓN A — el paso 1, MIRAR. Arranca el playground y recorre las familias con peor cobertura de
render —overlays 3/15, datos 5/32, fechas 2/13— en los cuatro temas. Busca lo que un
getComputedStyle no delata: ritmo, alineación óptica, si una composición se lee. Los hallazgos van
al informe de su familia, no a uno nuevo.

OPCIÓN B — el paso 4, Figma. La cuota de la API volvía el ~2026-08-02, así que puede estar
disponible. Sigue prompts\2.1-web-refine\WR1-prompts.md §WR1.2b. De aquí salen los hallazgos C,
que hoy son cero en las ocho familias.

En los dos casos: actualiza el §6 «No medido» del informe de la familia que toques, y el §5 del
traspaso. La frontera de confianza tiene que moverse con el trabajo, no quedarse escrita como
estaba.
```
