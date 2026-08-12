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

## Lo que W5.2 hace

1. `pnpm release` → `minor`. Deja los seis en `0.1.0`, commitea y empuja.
2. El workflow construye desde un checkout limpio y publica con procedencia.
4. **Verificación en un Next 16 virgen**: `pnpm create next-app`, instalar los paquetes desde npm
   —no desde el workspace—, montar el provider con un tema y un `Button`, y comprobar que la hoja de
   estilos llega y que no hay parpadeo de esquema.
5. Comprobar en npm que cada paquete muestra su README, su licencia y su enlace al repositorio.

## Lo que NO entra

- Native. `@stellaria/nebula-native` no se publica en W5: requiere N1.
- Los paquetes premium. Van en W6, con registry privado.
- `@stellaria/nebula-demos`: es andamiaje de demostración y está en `ignore`.
