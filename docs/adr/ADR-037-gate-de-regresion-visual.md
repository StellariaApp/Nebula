# ADR-037 — Gate de regresión visual por captura

- **Estado**: aceptada · 2026-07-28 (decisión del propietario en el checkpoint de auditoría de código y diseño)
- **Contexto**: `docs/06-visual-language.md` §8 fija que las cinco láminas `Foundations/Visual QA` son
  el baseline visual de W2 y que **automatizar diffs de captura es requisito antes del cierre de W2**,
  condicionado a decidir la herramienta por ADR para no introducir dependencias a ciegas. La review de
  convergencia del 2026-07-27 lo dejó como deuda abierta n.º 4.

  Hoy los gates automáticos son `axe` (338 stories, 0 violaciones), `check:contrast` (28 pares × 5
  temas) y `size-limit`. Los tres verifican propiedades: ninguno detecta que un componente se haya
  movido, encogido o desalineado. Las dos reviews previas encontraron ese tipo de defecto —la escalera
  de elevación plana en dark, el sangrado de `Card.Section`, el `letterSpacing` que no producía efecto—
  solo por inspección humana de capturas.

  El hecho que decide la herramienta: **`playwright` y `@storybook/test-runner` ya son devDependencies
  de `apps/playground-web`**, instalados para el gate `axe` junto con `axe-playwright`. Un gate de
  captura se construye sobre ellos sin añadir ninguna dependencia, lo que retira la única objeción que
  `docs/06` §8 planteaba.

## Decisión

1. **La herramienta es el `@storybook/test-runner` ya instalado**, con `toMatchSnapshot` de Playwright
   en un hook de post-visita. No se añade ninguna dependencia: queda fuera Chromatic —servicio de pago
   y datos fuera del repo— y queda fuera cualquier runner de screenshot adicional.

2. **Alcance**: las cinco láminas `Foundations/Visual QA` —Typography, Spacing, Surfaces, Actions,
   Forms— más las stories `Composition` y `AllThemes` de cada componente. **No** se capturan las
   matrices `Variants`/`Sizes`/`States` de todo el catálogo.

   El motivo es de señal contra ruido: las láminas y las composiciones son donde se manifiestan los
   defectos de sistema —ritmo, jerarquía, alineación entre componentes vecinos—, mientras que capturar
   las 338 stories produciría cientos de imágenes que cambian en bloque ante cualquier recalibración de
   token, y una revisión que nadie lee es un gate que no existe.

3. **Determinismo**. Como el renderizado de fuentes difiere entre sistemas:
   - el baseline se genera y se valida **en un único entorno**, el del CI, y las ejecuciones locales
     son informativas, no bloqueantes;
   - el viewport, el `deviceScaleFactor` y la escala de animación quedan fijados por configuración;
   - las capturas se toman con las animaciones deshabilitadas, reutilizando la vía de reduced-motion
     que ADR-034 unifica;
   - el umbral de comparación es un `maxDiffPixelRatio` pequeño pero no nulo, calibrado en el PR que
     introduzca el gate.

4. **El baseline se versiona en el repositorio**, en `apps/playground-web`. Actualizarlo es un acto
   explícito del PR que cambia el aspecto, con las imágenes visibles en la revisión. Un baseline
   regenerado sin cambio visual declarado es motivo de rechazo de la revisión.

5. **Orden de introducción**: el gate se implementa **después** de los tramos que cambian el aspecto —
   ADR-033 (tamaños de Badge y Pagination), ADR-034 (motion y foco de overlays) y ADR-036 (anillo de
   foco). Generar el baseline antes obligaría a regenerarlo tres veces y le restaría todo valor de
   señal.

   **ADR-031 es precondición dura**, no una más del orden. Mientras la tipografía declarada no se
   cargue de verdad, un baseline congelaría la fuente de sistema en cada imagen del repositorio y
   convertiría el gate en la garantía de que el catálogo _sigue_ renderizando con la fuente
   equivocada. Es el fallo que ADR-031 documenta, y capturarlo lo haría permanente.

6. **El gate entra en `docs/03-a11y-motion-performance.md` §4** como cuarto gate de CI, junto a axe,
   contraste y tamaño.

## Alternativas

- **Screenshot diff sobre todo el catálogo**: rechazada. Cobertura máxima, pero el ruido de revisión
  ante cualquier cambio de token convierte el gate en un trámite que se aprueba sin mirar.
- **Gate de métricas computadas** en lugar de imágenes —aserciones sobre alturas, pesos, tamaños de
  fuente y alineación: rechazada como sustituto, por no detectar problemas de composición; queda
  disponible como complemento barato si la inestabilidad de las capturas lo aconseja.
- **Chromatic**: rechazada. Resuelve el determinismo y la revisión visual mejor que ninguna otra
  opción, pero es una dependencia de servicio de pago con los baselines fuera del repositorio, y
  ADR-014 exige justificar toda incorporación externa cuando existe una vía con lo ya instalado.
- **Seguir con revisión humana de capturas**: rechazada. Es el estado actual y ya dejó pasar la
  escalera de elevación plana durante toda W2.

## Consecuencias

- **Sin dependencias nuevas.** El gate reutiliza `playwright` y `@storybook/test-runner`.
- **El repositorio gana imágenes binarias** de baseline. El volumen queda acotado por la regla 2 y se
  revisa si el crecimiento del catálogo lo hace incómodo.
- **CI se alarga** por la generación y comparación de capturas, después del build de Storybook que ya
  se ejecuta para el gate axe.
- **Los PR que cambien el aspecto incluyen sus imágenes actualizadas**, lo que convierte la revisión
  visual en parte del diff en lugar de un paso aparte.
- **`docs/06-visual-language.md` §8 deja de tener deuda abierta** y `docs/03` §4 se actualiza con el
  gate nuevo, ambos en el PR que lo implemente.
