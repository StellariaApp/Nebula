# Prompt RV — Revisión visual del catálogo web contra Figma

> Prompt suelto, fuera de la secuencia de fases. Nace del checkpoint del 2026-07-28, cuando el propietario revisó el playground tras cerrar T1–T6 de la auditoría de código y diseño y encontró seis defectos visuales que no son de arquitectura sino de calibración de color y densidad.
>
> **Requiere**: acceso al MCP de Figma configurado en la sesión, y T1–T6 cerrados (lo están).
>
> **No requiere** T7 ni T8. De hecho conviene que corra **antes** de T8: el baseline de screenshots de ADR-037 no debe capturarse sobre defectos conocidos.

---

## Prompt RV.1 — Calibración visual contra el diseño

```
Actúa como diseñador de sistemas trabajando en C:\Users\Skr13\Documents\GitHub\Nebula.
La arquitectura está cerrada y NO se toca: este trabajo es de calibración visual.

LEE ANTES, en este orden:
1. docs\06-visual-language.md — la especificación vinculante. Es la vara de medir.
2. docs\02-theming.md §2 — el contrato NebulaTheme y los roles de color.
3. docs\reviews\code-design-audit-2026-07-28.md §5.5 — los seis defectos reportados por el
   propietario y las tres causas sistémicas que el análisis previo ya identificó.
4. docs\adr\ADR-028 — la calibración de elevación y materiales dark, que es donde vive la
   relación entre superficies.

TIENES ACCESO AL MCP DE FIGMA. El diseño de referencia está incompleto: úsalo como fuente de
intención —relaciones de color, densidad, jerarquía—, no como pixel-perfect. Donde el Figma y
docs\06 discrepen, gana docs\06 y lo reportas; donde el Figma resuelva algo que docs\06 no
especifica, propones añadirlo a docs\06.

MISIÓN

1. **Levantar el estado real antes de tocar nada.** Arranca el playground
   (pnpm --filter=playground-web dev) y recorre las láminas Foundations/Visual QA y las
   composiciones de los componentes citados en §5.5, en los CUATRO temas oficiales. No trabajes
   de memoria ni desde el código: el defecto que motiva esto es que el código parecía correcto.

2. **Resolver las tres causas sistémicas antes que los síntomas.** §5.5 las deja identificadas y
   son la razón de que seis defectos se vean como seis y sean tres:

   a. `surface.sunken` como token de hover no funciona cuando el componente se apoya en el canvas
      —en dark son casi el mismo color—. Afecta a Accordion, Pagination y a todo lo que use ese
      patrón. La pregunta a responder es si falta un rol semántico de "hover sobre canvas" en el
      contrato o si estos componentes deben apoyarse en otro rol existente. Si la respuesta amplía
      NebulaTheme, es ADR.

   b. La relación entre `surface.overlay` y `surface.sunken` dentro de un mismo contenedor
      —cabecera y cuerpo de Modal y Drawer— se percibe invertida entre light y dark. Verifica en
      los cuatro temas si la escalera de ADR-028 se sostiene dentro de un overlay o si ahí hace
      falta otra relación.

   c. Checkbox, Radio y Switch declaran sus alturas en literales dentro del .tsx
      (SIZE_PX = 14/16/18/20/24 y SIZE.h = 16/18/22/26/30), así que a igual `size` no comparten
      altura y ningún tema puede recalibrarlas. El censo de ADR-033 solo miró los .css.ts y estos
      se le escaparon. Llevarlos al contrato es aplicar ADR-033, no una decisión nueva.

3. **Después, los síntomas** con el detalle de §5.5: el borde inferior de la cabecera del Modal,
   el hover del Accordion, la densidad de Segment en dark, el hover de Pagination y NavLink.

4. **NavLink merece su propio pase.** El propietario lo señala como el peor y es el componente con
   más estados simultáneos —activo, hover, disabled, con hijos, con descripción, con secciones—.
   Trátalo como rediseño de sus estados, no como ajuste de tokens.

REGLAS

- **Cero valores crudos.** Todo ajuste sale de un rol del tema o de un token. Si un color correcto
  no existe en el contrato, la salida es proponer el rol —con ADR— no escribir el hex.
- **Los dos temas o ninguno.** Un ajuste que arregla nebula-dark y rompe nebula-light no está
  hecho. `pnpm check:contrast` es condición necesaria y no suficiente: pasa el gate y aun así
  puede verse mal.
- **La arquitectura de T1–T6 no se reabre.** Style props, capa de motion, escalas de tamaño y
  anillo de foco están cerrados. Si un ajuste visual exige tocarlos, se reporta y se para.
- Sin comentarios en el código (ADR-019); el porqué va al <Nombre>.md del módulo.
- Un commit por causa resuelta, no por componente, con los gates en verde antes de commitear:
  pnpm turbo build typecheck lint test + check:contrast + size + a11y.
- Trabaja en main. git add explícito por ruta.

ENTREGABLE

- Los ajustes aplicados, con antes/después de cada relación de color que cambies.
- `docs\reviews\visual-calibration-<fecha>.md`: qué se corrigió, qué se decidió y qué queda.
- Los ADR que salgan, si el contrato necesita roles nuevos.
- Una lista explícita de lo que el Figma resuelve y docs\06 no dice, para incorporarlo.

CHECKPOINT OBLIGATORIO antes de tocar el contrato de tema: si la conclusión es que faltan roles
en NebulaTheme, para y preséntalo con opciones y recomendación. Ampliar el contrato afecta a los
cuatro temas, al schema de Zod, al Theme Creator y a la paridad con native.
```

---

## Por qué este prompt existe y no es un tramo de la auditoría

Los tramos T1–T6 arreglaron **sistemas**: maquinaria construida y no propagada. Sus gates —typecheck, tests, size, axe— verifican que la maquinaria esté bien cableada, y todos están en verde.

Lo que este prompt ataca es otra clase de defecto: **relaciones de color y densidad que son correctas por contrato y erróneas a la vista**. Ningún gate actual las detecta, porque `check:contrast` mide legibilidad, no acierto estético, y axe mide accesibilidad, no jerarquía. Es exactamente el argumento de ADR-037 —el gate de screenshot diff— y la razón de que su baseline deba generarse **después** de esta revisión y no antes.
