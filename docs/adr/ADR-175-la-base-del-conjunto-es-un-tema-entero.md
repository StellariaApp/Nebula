# ADR-175 — La base de un conjunto es un tema entero, y eso deja mandar uno solo

- **Estado**: **aceptada** · 2026-08-18 — decidida por el propietario
- **Cambia API pública**: sí, **aditivo**. `CompiledSet` gana `base` y `slices`. `css` sigue siendo
  lo mismo que era: todo junto.
- **Toca**: `packages/themes` (`CompileThemes`, `/all/web`), `apps/web`.

## Contexto

[ADR-169](ADR-169-los-temas-comparten-su-base-y-viven-en-una-capa.md) puso en `:root` **lo que los
temas tienen idéntico** y dejó a cada clase su diferencia contra esa intersección. Con dieciséis
temas la cuenta salió así:

```
CSS de /all/web        503,4 kB en crudo · 9,3 kB en brotli
```

Y ese CSS viaja **dos veces** en el HTML de la landing —una como `<style>` y otra en el payload de
RSC—, porque `apps/web` usa `inlineCss: true`. Un megabyte de texto que el navegador parsea antes de
pintar para enseñar, casi siempre, **un** tema.

Comprimido no es un problema: 9,3 kB. El problema es el parseo y el peso del documento.

La salida obvia —incrustar sólo el tema activo— no se podía dar. Con la base siendo la intersección,
a un tema al que le falte su clase le faltan colores: `:root` no es un tema, es un residuo.

## Decisión

### 1. La base pasa a ser el primer tema del conjunto, entero

`:root` lleva las 627 declaraciones de `nebula` oscuro. Cada clase lleva sólo aquello **en lo que
difiere de esa base**, no aquello en lo que difiere de todos.

Dos cosas mejoran a la vez, y la segunda es la que importa:

1. **Sale más pequeño.** La diferencia contra un tema concreto es menor que contra la intersección de
   los treinta y dos: 503,4 kB → **285,7 kB**, un 43% menos, sin cambiar nada más.
2. **`:root` es un tema completo.** A un tema sin su clase ya no le faltan colores: degrada a
   `nebula`. Eso es lo que hace legítimo mandar uno solo.

### 2. `CompiledSet` publica las piezas

`base` es la regla de `:root`; `slices` es la de cada tema, con sus dos esquemas. `css` sigue siendo
la suma, así que quien no quiera repartir no cambia nada.

### 3. La landing manda uno y trae el resto

- El HTML incrusta `BASE + SLICES.nebula` — **49,2 kB en vez de 285,7**, un 17%.
- `/themes.css` sirve los quince restantes: 236,4 kB en crudo, 5,5 kB en brotli, inmutables.
- El panel los pide al abrirse, que es el primer momento en que se sabe que hacen falta.
- Un script pegado a `ThemeScript` los pide **antes del primer pintado** si el tema guardado no es el
  incrustado. Sólo lo paga quien eligió otro, y a cambio ve el suyo desde el primer fotograma.

Medido sobre el HTML construido: el CSS de tema baja de ~1.007 kB a **98,4 kB** en el documento.

## Alternativas

**Base estructural repartida en build** (la «opción B» del plan de performance). Recorta bytes crudos
que ya comprimen a nada y es trabajo dentro del paquete publicado. Se descarta: esta decisión da el
mismo resultado en el documento sin tocar lo que se publica.

**Cookie con el tema, y que el servidor incruste el que toca.** Es lo más limpio en teoría y se
descarta por una razón concreta y ya documentada en `apps/web/src/lib/lang.ts`: `cookies()` saca de la
generación estática a cualquier ruta que la toque, y esto se llama desde el layout raíz. Costaría el
prerenderizado del sitio entero para ahorrarle una petición a una minoría.

**Incrustar todo y no repartir.** Es lo que había. 9,3 kB comprimidos no duelen en red, pero el
documento sí carga con el texto sin comprimir dos veces.

## Consecuencias

- **Los nombres de clase cambian** —el hash se calcula sobre la diferencia, y la diferencia es otra—.
  No es contrato: nadie los escribe a mano, salen de `CLASSES`.
- **El orden del registro pasa a importar.** El primer tema de `Themes` es la base, y hoy es
  `nebula`. Moverlo de sitio cambia todo el CSS.
- Quien llame a `CompileThemes` con un conjunto propio hereda la regla: su primer tema es su base.
- El CSS de `/all/web` y el de `/<tema>/web` **siguen sin ser intercambiables**, por lo mismo que
  decía ADR-169: cada conjunto calcula su base sobre lo que contiene.
