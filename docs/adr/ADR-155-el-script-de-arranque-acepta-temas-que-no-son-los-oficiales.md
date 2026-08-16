# ADR-155 — El script de arranque acepta temas que no son los oficiales

- **Estado**: **propuesta** · 2026-08-16
- **Toca**: `ColorSchemeScriptProps` de `@stellaria/nebula-web`, API pública en `0.1.0`.
- **Motiva**: el panel de tema de `apps/web` persiste siete ejes y ninguno sobrevive al refresco sin
  parpadeo.

## Contexto

Conviene empezar corrigiendo lo que se creía. **`ColorSchemeScript` no aplica solo `color-scheme`**:
ya añade la clase del tema a `<html>`, pone `data-nebula-theme` y `data-scheme`, y lo hace **antes
del primer pintado**. Para los dos temas oficiales el parpadeo está resuelto desde W1.

Lo que no cubre es todo lo demás:

```js
var c = {…themeClass…};                                    // SOLO los oficiales
var t = window.localStorage.getItem(key) || defaultTheme;
if (!c[t]) t = defaultTheme;                               // un tema de producto cae aquí
```

Un tema que no está en `themeClass` **se descarta y cae al defecto**. Los temas de producto no son
clases: el provider los aplica con `assignInlineVars` en un efecto post-montaje
([`nebula-provider.tsx`](../../packages/web/src/provider/nebula-provider.tsx)), así que el usuario ve
el tema por defecto y luego el suyo.

Y no es solo estética: los ejes de **densidad** y **esquinas** cambian métrica, así que aplicarlos
tras montar mueve el layout — desplazamiento acumulado en la métrica que hoy está en 0,006.

## Por qué no se resuelve leyendo una cookie en el servidor

Era la vía obvia y **se descarta con un número delante**. El tema vive en `<html>`, así que leerlo va
en el layout raíz, y `cookies()` allí **saca de prerenderizado estático a las 172 rutas** del sitio.
Se cambiaría un parpadeo por TTFB en todas ellas, justo la métrica que P5 acaba de ganar.

El script de arranque da lo mismo sin ese precio: corre antes de pintar y el HTML sigue siendo
estático. Es el mecanismo que ya existe; solo hay que dejar de limitarlo a los temas oficiales.

## Decisión propuesta

### 1. El mapa de clases se puede inyectar

`ColorSchemeScript` gana `themes?: Record<string, string>`, que **por defecto es `themeClass`** — o
sea, sin pasar nada se comporta exactamente como hoy. Quien tenga temas propios materializados como
clase pasa el suyo y el script los reconoce.

**El núcleo no aprende dominio.** Es la regla dura del proyecto: `packages/web` no puede conocer
`rosette` ni `aurora`. Con el mapa inyectado, quien los conoce es quien los define, que es donde
tiene que estar.

Esto obliga a que un tema de producto **exista como clase**, no como vars inyectadas. Es trabajo del
consumidor —`createTheme` por tema— y no de este ADR.

### 2. Los otros cinco ejes se quedan fuera, y a propósito

`corner`, `density`, `motion`, `glass` y `face` **no entran en el script de la librería**. Son
propiedades del contrato que el consumidor ya puede escribir sobre `<html>` desde su propio script
inline, porque `vars` se exporta y los nombres de las custom properties son públicos.

Meterlos aquí obligaría a la librería a conocer la forma de la elección del consumidor —siete ejes
hoy, los que sean mañana— y eso es dominio. La frontera correcta es: **la librería sabe de temas, el
consumidor sabe de su selector.**

### 3. El almacenamiento sigue siendo `localStorage`

No se añade lectura de cookie. Con el script corriendo antes de pintar, **el servidor no necesita
saber el tema**, así que la cookie no compraría nada y sí complicaría el contrato. Si algún día se
quiere render del servidor por tema, eso es otra decisión y otro ADR.

## Consecuencias

- **Aditivo.** `themes` por defecto `themeClass` deja intacto lo publicado en `0.1.0`. Entra como
  minor.
- **Desbloquea la persistencia real del panel**: con las clases de producto registradas, el tema
  elegido sobrevive al refresco sin parpadeo y sin tocar el prerenderizado.
- **El sitio sigue siendo 172 rutas estáticas.** Es la consecuencia que justifica la forma.
- **Deja trabajo al consumidor**: materializar sus temas como clases y escribir los cinco ejes
  restantes. Es deliberado — es lo que mantiene el núcleo libre de dominio.

## Alternativas descartadas

**Leer la cookie en el layout raíz.** Resuelve todo de una vez y es menos código, pero convierte el
sitio entero en dinámico. Medido en el contexto, no estimado.

**Que el script conozca la elección de siete ejes.** Sería más cómodo para `apps/web` y metería la
forma de un selector concreto en el API de la librería. Es exactamente lo que ADR-121 evitó al decir
que quien quiera persistir el suyo «guarda su propio selector».
