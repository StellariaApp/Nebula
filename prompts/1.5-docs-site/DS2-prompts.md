# Prompts DS2 — Demos, identidad y guías

> 3 prompts secuenciales. Requiere DS1 cerrado. **No requiere WN**: nada de lo que hay aquí depende
> de que la API esté congelada, y las demos que se escriban ahora se arreglan una vez en vez de dos.

---

## Prompt DS2.1 — `packages/demos`: una demo vive una sola vez

```text
Actúa como ingeniero de UI en C:\Users\Skr13\Documents\GitHub\Nebula.

Fase DS, prompt 4. Nace el paquete del que van a tirar el playground y el sitio. Lo que se decida
aquí sobre la forma de un archivo de demo se repite ~500 veces, así que se decide bien.

LEE ANTES
  1. prompts/1.5-docs-site/README.md — principio 3.
  2. docs/01-architecture.md §8 — el grafo de deps, que es de una sola dirección.
  3. apps/playground-web/src/stories/Button.stories.tsx y ButtonActions.stories.tsx — el estado
     actual: 96 archivos, con fixtures de test (ThemeMatrix, MATRIX_A11Y) y assertions play().
  4. apps/playground-web/STORIES-TEMPLATE.md.
  5. skill monorepo-workspace antes de crear el paquete.

DÓNDE VIVE Y POR QUÉ
   packages/demos, privado, nunca publicado. Depende de web/tokens/themes/icons y de nada más.
   NO va en apps/: una app no puede depender de otra app — lo prohíbe el grafo de docs/01 §8 — y
   las dos apps necesitan las mismas demos. Escribe el ADR antes de crear la carpeta.

EL CONTRATO DE UN ARCHIVO DE DEMO
   Un archivo, una demo, export default de un componente sin props. Y estas cinco reglas:
     1. Se lee como código de consumidor: importa de "@stellaria/nebula-web", nunca por ruta interna.
     2. Cero fixtures de test, cero assertions, cero utilidades del playground. Lo que se ve es lo
        que alguien puede copiar y pegar en su proyecto y le funciona.
     3. Autónoma: sus datos de ejemplo van dentro del archivo.
     4. Debe verse bien en los 4 temas oficiales y en claro y oscuro. Si una demo solo funciona en
        dark, la demo está mal, no el tema.
     5. Textos de la demo en el idioma que se muestre: el rótulo visible sale de la prop del
        componente demo, no de un literal incrustado, para que el sitio lo pueda traducir.
   El metadato de cada demo —título, descripción, qué enseña— vive junto al archivo y es lo único
   que se traduce; el .tsx no se duplica por idioma NUNCA.

CÓMO SE MUESTRA EL CÓDIGO
   El sitio importa el mismo .tsx dos veces: como componente y como texto crudo. El código que se
   enseña es literalmente el que se ejecuta — no hay una segunda copia que pueda mentir.
   Añade botón de copiar (ButtonCopy ya existe en el catálogo) y evalúa un enlace "abrir en
   StackBlitz" con el proyecto prearmado. NO hay editor en vivo en v1: Sandpack pesa más que todo
   el resto del sitio junto, y se puede añadir después sin cambiar el contrato.

MIGRACIÓN — incremental y medida, no de golpe
   Migra en este prompt SOLO las familias de Button, TextInput y Modal: son las tres que ya tienen
   más ejemplos y las que más se van a mirar. Por cada una: extrae las demos a packages/demos y
   deja la story importando el archivo extraído, conservando sus play() donde existan.
   Después cuenta y reporta: cuántas demos salieron, cuánto encogieron las stories, y cuántas
   quedan en las 93 restantes. Ese número es la estimación real del barrido de DS3.

ACEPTACIÓN
  packages/demos construye y está en el grafo; las stories de las tres familias siguen pasando sus
  play() importando las demos; el sitio renderiza una demo con su código crudo al lado; gates en verde.

REPORTE
  El contrato final de un archivo de demo, el ADR, el conteo de la migración y la estimación del
  resto.
```

---

## Prompt DS2.2 — Landing e identidad de la web pública

```text
Actúa como diseñador de producto e ingeniero de UI en C:\Users\Skr13\Documents\GitHub\Nebula.

Fase DS, prompt 5. La portada. Es la única página del sitio cuyo trabajo no es explicar, sino
convencer en quince segundos a alguien que llega de un enlace.

LEE ANTES
  1. docs/adr/ADR-020 — la identidad visual: eje #3F37C9 → #9D4EDD, dark-first.
  2. docs/02-theming.md — los 4 temas oficiales y el runtime dual.
  3. prompts/1.5-docs-site/README.md — principio 5: el aviso de estado no se puede omitir.
  4. Mira mantine.dev y ui.shadcn.com como referencia de ESTRUCTURA, no de estética. Nebula no se
     parece a ninguno de los dos: es dark-first y su argumento es el tema, no la copia de código.

EL ARGUMENTO QUE LA PORTADA TIENE QUE DEMOSTRAR, NO ENUNCIAR
   "Dos productos radicalmente distintos, el mismo catálogo, cero forks."
   Eso NO se dice con un párrafo. Se enseña con un bloque en el que el visitante cambia el tema y
   ve la MISMA composición volverse otro producto delante de él: tipografía, radios, sombras,
   gradientes y variantes reconfigurados sin que cambie una línea de código. Es lo que ningún
   competidor puede enseñar, porque en los demás el tema son cuatro colores.
   Segundo argumento, subordinado: web y native con la misma API. Enséñalo cuando native exista;
   hasta entonces se anuncia, no se finge.

LO QUE LLEVA LA PORTADA
   - El bloque de tema en vivo de arriba, con los 4 temas oficiales.
   - Instalación en un bloque copiable, con la advertencia de que los paquetes aún no están en npm
     y la fecha o fase en que lo estarán. No mientas por omisión.
   - Números reales y verificables: 158 componentes, 7 subpaths, presupuestos en kB, WCAG 2.2 AA
     verificado por herramienta. Salen del registro generado, no escritos a mano — si mañana son
     160, la portada dice 160 sola.
   - Aviso permanente de estado: API en normalización hasta la v1. Visible, no en el pie.
   - Nada de licencia hasta que el propietario cierre el supuesto #11 del roadmap. Ni implícita.

IDENTIDAD
   Construida entera con Nebula. Dark por defecto. Los efectos premium se usan con los guardrails
   de la skill effects-guardrails: si un cristal o un gradiente compromete la legibilidad en el
   tema que apaga los materiales, se cae — la portada no es una excepción a las reglas del catálogo,
   es su escaparate.

TAMBIÉN EN ESTE PROMPT
   Metadatos sociales (OG por página, generadas), favicon, sitemap, robots. El sitio se publica en
   abierto desde el primer deploy, así que esto no es "para luego".

ACEPTACIÓN
  Portada en los dos idiomas, los 4 temas conmutan en vivo sin recarga, los números salen del
  registro, gates en verde y presupuesto de peso de la portada medido y anotado.

REPORTE
  Capturas en los 4 temas, peso real de la primera carga, y qué preguntas de identidad quedan para
  el propietario.
```

---

## Prompt DS2.3 — Las guías

```text
Actúa como redactor técnico e ingeniero en C:\Users\Skr13\Documents\GitHub\Nebula.

Fase DS, prompt 6. Las páginas que no son de un componente. Son las que deciden si alguien llega a
usar la librería o cierra la pestaña.

LEE ANTES
  1. docs/02-theming.md entero — es la fuente de la guía de temas.
  2. docs/03-a11y-motion-performance.md — a11y, motion y presupuestos.
  3. docs/01-architecture.md §4 (anatomía) y la nota de RSC.
  4. prompts/2-web/W5-prompts.md — las DOS obligaciones del consumidor que la librería no puede
     resolver por él. Tienen que estar en la guía de instalación, no escondidas en un README.
  5. Los ADRs que expliquen decisiones que el consumidor va a notar: 030 (portales), 031 (tipografía),
     038 (variantes y frontera cliente), 069, 098, 103, 104.

LAS GUÍAS, EN ORDEN DE LO QUE ALGUIEN NECESITA
   1. Instalación y primeros pasos, con receta por entorno: Next 16 (la del spike DS1.1, verificada)
      y Vite. Provider + tema + un Button funcionando.
   2. LAS DOS TRAMPAS, con su propia sección y en negrita, porque fallan en silencio:
      - la tipografía la carga la app, la librería no emite @font-face (ADR-031). Sin esto el
        consumidor recibe otra tipografía y no sabe por qué.
      - no envolver NebulaProvider en un ancestro con transform, filter o contain (ADR-030), o los
        overlays aparecen donde no deben.
   3. Temas: qué es NebulaTheme, los 4 oficiales, cómo se hace uno, cómo se carga uno serializado,
      qué se puede cambiar y qué no. Enlaza al Theme Creator cuando exista (ruta ya reservada).
   4. Style props: la página generada en DS1.3, con la prosa de entrada escrita a mano.
   5. Variantes y color: las 8 recetas y por qué lo que pinta cada una lo decide el tema.
   6. Accesibilidad: qué garantiza la librería, qué sigue siendo responsabilidad del consumidor, y
      que el AA se verifica con herramienta en CI, no de palabra.
   7. Motion: los tiers y reduced-motion obligatorio.
   8. Server components: qué es server-safe y qué es cliente por construcción, con la tabla derivada
      del generador 3. Es de las preguntas que más se hacen en Next y casi nadie la contesta bien.
   9. Subpaths y tamaño: los 7 subpaths, qué trae cada uno y su presupuesto real.
  10. Composición sin fork: props de ranura (ADR-098/104). Es el principio que ordena el proyecto y
      merece una página propia con ejemplos de ajustar un componente sin copiarlo.

CÓMO SE ESCRIBEN
   Español e inglés, los dos completos: estas diez no admiten caída de idioma, son la puerta de
   entrada. Cada afirmación sale de un doc o un ADR — enlázalo. Cada ejemplo es una demo real de
   packages/demos que se ejecuta, no un bloque de código muerto.
   No copies docs/ tal cual: docs/ está escrito para quien mantiene la librería y estas páginas son
   para quien la usa. Cambia el sujeto de cada frase.

ACEPTACIÓN
  Las 10 guías en los 2 idiomas, todos los ejemplos ejecutándose, enlaces verificados, gates en verde.

REPORTE
  Qué afirmaciones de docs/ no pudiste sostener al escribirlas para un consumidor — esas son huecos
  reales de la librería y hay que reportarlas, no maquillarlas.
```
