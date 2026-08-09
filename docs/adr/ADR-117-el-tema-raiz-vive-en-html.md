# ADR-117 — El tema raíz vive en `<html>`

- **Estado**: aceptada · 2026-08-08 · **DS2 · W5**
- **Cambia API pública**: sí, y **solo añade**: `NebulaProvider` gana `applyTheme`, con el valor de
  hoy por defecto. Ninguna app existente cambia de comportamiento sin pedirlo.
- Lo destapó mirar la portada del sitio: la página pinta un tema y luego salta al otro.

## Contexto

`ColorSchemeScript` existe desde el principio y **no evitaba nada**. Escribía
`data-nebula-theme` y `color-scheme` en `<html>`, pero **ninguna regla del catálogo selecciona por
ese atributo**: las variables del tema las declara la clase de vanilla-extract (`themeClass.dark`),
y esa clase vive en el `div` que pinta `NebulaProvider`, dentro del `body`.

La secuencia real, medida en el DOM del sitio:

1. El SSR emite el `div` con la clase de `defaultTheme`.
2. El script corre en `<head>` y pone `data-nebula-theme="light"` en `<html>` —el atributo que nadie
   estiliza— y `color-scheme: light`, que sí cambia el lienzo del navegador.
3. El navegador pinta: lienzo claro, contenido con las variables del tema oscuro.
4. Hidrata, el `useEffect` lee `localStorage` y `set_active` cambia la clase del `div`.

El salto que se ve entre el paso 3 y el 4 no es un detalle de pulido: es **el atributo escrito en un
sitio y la clase leída en otro**. Mantine no lo tiene porque sus reglas seleccionan por
`[data-mantine-color-scheme]` **en `<html>`**, así que su script pinta el tema entero antes del
primer frame.

## Decisión

**El tema raíz puede vivir en `<html>`, y el script lo pone ahí antes de pintar.**

### 1. `ColorSchemeScript` escribe la clase, no solo el atributo

El script serializa el mapa `themeClass` —los nombres los conoce en build— y en `<html>` quita
cualquier clase de tema, pone la que toca, y escribe `data-nebula-theme`, `data-scheme` y
`color-scheme`. Con eso **el primer byte del `body` ya se pinta con las variables correctas**.

Esto es incondicional y no rompe nada: en el modo de hoy el `div` del provider redeclara las mismas
variables un nivel más abajo, que es un no-op.

### 2. `NebulaProvider` gana `applyTheme`

```ts
applyTheme?: "wrapper" | "root"; // por defecto "wrapper"
```

- **`"wrapper"`** (el de hoy, y el defecto): la clase va en el `div` del provider. Es lo que necesita
  un provider anidado —una demo con su propio tema, la matriz de temas del playground— y lo único
  que funciona **sin script**, porque el SSR sale ya temado.
- **`"root"`**: el `div` del provider **no lleva clase ni atributos de tema**; el provider sincroniza
  `<html>` en un efecto y el script lo hace antes de pintar. Sin salto.

`setTheme` sigue siendo el mismo en los dos modos.

### 3. `"root"` **exige** `ColorSchemeScript`

Es el coste, y se dice claro: en `"root"` el HTML del servidor no lleva las variables en ninguna
parte, porque el provider no controla `<html>`. Quien elija `"root"` y olvide el script ve la página
sin estilo hasta que hidrata. Por eso `"root"` no es el defecto, y por eso la guía de instalación
enseña las dos piezas juntas o ninguna.

### 4. El lienzo lo pinta el consumidor

El catálogo no toca `html` ni `body` —no es suyo—. Con el tema en `<html>`, el consumidor tiene las
variables disponibles y pinta el lienzo desde su layout:

```tsx
<body style={{ margin: 0, background: vars.color.surface.base, color: vars.color.text.primary }}>
```

Hasta ahora el fondo de la página era el del navegador, y era **la mitad del salto que se veía**:
`color-scheme` cambiaba el lienzo aunque el contenido no hubiera cambiado todavía.

## Lo que este ADR NO arregla, a propósito

El valor del contexto (`themeName`) sigue naciendo de `defaultTheme` en el primer render del cliente,
porque leer el DOM en el inicializador de `useState` provocaría desajuste de hidratación en todo
componente que se pinte distinto según el tema. Lo que se ve afectado es del tamaño de un icono —el
☾/☀ del conmutador— y se resuelve al hidratar. **El salto de página entera, que es el problema, ya no
ocurre**: lo pinta `<html>` antes del primer frame.

## Alternativas descartadas

**Que el provider detecte solo si es raíz** (ausencia de contexto padre). Los tests y el playground
montan providers raíz que no quieren tocar `<html>`, y dos raíces hermanas se pelearían por él. Un
modo explícito no adivina.

**Leer `localStorage` en un `useLayoutEffect`.** Mueve el salto un frame antes; no lo quita. El
navegador ya pintó el HTML del servidor.

**Emitir un `<style>` desde el script que anule la clase del `div`.** Funciona y es una trampa: dos
sitios declarando las mismas variables con una regla de desempate escrita a mano.

## Consecuencias

- **Aditivo**: sin `applyTheme`, todo se comporta igual. Los tests de `persistence`, `ssr`,
  `theme-switch` y `portal-theme-scope` siguen valiendo tal cual, y siguen cubriendo el modo `wrapper`.
- **`ColorSchemeScript` deja de ser decorativo** y pasa a ser el requisito de `"root"`. Cambia su
  salida, así que su test de serialización se amplía a la clase.
- **El sitio (`apps/docs`) usa `"root"`** y es la prueba de producción del modo.
- **La guía de instalación de DS2.3 debe enseñar las tres piezas juntas**: el script en `<head>`, el
  `applyTheme="root"` y el lienzo en `body`.
- **Tests nuevos** para lo que decide este ADR: que en `"root"` el `div` no lleva clase, que `<html>`
  la lleva, que `setTheme` la cambia en `<html>`, y que el script serializa el mapa de clases.
