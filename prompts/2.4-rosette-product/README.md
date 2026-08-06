# RP — La maqueta de Rosette

> Maquetar el producto entero en `Patterns/Rosette` del playground, con Nebula y el tema `rosette`.
> No es una demo de componentes: es la maqueta desde la que se va a construir el producto, así que
> las decisiones de estructura que se tomen aquí son las que se implementan después.

## Por qué existe este prompt

El primer intento (`Rosette.stories.tsx`, historia `Estudio`) **copió la estructura de ourdream.ai y
le puso mejoras de detalle** —agrupar el carril, mostrar el coste antes de generar, decir el estado
de cada resultado—. Todo eso está bien y se conserva, pero **no cuestionó el modelo**, que es donde
está la oportunidad real.

Las preguntas que quedaron sin responder son las que ordenan esta fase:

- ¿Cómo queda mejor el carril?
- ¿Cuál es el flujo de creación de un avatar, sabiendo que en Rosette **se pueden subir imágenes de
  referencia**?
- ¿Dónde veo todos mis avatares?
- ¿Cómo es la vista de un avatar? **¿Debería ser la de generar?**
- ¿Cómo ajusto o modifico un avatar ya creado?
- ¿Dónde añado assets, ubicaciones, atuendos, escenas?
- ¿Cómo exploro los avatares de la comunidad?
- ¿Cómo se ve un feed de vídeos estilo TikTok hecho por la comunidad?

## Prompt de arranque — pegar en una sesión limpia

```text
Actúa como diseñador de producto e ingeniero de UI en C:\Users\Skr13\Documents\GitHub\Nebula.

Fase RP — la maqueta de Rosette. El entregable es el grupo Patterns/Rosette del playground:
la maqueta completa del producto, con Nebula y el tema rosette, desde la que se va a
construir después.

EL ENCARGO, EN UNA FRASE
  No copiar ourdream.ai con mejores componentes. **Rediseñar el modelo** y demostrar por qué
  el nuestro es mejor, pantalla por pantalla.

ANTES DE TOCAR NADA, LEE EN ESTE ORDEN
  1. CLAUDE.md — guardrails y política de trabajo con el propietario.
  2. apps/playground-web/src/stories/Rosette.stories.tsx — el primer intento. Lo que
     conserva y lo que hay que tirar está abajo.
  3. apps/playground-web/src/stories/Dashboard.stories.tsx — el patrón de vista de panel ya
     validado: AppShell en carril, cabecera pegajosa, subbarra, contenido.
  4. C:\Users\Skr13\Desktop\ourdream — las capturas de la referencia. OJO: contienen
     material explícito. Míralas para entender ESTRUCTURA y jerarquía; la maqueta usa
     marcadores de posición, nunca reproduce el contenido.
  5. C:\Users\Skr13\Documents\GitHub\Rosettee — la landing real de Rosette: identidad,
     tono de voz y lo que el producto promete. src/app/globals.css tiene su lenguaje visual.

LO QUE EL PRIMER INTENTO ACERTÓ Y SE CONSERVA
  - Una sola pantalla para componer, generar y contexto, en vez de tres páginas.
  - Preajustes que muestran su valor elegido en vez de cajas mudas.
  - Coste recalculado en vivo ANTES del botón, no dentro de él.
  - Cada resultado dice su estado —listo, generando con progreso, requiere plan—.
  - Carril agrupado con AppShell.Links en vez de nueve enlaces planos.

LO QUE HAY QUE REPLANTEAR DE CERO
Cada punto es una pregunta abierta del propietario. Para cada uno: propón DOS opciones con
su compromiso, recomienda una, y móntala.

  1. EL CARRIL
     Hoy es un menú de secciones heredado de ourdream. Preguntas: ¿navega por secciones o
     por avatares? ¿El avatar activo vive en el carril? ¿Qué pasa en móvil, donde ya
     tenemos barra inferior? Mira cómo lo resuelve el Sidenav de The Film Vault
     (C:\Users\Skr13\Documents\GitHub\tfv-frontend\packages\components\Sidenav).

  2. CREAR UN AVATAR
     ourdream lo hace en seis pasos —género, etnia, cara, cuerpo, info, preview— con
     regeneración al final. Rosette además ADMITE IMÁGENES DE REFERENCIA, que cambia el
     flujo entero: subir una foto puede saltarse tres pasos.
     Preguntas: ¿un asistente lineal o un lienzo donde se ajusta y se ve en vivo? ¿Dónde
     entra la referencia — al principio como atajo, o como una fuente más entre los
     rasgos? ¿Qué pasa si la referencia y los rasgos se contradicen?

  3. MIS AVATARES
     No existe en la maqueta. ¿Rejilla, lista o carril? ¿Qué se ve de cada uno sin abrirlo
     —última generación, número de piezas, si tiene chat activo—? ¿Se archivan? ¿Se
     duplican para variantes?

  4. LA VISTA DE UN AVATAR — la decisión más importante
     El propietario pregunta si **la vista del avatar debería ser la de generar**. Es la
     pregunta que define el producto:
       - Si son la misma: el avatar ES el estudio, y todo —galería, chat, memoria,
         ajustes— son pestañas suyas. El contexto nunca se pierde.
       - Si son distintas: la vista del avatar es su ficha y "generar" es una acción que
         abre el estudio con él cargado.
     Argumenta cuál, con el coste de cada una en navegación y en carga cognitiva, y monta
     la elegida.

  5. AJUSTAR UN AVATAR YA CREADO
     ¿Se edita destructivamente o se versiona? Un avatar con 200 generaciones no puede
     cambiar de cara sin invalidarlas. ¿Variantes? ¿Historial? Es una decisión de modelo
     de datos disfrazada de UI: decídela aquí.

  6. ASSETS, UBICACIONES, ATUENDOS, ESCENAS
     Hoy son cuatro cajas de preajuste sin sitio donde vivir. ¿Biblioteca global del
     usuario, o propiedad de cada avatar? ¿Se comparten entre avatares? ¿Se pueden subir
     propios? Diseña la biblioteca y cómo se elige desde el estudio sin salir de él.

  7. EXPLORAR LA COMUNIDAD
     ¿Qué se explora: avatares, generaciones o creadores? ¿Se puede clonar un avatar
     público como punto de partida? ¿Qué se ve de un avatar ajeno y qué no?

  8. EL FEED DE VÍDEO
     Estilo TikTok, vertical, a pantalla completa. Es el único sitio donde el carril
     estorba. Preguntas: ¿ocupa toda la ventana y sale del AppShell? ¿Cómo se vuelve?
     ¿Qué acciones lleva encima —seguir, guardar, "generar algo así"—? Ese último enlace
     entre consumir y crear es la oportunidad más grande del producto: quien ve algo que
     le gusta debería poder generarlo con un toque.

CÓMO TRABAJAR
  - Una historia por pantalla dentro de Patterns/Rosette. Nombres en español.
  - Marcadores de posición SIEMPRE: nada de imágenes de las capturas.
  - Tema rosette vía ProductStage, no colores sueltos.
  - Si una pantalla necesita que la story reconstruya un componente, ES UN HALLAZGO DE
    CATÁLOGO: anótalo y llévalo al propietario. Es lo que produjo ADR-086 y ADR-101.
  - Verifica cada pantalla renderizada en las tres anchuras —escritorio, encogido bajo
    laptop y barra bajo tablet— y pasa a11y. En este banco ya ha encontrado dos fallos
    reales.
  - Gates: pnpm --filter playground-web typecheck lint a11y. Si tocas la librería, además
    build, test, size y check:contrast.
  - Commits convencionales, una pantalla por commit.

EL CRITERIO PARA SABER SI ESTÁ BIEN
  Por cada pantalla, tienes que poder responder: **¿qué hace un usuario aquí que en
  ourdream le cuesta más pasos, más clics o más memoria?** Si la respuesta es "se ve
  mejor", no está terminada.
```

## Orden sugerido

El punto **4** primero, porque decide la forma de todo lo demás: si el avatar y el estudio son la
misma vista, `Mis avatares` es un selector y no una sección, y los assets cuelgan del avatar en vez
de ser una biblioteca. Después el **2** (crear, con referencia), luego **3** y **6**, y por último
**7** y **8**, que son el lado de consumo.

## Lo que esta fase NO hace

No implementa el producto ni toca la librería salvo que aparezca un hueco de catálogo. No decide
modelo de negocio ni precios. No reproduce contenido de las capturas.
