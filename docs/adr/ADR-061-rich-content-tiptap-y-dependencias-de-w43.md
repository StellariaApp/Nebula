# ADR-061 — Rich content: TipTap definitivo, y qué NO entra como dependencia

- **Estado**: aceptada · 2026-07-31 (checkpoint de apertura de W4.3)
- **Contexto**

  W4.3 tenía cuatro decisiones de dependencia abiertas: el editor (supuesto #6 del roadmap, «TipTap vs
  Lexical: provisional; ADR definitivo en W4»), el resaltador de `CodeHighlight` (que W2.2 aplazó
  explícitamente «por peso»), el motor de virtualización de `VirtualizedSelect` y la forma de integrar
  Pintura en `EditorImage` (C1-Q6).

  El paquete se publica en **W5**, así que la pregunta común a las cuatro no es «cuál es mejor hoy»
  sino «cuál puedo sostener en un paquete publicado».

- **Decisión**

  1. **TipTap es definitivo. El supuesto #6 queda cerrado.** `@tiptap/react` + `@tiptap/starter-kit` +
     `@tiptap/pm` ^3.29.2, aislados en el subpath `@stellaria/nebula-web/editor`.
  2. **`CodeHighlight` no lleva resaltador.** Acepta HTML ya resaltado (`html`) o texto plano
     (`code`), y aporta lo que aporta Nebula: superficie temada, numeración de líneas, scroll,
     botón de copia y pestañas por fichero. Vive en el **entry principal**, sin subpath, porque no
     tiene dependencia que aislar.
  3. **`VirtualizedSelect` virtualiza con ventana propia**, no con `@tanstack/react-virtual`. Sigue en
     el entry principal, con sus tres hermanos de §1.5.
  4. **Pintura es peer opcional y duck-typed** (ADR-014 regla 4, ejecuta C1-Q6): `EditorImage` no
     importa `@pqina/*` ni sus tipos; recibe el componente del consumidor y falla con un error legible
     si no llega.

- **Alternativas**

  - **Lexical** (Meta). Arquitectura más moderna y mejor rendimiento en documentos grandes. Se descarta
    por lo mismo que se descartó `@dnd-kit/react` en ADR-060: sigue en **0.49.0** después de años, sin
    compromiso de estabilidad de API, y W5 publica. Un `0.x` en las dependencias de un paquete
    publicado traslada su inestabilidad a nuestros consumidores. TipTap 3 es estable, está tipado de
    origen y su StarterKit ya trae lo que la toolbar necesita —negrita, cursiva, subrayado, tachado,
    código, encabezados, listas, cita, bloque de código, regla, enlace e historial— sin una sola
    extensión extra.
  - **Shiki 4 para `CodeHighlight`.** Era la opción con mejor fidelidad y la única que permitía derivar
    el tema del código de los tokens de Nebula. Se descarta por decisión del propietario: obliga a un
    subpath más, a una API asíncrona con estado de carga y a embarcar gramáticas en cliente, para un
    componente cuyo valor en un design system es la **superficie**, no el léxico. El patrón moderno
    —resaltar en servidor o en build y enviar HTML— cubre el caso real sin coste de cliente.
  - **highlight.js.** Síncrono y sencillo, pero su tema son hojas CSS propias: el bloque de código
    habría sido la única superficie del catálogo que ignora el tema, o habría obligado a remapear sus
    ~20 clases a mano en los cuatro temas.
  - **`@tanstack/react-virtual` en el entry principal** para `VirtualizedSelect`. Reutilizaba el motor
    ya auditado de `DataGrid`. Se descarta por el calendario: sacaría esa dependencia de su
    aislamiento en `/datagrid` y la convertiría en dependencia del paquete base justo en la auditoría
    de exports y peers de W5. La lista de un `Combobox` es uniforme y de una columna, así que la
    ventana es aritmética sobre `scrollTop` y una altura de fila fija. Coste asumido: **dos
    implementaciones de virtualización** en el paquete, una por clase de problema.
  - **Pintura como dependencia directa.** Imposible: licencia comercial, y ADR-014 regla 5 prohíbe
    dependencias no-OSS en el core.

- **Consecuencias**

  - `@stellaria/nebula-web` pasa a **siete subpaths**: `/command`, `/charts`, `/datagrid`, `/dnd`,
    `/carousel`, `/media`, `/editor`.
  - `CodeHighlight` **no resalta por sí solo**, y eso hay que decirlo en su `.md` y en el README de
    consumo de W5: su prop `html` espera markup ya resaltado y se inyecta con
    `dangerouslySetInnerHTML`, de modo que **sanearlo es responsabilidad del consumidor** cuando el
    origen no sea de confianza. Sin `html`, el componente pinta el `code` como texto plano y es
    seguro por construcción.
  - Los tipos del peer de Pintura se declaran estructuralmente en Nebula. Si Pintura cambia la forma
    de sus props, el wrapper compila igual y falla en runtime: es el precio de no poder depender de
    sus tipos, y queda anotado en el README del subpath junto al setup de licencia.
  - El supuesto **#6 del roadmap queda cerrado por completo**: su otra mitad —cmdk vs propio— ya la
    cerró ADR-057 en W3.4.
