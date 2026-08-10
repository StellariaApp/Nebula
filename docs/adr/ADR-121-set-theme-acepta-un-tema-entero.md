# ADR-121 — `setTheme` acepta un tema entero

- **Estado**: aceptada · 2026-08-09 · **W5**
- **Cambia API pública**: sí, y **solo ensancha**: `setTheme` pasa de `(name: string)` a
  `(next: string | NebulaTheme)`. Toda llamada que hoy compila sigue compilando y sigue haciendo lo
  mismo.
- Lo destapó la portada del sitio: afirma que un producto entero se retiña cambiando el tema, y el
  provider no sabía hacerlo.

## Contexto

`docs/02` §4 dice cómo se usa un tema de tenant: «se pasa el `NebulaTheme` (ya validado por
`loadTheme`) como `defaultTheme` y se inyecta con `assignInlineVars` sobre el contract». Eso cubre
**arrancar** con un tema custom. No cubre **cambiar** a uno.

`setTheme` sólo admitía los nombres oficiales, y lanzaba con cualquier otra cosa:

```ts
if (!IsOfficialName(name)) throw new Error(`Tema desconocido: "${name}"…`);
```

Así que la única vía para pasar de `nebula` a `rosette` en caliente era remontar el provider con
`key`, que tira el estado del árbol entero y vuelve a disparar cada `Reveal`. Un conmutador de tema
que reinicia la página no es un conmutador de tema.

El agujero se ve en tres sitios a la vez:

1. **La portada** temaba una isla —un `NebulaProvider` anidado dentro de una banda— mientras el resto
   de la página no se movía. La prueba del argumento se contradecía a sí misma: si sólo cambia el
   recuadro, lo que se demuestra es que hay un recuadro aparte.
2. **El Theme Creator** (docs/02 §5) necesita exactamente esto para su preview en vivo. Iba a chocar
   con la misma pared en Etapa 3.
3. **Native ya lo tiene**: `updateTheme(name, themeJson)` de Unistyles admite temas dinámicos. La
   promesa de §4 —«`useTheme()` expone la misma API en ambas plataformas»— era falsa en web.

La maquinaria estaba entera desde ADR-117: `Resolve()` ya devuelve `style` con `assignInlineVars`
para un objeto, y el efecto de `applyTheme="root"` ya sabe poner y quitar esas vars en `<html>`. Sólo
el guardia de `setTheme` impedía llegar.

## Decisión

**`setTheme` acepta un nombre oficial o un `NebulaTheme` completo.**

```ts
setTheme: (next: string | NebulaTheme) => void;
```

- **Con un nombre**: idéntico a hoy. Se valida contra `themeClass`, se aplica la clase, se persiste el
  nombre. Un nombre desconocido sigue lanzando, con el mismo mensaje.
- **Con un objeto**: se aplica por vars inline sobre el contract, la ruta que `defaultTheme` ya usaba.
  No se valida con Zod aquí: el tipo lo garantiza en build y `LoadTheme` es la puerta de lo que llega
  de fuera. El provider no re-valida lo que el consumidor ya construyó tipado.

### El tema custom no se persiste; su scheme sí

Es la única decisión con filo. Un objeto no se puede rehidratar desde el `localStorage`: la clave
guarda un nombre, y el provider no tiene de dónde reconstruir `rosette` al recargar.

Guardar `theme.meta.name` sería mentir dos veces: al recargar el provider caería a `defaultTheme`
mientras el storage dice «rosette», y `ColorSchemeScript` no encontraría `c["rosette"]` en el mapa de
clases, así que también caería. Un estado guardado que nadie puede restaurar es peor que no guardarlo.

Así que se guarda **`theme.meta.scheme`**, que siempre es `"dark"` o `"light"` — es decir, siempre un
nombre oficial válido:

```ts
store?.setItem(storageKey, typeof next === "string" ? next : next.theme.meta.scheme);
```

Al recargar se recupera **el tema oficial del mismo scheme**. La preferencia que el visitante expresa
de verdad —claro u oscuro— sobrevive; la identidad de producto, que es una demo, no. Y
`ColorSchemeScript` pinta antes del primer frame porque lo que hay en la clave es un nombre que sí
conoce. Cero salto, cero mentira.

**Quien quiera persistir su tema custom lo persiste él**, que es el único que sabe reconstruirlo: la
app guarda su selector —un id de tenant, un nombre de producto— y monta con el objeto en
`defaultTheme`. El provider persiste lo que puede resolver; la app, lo que sólo ella puede.

## Lo que este ADR NO hace, a propósito

**No añade un registro de temas.** Se consideró un `themes` en el provider (`Record<string, NebulaTheme>`)
para que `setTheme("rosette")` funcionara por nombre y se persistiera. Es más API, obliga a declarar
por adelantado el conjunto cerrado de temas —justo lo que un Theme Creator no puede hacer— y no
resuelve nada que pasar el objeto no resuelva. Si algún día hace falta, se añade encima de esto.

**No toca el contrato de CSS vars.** La data no materializable como var —`variantMap`, `spring`,
`tier`, `glass.enabled`, `gradients`, `palettes`— se sigue leyendo del objeto `theme` por contexto,
como dice §4. Cambiar el objeto cambia las dos mitades a la vez, que es justo lo que hace que
`motion.tier` y `effects.glass.enabled` funcionen como interruptores en caliente.

## Alternativas descartadas

**Remontar el provider con `key`.** Cero cambios en el core y por eso tentador. Remonta el árbol
entero en cada cambio: se pierde el estado de cada componente, cada `Reveal` vuelve a animar y el foco
se va al `body`. Además dejaba a la librería sin la capacidad, que es el problema de fondo, no el
síntoma.

**Un `setCustomTheme` aparte.** Dos funciones para una operación, y el consumidor teniendo que saber
de qué tipo es su tema antes de elegir la llamada. La unión discrimina sola por `typeof`.

**Validar con `themeSchema` en cada `setTheme`.** Mete zod en la ruta caliente de un conmutador y
duplica lo que el tipo ya garantiza. `LoadTheme` valida en el borde, que es donde entra lo que no
controlas.

## Consecuencias

- **Aditivo en la práctica**: `setTheme("light")` compila y se comporta igual. Los tests de
  `theme-switch` y `persistence` valen tal cual, incluido el que comprueba que un nombre desconocido
  lanza.
- **`ThemeContextValue.setTheme` se ensancha** en `@stellaria/nebula-hooks`. El tipo sigue sin
  depender de `@stellaria/nebula-themes`: la unión es `string | NebulaTheme`, y `NebulaTheme` ya venía
  de tokens.
- **`docs/02` §4 se actualiza** en este mismo PR: el párrafo de temas custom deja de decir sólo
  `defaultTheme`.
- **La portada deja de temar una isla** y pasa a temar `<html>`. El panel de tema del sitio es la
  prueba de producción de esta decisión, y ejercita las cuatro dimensiones a la vez: color por
  producto, scheme, `motion.tier` y `effects.glass.enabled`.
- **Tests nuevos**: que `setTheme(objeto)` aplica las vars inline, que persiste el scheme y no el
  nombre del objeto, que en `applyTheme="root"` las vars van a `<html>` y se limpian al volver a un
  tema oficial, y que un nombre desconocido sigue lanzando.
