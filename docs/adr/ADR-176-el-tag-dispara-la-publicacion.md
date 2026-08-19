# ADR-176 — El tag dispara la publicación, y lo crea quien lanza el release

- **Estado**: **aceptada** · 2026-08-19 — decidida por el propietario
- **Revisa**: [ADR-139](ADR-139-los-gates-completos-se-atan-al-release.md), que ataba la pasada
  completa al **asunto** del commit de release. El reparto de trabajo no cambia; cambia el marcador.
- **Toca**: `.github/workflows/gates.yml`, `scripts/release.mjs`. Sin dependencias nuevas.

## Contexto

ADR-139 decidió que los diez gates y la publicación se disparan por el commit de release, y el
workflow lo leía así:

```
startsWith(github.event.head_commit.message, 'chore(release):')
```

El propio workflow escribía la premisa que lo sostenía: «`scripts/release.mjs` exige el árbol limpio
y main al día antes de commitear, **así que el commit de release siempre es la cabeza del push**».

**Las dos cosas fallaron el mismo día, el 2026-08-19.**

**Primero, el marcador.** El script murió antes de empujar —un bug de ruta, arreglado en
`304d3804`—, el release se reconstruyó a mano y encima entró un arreglo más. La cabeza del push pasó
a ser `fix(themes)`, así que se saltaron `gates`, `a11y`, `visual` y con ellos `publish`, que depende
de los tres.

Lo grave no es que no publicara. Es que **el run salió verde**: un job saltado no falla, así que
nada se puso rojo y la 1.0.0 se quedó sin publicar en silencio, con npm todavía en 0.1.0. Un fallo
que se presenta como éxito es peor que uno ruidoso, porque nadie lo va a buscar.

**Después, los tags.** Cuando por fin publicó, no dejó ninguno. `changeset publish` los crea
**ligeros** y el paso que los subía era `git push --follow-tags`, que empuja **solo los anotados**.
El paso salió verde sin empujar nada.

Y eso no es cosmético: `Range()` del script de release calcula el rango del changelog **desde el
último tag `@stellaria/*`**. Sin tags recorre el historial entero — la 1.0.0 se redactó leyendo 709
commits en vez de los del release.

## Decisión

**El disparador pasa a ser un tag, y lo crea la máquina de quien lanza el release, no CI.**

### 1. `scripts/release.mjs` etiqueta y empuja

Después de commitear la versión:

- `pnpm exec changeset tag` pone **uno por paquete** —`@stellaria/nebula-web@1.0.0`—, que es lo que
  `Range()` lee para el changelog siguiente.
- Encima va uno **anotado**, `v<version>`, que es el que dispara el workflow. Anotado a propósito,
  porque `--follow-tags` es la trampa en la que ya se cayó una vez.
- Empuja `git push` y `git push --tags`.

Antes de etiquetar comprueba que **los seis paquetes comparten versión** y para si no. El tag nombra
una sola, así que con versiones distintas mentiría.

### 2. El workflow se dispara por el ref, no por un mensaje

| Evento | Qué corre |
| ------ | --------- |
| push a una rama | sólo `guardia` (typecheck + lint) |
| push de un tag `v*` | los diez gates, axe, la regresión visual y **la publicación** |
| PR o dispatch manual | los diez gates y axe, **sin publicar** |

Lo que compra: en un push de tag los jobs de gates **no tienen condición que evaluar**, así que no se
pueden saltar. El modo de fallo de arriba deja de existir por construcción, no por vigilancia. Un tag
o llega o no llega; si no llega no hay run que malinterpretar.

### 3. `publish` deja de tocar los tags

`changeset publish --no-git-tag`, y desaparece el paso que los empujaba. El orden estaba invertido:
el que publica dejaba el marcador de lo que publicó, cuando el marcador es lo que **pide** la
publicación. Con esto `contents: write` baja a `contents: read`.

## Alternativas

**Mirar todos los commits del push** en vez de sólo la cabeza —`contains(join(commits.*.message,
'|'), 'chore(release):')`—. Se implementó como parche inmediato en `716d29df` y se sustituye por
esto. Arregla el caso concreto y no el fondo: el marcador sigue siendo una cadena en un mensaje, el
payload de push trae como mucho veinte commits, y un job saltado sigue saliendo verde.

**Que CI cree el tag después de publicar.** Es lo que hacía y es el orden al revés. Además deja el
tag a merced de que el job llegue hasta el final.

**Un workflow aparte para publicar.** Es de donde se venía antes de ADR-134, y volvería a permitir
que un catálogo con los tests en rojo acabe en npm: sin `needs` compartido no hay encadenado.

**Tags por paquete como disparador** (`@stellaria/*@*`). Seis tags, seis runs, seis publicaciones
idempotentes. Se descarta por ruido; los por-paquete se siguen creando, pero como marcador y no como
disparador.

## Consecuencias

- **La publicación pide un acto deliberado.** Empujar un tag no se hace sin querer, y un `chore(release):`
  en el asunto de un commit sí se puede colar.
- **Los tags existen siempre**, así que `Range()` vuelve a redactar el changelog desde el release
  anterior en vez de desde el principio del repo.
- **El versionado independiente de ADR-134 queda acotado en la práctica**: el script para si los seis
  no comparten versión. La configuración de changesets no lo fuerza —`fixed` y `linked` siguen
  vacíos—, así que el día que se quiera divergir hay que decidir qué nombra el tag.
- Un release fallido a medias se reintenta empujando el tag otra vez; `changeset publish` sigue
  siendo idempotente.
- **La 1.0.0 se quedó sin tags** y esto no los crea retroactivamente. Si se quieren, se ponen a mano
  sobre `0cefe389` antes del próximo release, o el siguiente `Range()` volverá a leer de más.
