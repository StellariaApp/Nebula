# Checklist de release

> Estado al cierre de W5.1 (2026-08-12). Lo que W5.2 tiene que hacer, y lo que ya está hecho.
> La mecánica está en [ADR-134](adr/ADR-134-changesets-y-la-forma-del-paquete-publicado.md).

## Los cinco paquetes

| Paquete                    | Subpaths | Empaquetado | Archivos |
| -------------------------- | -------: | ----------: | -------: |
| `@stellaria/nebula-tokens` |        1 |     ~26 kB |       94 |
| `@stellaria/nebula-hooks`  |        1 |     ~19 kB |       66 |
| `@stellaria/nebula-themes` |        1 |     ~34 kB |       46 |
| `@stellaria/nebula-icons`  |        2 |      ~8 kB |       46 |
| `@stellaria/nebula-web`    |        8 |     447 kB |    1.618 |

Los cinco pasan `npm publish --dry-run`. Siguen en `0.0.0`: la primera versión la fija el primer
changeset.

## Hecho en W5.1

- [x] **Un solo comando**: `pnpm release` pregunta el salto, redacta las notas con Claude a partir de
      los commits, escribe el changeset, versiona, commitea y empuja. `pnpm release:dry` lo enseña
      todo sin escribir nada.
- [x] **Publica el CI**, no el portátil: `.github/workflows/release.yml` con `--provenance`, que solo
      funciona desde un runner. Corre en cada push a `main` y no hace nada hasta que una versión sube.
- [x] **`private: true` retirado** de los cinco y `publishConfig.access` puesto.
- [x] **`engines`, `repository` (con `directory`), `homepage`, `bugs` y `author`** en los cinco. No
      estaban en ninguno.
- [x] **`LICENSE` copiada a cada paquete.** Existía solo en la raíz, así que ningún tarball la
      llevaba.
- [x] **Mapas de fuente fuera del tarball.** Pesaban 427 kB contra 333 kB de código y no resolvían
      nada: sin `sourcesContent` y apuntando a un `src/` que no se publica. `web` baja de 1,1 MB a
      447 kB.
- [x] **Tree-shaking verificado con un bundle**, no por inspección: importar `Button` no arrastra
      ninguna de las seis deps pesadas de los subpaths.
- [x] **Peers opcionales declarados**: `form-atoms` y `@pqina/react-pintura`.
- [x] **READMEs de consumo** en los cinco: instalación, arranque, tabla de subpaths con presupuestos
      reales y matriz de compatibilidad.
- [x] **El repositorio que el sitio publicaba era el equivocado** en cinco sitios. Centralizado.

## Bloquea W5.2 — necesita tu respuesta

**Las dos estan cerradas** (2026-08-12):

- [x] **El paraguas se reserva con solo README.** ADR-013 daba `@stellaria/nebula` por publicado y
      npm devolvia 404, asi que no habia nada que deprecar. `packages/nebula` es un paquete sin
      codigo que explica que instalar. Reexportar el core se descarto: borraria la frontera de
      subpaths que hace que importar un boton no cueste 130 kB de graficas.
- [x] **`NPM_TOKEN` dado de alta** como secreto del repositorio.
- [x] **La primera version es `0.1.0`.** No es prudencia generica: N1 —native— todavia no ha corrido,
      y esa fase existe para validar que el mismo `NebulaTheme` sirve en las dos plataformas. En 0.x
      una correccion de contrato se arregla; en 1.x costaria un 2.0.0 a las pocas semanas.

## W5.2 · PUBLICADO el 2026-08-12 en `0.1.0`, y el 2026-08-19 en `1.0.0`

Los seis en npm, publicados por el CI tras pasar los ocho gates, axe y —desde ADR-149— la regresion
visual sobre el contenedor anclado.

**La 1.0.0 no dejo tags.** `changeset publish` deberia crear un `<paquete>@1.0.0` por paquete y el
paso «empujar los tags que cree changeset» subirlos, y no hay ninguno ni en local ni en el remoto.
Sin ellos no queda marcador en git de que arbol produjo cada version. Pendiente de mirar el log del
job de publicacion.

**Y estuvo a punto de no publicarse en silencio.** El workflow decide la pasada completa por el
asunto del commit de release, y hasta el 2026-08-19 miraba solo la cabeza del push. Aquel push
llevaba un `fix(themes)` encima, asi que se saltaron `gates`, `a11y`, `visual` y `publish` — y el run
salio VERDE, porque un job saltado no falla. Se arreglo en 716d29df para que mire todos los commits
del push. Si un dia una version no aparece en npm y CI esta verde, mira eso primero.

| Paquete | Sin empaquetar |
| ------- | -------------: |
| `@stellaria/nebula-web` | 2.115 kB |
| `@stellaria/nebula-themes` | 183 kB |
| `@stellaria/nebula-tokens` | 89 kB |
| `@stellaria/nebula-icons` | 42 kB |
| `@stellaria/nebula-hooks` | 41 kB |
| `@stellaria/nebula` | 4 kB |

### Lo que costo llegar, por si vuelve a pasar

- **`--provenance` no es bandera de `changeset publish`.** Su uso es `[--tag] [--otp]
  [--no-git-tag]`; la procedencia va por `NPM_CONFIG_PROVENANCE`.
- **`setup-node` y pnpm no componian.** El `.npmrc` que escribe `setup-node` en un userconfig
  temporal no llegaba a pnpm, asi que el token no autenticaba y npm devolvia `E404` en el `PUT` — el
  mismo codigo que da un permiso insuficiente. Se escribe explicito.
- **`E404` no distingue** «token ausente» de «token sin permiso»: npm responde igual para no revelar
  si un paquete con scope existe. Por eso el job corre `npm whoami` antes de publicar.
- **El token necesitaba «Bypass 2FA».** Un granular con escritura sobre el scope y la organizacion
  autentica, pero sin esa casilla no puede publicar desde un runner, que no puede teclear un codigo.
- **`changeset publish` tapa el error de npm**: su `isAlreadyPublishedError` revienta con un
  TypeError si npm no devuelve la forma que espera, y el log ensena el fallo del manejador.

### Lo que NO se consiguio: la procedencia

**Ninguno de los seis lleva atestacion.** La razon no es de configuracion: la procedencia escribe en
un registro publico de transparencia y **npm la exige sobre un repositorio publico**.
`StellariaApp/Nebula` es privado, asi que npm la omite **en silencio**, sin fallar la publicacion —
ni siquiera con `--provenance` explicito.

Queda como decision del propietario, y no es menor: [ADR-113](adr/ADR-113-el-nucleo-es-mit-y-los-dominios-se-venden.md)
dice que **el nucleo es MIT y publico**, y hoy el repositorio no lo es. Publicar codigo MIT desde un
repositorio cerrado es coherente con la licencia pero deja sin verificar de donde sale el tarball.
`NPM_CONFIG_PROVENANCE` se deja puesto: el dia que el repositorio se abra, empieza a firmar solo.
4. **Verificación en un Next 16 virgen**: `pnpm create next-app`, instalar los paquetes desde npm
   —no desde el workspace—, montar el provider con un tema y un `Button`, y comprobar que la hoja de
   estilos llega y que no hay parpadeo de esquema.
5. Comprobar en npm que cada paquete muestra su README, su licencia y su enlace al repositorio.

## Lo que falta para cerrar el gate de W5

La verificación de consumo. El roadmap la pide sobre «un Next 16 virgen», y se hace mejor
consumiendo la librería en un proyecto real: **la landing de Rosette**, que es Next 16.2.1 y React
19.2.4 —las versiones exactas de la matriz de compatibilidad— con 19 componentes propios y 3.596
líneas de CSS escritas sin Nebula delante.

Está escrito en [prompts/2-web/W5.3-verificacion-en-rosette.md](../prompts/2-web/W5.3-verificacion-en-rosette.md),
listo para pegar en una sesión limpia. El entregable no es el refactor: es la lista de lo que al
catálogo le falta, y llega a tiempo de corregir contrato en `0.2.0` sin costar una versión mayor.

## Lo que NO entra

- Native. `@stellaria/nebula-native` no se publica en W5: requiere N1.
- Los paquetes premium. Van en W6, con registry privado.
- `@stellaria/nebula-demos`: es andamiaje de demostración y está en `ignore`.
