# Prompts DS4 — Gates, despliegue y cierre

> 2 prompts. Requiere DS3 cerrado. El sitio es público desde el primer deploy, así que los gates van
> **antes** que el dominio, no después.

---

## Prompt DS4.1 — Los gates del sitio

```text
Actúa como ingeniero de calidad en C:\Users\Skr13\Documents\GitHub\Nebula.

Fase DS, prompt 9. Un sitio de documentación de una librería de accesibilidad que no pasa sus
propios gates es un argumento en contra de la librería. Estos gates son la prueba pública de que
el catálogo cumple lo que promete.

LEE ANTES
  1. docs/03-a11y-motion-performance.md §4 — los gates de CI que ya existen y cómo están montados.
  2. skill quality-gates.
  3. apps/playground-web/package.json — el gate axe sobre Storybook ya montado con test-runner y
     axe-playwright. Reutiliza el mismo motor: dos motores de a11y distintos dan dos verdades.

LOS SEIS GATES DEL SITIO
   1. A11Y — axe sobre las páginas construidas, no sobre componentes aislados. Es distinto de lo
      que mide el playground: aquí hay navegación, saltos de encabezado, landmarks repetidos y
      contraste sobre fondos reales. Cero violaciones críticas o serias. Falla el build.
   2. COBERTURA DEL CATÁLOGO — todo componente del código tiene página. Ninguna fila sin rastro,
      el mismo criterio del censo de WR1. Falla el build.
   3. GENERADOS AL DÍA — `pnpm gen:docs` no produce diferencias. Si las produce, alguien editó a
      mano un archivo generado o cambió la API sin regenerar. Falla el build.
   4. ENLACES — internos y a docs/ADRs del repo. Un enlace roto en la doc pública es una promesa
      rota. Falla el build.
   5. I18N — cobertura por página. NO falla el build: reporta el porcentaje y la caída de idioma
      se ve en la página. Las 10 guías de DS2.3 son la excepción: esas sí fallan si les falta el
      inglés, porque son la puerta de entrada.
   6. PESO — presupuesto de primera carga por tipo de página (portada, guía, página de componente).
      Medido y con tope. Una librería que publica presupuestos de 14 kB por módulo no puede servir
      una portada de dos megas.

TAMBIÉN
   - reduced-motion: el sitio entero navegable con la preferencia activa, como exige docs/03.
   - Los 4 temas: las páginas se construyen y se ven en los cuatro, no solo en dark.
   - Teclado: recorrido completo de portada, buscador, menú y una página de componente.

ACEPTACIÓN
  Los 6 gates corriendo en CI, documentados en docs/03 §4 junto a los que ya existen, y el sitio
  pasándolos.

REPORTE
  Qué encontró cada gate la primera vez que corrió. Especialmente el 1 y el 6: lo que falle ahí es
  un defecto del catálogo enseñado en público.
```

---

## Prompt DS4.2 — Despliegue público y cierre de la fase

```text
Actúa como release engineer en C:\Users\Skr13\Documents\GitHub\Nebula.

Fase DS, prompt 10. El sitio sale al mundo.

ANTES DE NADA, VERIFICA QUE EL PROPIETARIO RESPONDIÓ. Si falta alguna, DETENTE y pídelas: son las
preguntas abiertas de prompts/1.5-docs-site/README.md.
   - Dominio y hosting.
   - Analítica: ninguna, o cuál.
   - Idioma del JSDoc público (pregunta 1) — si respondió inglés, esa migración es su propio
     trabajo y NO se hace en este prompt; se registra la enmienda a ADR-105 y se planifica.
   - Licencia: el supuesto #11 del roadmap sigue abierto hasta W5. Hasta entonces el sitio NO
     declara licencia. Comprueba que ninguna plantilla la haya colado por defecto.

DESPLIEGUE
   1. Build de producción reproducible desde el monorepo, con turbo, cacheable, sin pasos manuales.
   2. Dominio, HTTPS, redirección de la raíz por idioma, sitemap y robots permitiendo indexación.
   3. Previsualizaciones por rama para que un cambio de doc se pueda ver antes de fusionarlo.
   4. Un enlace visible a "editar esta página" que lleve al archivo real del repo.
   5. El aviso de estado de API en su sitio, y el changelog publicado y enlazado.

VERIFICACIÓN EXTERNA, OBLIGATORIA
   Sigue las instrucciones de tu propia guía de instalación en un proyecto Next 16 VIRGEN fuera del
   monorepo, al pie de la letra, sin usar nada que sepas del repo. Todo lo que te obligue a
   improvisar es un fallo de la guía y se arregla ANTES de anunciar nada.
   Nota: hasta W5 los paquetes no están en npm, así que esta verificación se hace con tarballs
   locales (pnpm pack) y la guía tiene que decir exactamente eso mientras dure.

CIERRE
   docs/ds-closure.md con: URL, gates verificados con su salida, cobertura por idioma y por familia,
   defectos de la librería que el barrido de DS3.2 encontró —agrupados y priorizados, que es
   material de entrada para W5— y las preguntas que siguen abiertas.
   Actualiza docs/05-roadmap.md, prompts/README.md, docs/01-architecture.md y docs/03 §4 en el mismo
   PR, como exige la política del proyecto.

ACEPTACIÓN (gate DS)
  Sitio público accesible en su dominio, los 6 gates en verde en CI, y la guía de instalación
  verificada por alguien que no conoce el repo — que en este prompt eres tú fingiendo no conocerlo,
  y tienes que fingirlo en serio.

REPORTE
  URL, medidas reales de peso y a11y, y lo que la fase deja pendiente para W5.
```
