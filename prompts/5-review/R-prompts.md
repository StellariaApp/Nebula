# Prompts R — Gate de migración y planes por app

> 2 prompts secuenciales. Requiere N4 cerrado (N5 puede correr en paralelo — las migraciones solo necesitan los cores). Este es el puente hacia la ejecución de las migraciones (fuera del roadmap de la librería).

---

## Prompt R.1 — Re-verificación de cobertura + plan fonicredito

```
Actúa como arquitecto de migración en C:\Users\Skr13\Documents\GitHub\Nebula.
Cores web y native publicados (W5/N4).

LEE ANTES: docs\04-migration-map.md §5 (estrategias acordadas: codemod directo, C3-Q1/Q2),
docs\00-inventory.md §4/§5 (matriz de disposición), docs\05-roadmap.md R.

MISIÓN:
1. **Re-verificación de la matriz** (riesgo #8: las apps evolucionaron durante la construcción):
   re-`ls` de C:\Users\Skr13\Documents\GitHub\fonicredito-app\src\services\shared\components y de
   C:\Users\Skr13\Documents\GitHub\tfv-frontend\packages\components; diff contra las tablas §4/§5 de
   00-inventory (componentes nuevos/cambiados/borrados); actualizar la matriz y reportar el delta al
   propietario ANTES de seguir.
2. Verificar el gate "lista para migrar" de 04 §5.3 para fonicredito: 100% de sus canónicos
   implementados+testeados, tema `fonicredito` validado AA (de TC.3), playground mostrando todo,
   budgets verdes. Cualquier hueco → lista de trabajo previa.
3. **Plan de migración fonicredito** (doc nuevo docs\migrations\fonicredito-plan.md): orden de
   pantallas, tabla de renombres definitiva (04 §5.1 como base), qué toca el codemod y qué se
   reconstruye a mano ([B]/[I] de la matriz), plan de rollback, criterios de aceptación por pantalla.
4. **Codemod** (jscodeshift) escrito y probado EN SECO sobre una copia del repo de fonicredito:
   reporte de qué % transforma limpio y qué requiere intervención manual.

RESTRICCIONES: NO modifiques el repo real de fonicredito. Política de preguntas del propietario.

ACEPTACIÓN: matriz re-verificada; plan + codemod en seco con métricas.
REPORTE: delta de la matriz + veredicto del gate + % de automatización del codemod.
```

## Prompt R.2 — Plan tfv + cierre del roadmap

```
Actúa como arquitecto de migración en C:\Users\Skr13\Documents\GitHub\Nebula. R.1 cerrado.

LEE ANTES: docs\04-migration-map.md §5.2 (migración total Mantine→Nebula, C3-Q2),
docs\api\tfv-components.md (naming traps documentados: Tooltip≡Menu, InputSwitch, Conditional binario),
docs\migrations\fonicredito-plan.md (formato de plan a replicar).

MISIÓN:
1. Verificar el gate "lista para migrar" para tfv (04 §5.3) con el tema `tfv-gold` de TC.3.
2. **Plan de migración tfv** (docs\migrations\tfv-plan.md): secuencia por grupos de rutas
   (auth → dashboard → sites públicos) en ventana única; codemod parcial para los mapeos mecánicos
   (imports, Flex/Grid/Paper/Badge/Button); reconstrucción manual mapeada (Card→CardComplex,
   Tooltip→Menu, Container→Section, los ~30 [B] sobre primitivas); registro de los SVG propios en
   nebula-icons; gate final `pnpm remove @mantine/*` + build verde; plan de rollback.
3. Codemod parcial probado en seco sobre copia de tfv (mismas métricas que R.1).
4. **CIERRE DEL ROADMAP**: docs\r-closure.md — resumen ejecutivo del estado completo de Nebula
   (paquetes publicados con versiones, cobertura contra la matriz, supuestos cerrados/abiertos) y
   recomendación de arranque de las migraciones para decisión del propietario.

RESTRICCIONES: NO modifiques el repo real de tfv.

ACEPTACIÓN: ambos planes completos con codemods en seco; cierre del roadmap escrito.
REPORTE: el resumen ejecutivo final + la decisión que queda en manos del propietario (cuándo y en qué
orden ejecutar las migraciones — R las deja listas, no las ejecuta).
```
