# Prompts DS3 — El catálogo: 158 páginas

> 2 prompts. Requiere DS2 cerrado **y WN cerrada**: WN todavía rompe API —ADR-103 fue _breaking_— y
> escribir 158 páginas contra una API en movimiento es trabajo que se tira. La parte generada
> sobrevive a los cambios; la prosa y las demos no.

---

## Prompt DS3.1 — La plantilla de página y el piloto

```text
Actúa como redactor técnico e ingeniero de UI en C:\Users\Skr13\Documents\GitHub\Nebula.

Fase DS, prompt 7. Se fija la anatomía de una página de componente y se valida contra ocho casos
difíciles. Lo que salga de aquí se repite 158 veces: una sección de más son 158 secciones de más.

LEE ANTES
  1. prompts/1.5-docs-site/README.md — principio 2: lo que se puede derivar no se escribe.
  2. La salida de los tres generadores de DS1.3 y el registro de DS1.2.
  3. docs/patterns/web-component-template.md — la plantilla del componente. Esta es su espejo.
  4. docs/adr/ADR-105 — la tabla que separa qué dice el JSDoc y qué dice el .md interno. La página
     pública es una TERCERA cosa: qué resuelve el componente para quien lo va a usar.

LA ANATOMÍA, en este orden y sin secciones opcionales inventadas
   1. Qué resuelve, en una frase. Escrita a mano. Es lo único que se lee en la búsqueda.
   2. Cuándo NO usarlo, con enlace a la alternativa del catálogo. Ahorra más tiempo que ninguna
      otra sección y ninguna librería la tiene.
   3. Demos, de packages/demos, la primera siendo el uso más común y no el más vistoso.
   4. Props propias — generado. Con las ranuras (*Props) en su propia subsección.
   5. Style props — enlace, no tabla. Las 128 no se repiten 158 veces.
   6. Accesibilidad — el contrato de docs/03 para ese componente: qué roles y atributos pone, qué
      teclas responde, qué tiene que aportar el consumidor.
   7. Tema — qué claves del NebulaTheme lo pintan. Generado. Es el argumento del proyecto aplicado
      a un componente concreto.
   8. Ficha técnica — presupuesto en kB, subpath, server-safe o cliente. Generado.
   9. Relacionados y decisiones: ADRs que lo explican, y el .md interno solo cuando aporte algo al
      consumidor. Los 88 .md existentes son notas de mantenimiento: la mayoría NO se enlaza.

EL PILOTO — ocho componentes elegidos por difíciles, no por fáciles
   AppShell        compound de dos montajes, con partes y ranuras
   Button          8 variantes, la página que más se va a mirar
   DataGrid        subpath propio, muchísima API
   Charts          subpath, familia entera en una página
   Modal           portal, foco, a11y, la trampa de ADR-030
   Select          familia de inputs con estados y validación
   Scroll          el caso raro de presupuesto y frontera RSC (ADR-069)
   Text            server-safe puro, primitivo del que dependen 155

   Si la plantilla aguanta estos ocho, aguanta los 158. Cada uno que la obligue a doblarse es un
   hallazgo: anótalo y decide si se cambia la plantilla o si es una excepción con nombre.

REGLAS DE ESCRITURA
   - Español e inglés. La prosa a mano es corta por diseño: 1 + 2 + los títulos de las demos.
   - Prohibido reescribir a mano lo que sale del generador. Si un dato generado está mal, se
     arregla el generador o el JSDoc; nunca la página.
   - Nada de "simplemente", "fácil" ni "solo tienes que". Si algo es difícil, se dice.

ACEPTACIÓN
  Las 8 páginas en los 2 idiomas; la plantilla documentada en el propio repo del sitio para que el
  barrido de DS3.2 la siga al pie de la letra; gates en verde.

REPORTE
  La plantilla final, los puntos donde los 8 la doblaron, y la estimación real de esfuerzo por
  componente para dimensionar el barrido.
```

---

## Prompt DS3.2 — El barrido, por familias y en paralelo

```text
Actúa como redactor técnico e ingeniero de UI en C:\Users\Skr13\Documents\GitHub\Nebula.

Fase DS, prompt 8. El barrido de los 150 componentes restantes. Se ejecuta POR LOTES, un lote por
sesión, con el mismo prompt cambiando el lote. Ocho lotes, como la auditoría de WR2.

LEE ANTES, EN CADA SESIÓN
  1. La plantilla que fijó DS3.1. Es de obligado cumplimiento: aquí no se rediseña nada.
  2. El registro de DS1.2 filtrado por tu familia.
  3. Los .md internos de los componentes de tu lote, si existen, para no contradecirlos.

TU LOTE ES: <familia>

   Los ocho lotes salen de la taxonomía del registro, equilibrados por número de componentes, no
   por nombre. Comprueba el reparto contra el registro antes de empezar; si tu lote tiene el doble
   que otro, dilo en vez de tragártelo.

QUÉ HACES POR CADA COMPONENTE
   1. Lee su .types.ts y su .tsx. La página se escribe con el componente leído, no adivinado.
   2. Regenera su JSON si hace falta y comprueba que la tabla de props cuadra con el tipo real.
   3. Escribe las secciones 1 y 2 de la plantilla — qué resuelve y cuándo no usarlo. Son las dos
      que valen y las dos que nadie puede generar.
   4. Demos: mueve a packages/demos las que ya existan en las stories y escribe las que falten
      hasta cubrir el uso común, la variante interesante y el caso con estado. Tres bastan; cinco
      en un componente complejo. Cada demo, el contrato de DS2.1.
   5. Traduce al inglés. Si no puedes con alguna, la marcas y sigue: la caída de idioma es visible
      por diseño y no bloquea.

LO QUE TIENES PROHIBIDO
   - Cambiar la librería. Si encuentras un defecto —una prop sin JSDoc, una ranura muerta, un
     nombre incoherente, un valor por defecto que no coincide con lo documentado— lo ANOTAS en el
     informe del lote. WN ya cerró; abrir cirugía aquí es reabrir una fase cerrada.
   - Inventar comportamiento. Si no sabes qué hace una prop, la ejecutas. Si sigue sin estar claro,
     va a la lista de huecos.
   - Adornar. Una página que dice menos y no miente es mejor que una que rellena.

ACEPTACIÓN DEL LOTE
  Todas las páginas de tu familia existen en los 2 idiomas, sus demos se ejecutan en los 4 temas, el
  gate de cobertura no reporta huecos en tu familia, gates del monorepo en verde.

REPORTE DEL LOTE
  Componentes cubiertos, demos nuevas frente a migradas, huecos de traducción, y la lista de
  defectos de la librería encontrados — que es el entregable colateral más valioso del barrido:
  ocho personas leyendo el catálogo entero desde fuera es una auditoría que no se ha hecho nunca.
```
