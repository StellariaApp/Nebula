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

- [x] **Changesets** instalado y configurado: versionado independiente, `access: public`, los
      workspaces no publicables en `ignore`. Guiones `changeset`, `version:packages` y `release`.
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

- [ ] **El paquete paraguas `@stellaria/nebula`.** Existe una v0.0.2 publicada hace tres años.
      Las tres salidas, con lo que cuesta cada una:
      - **Meta-paquete que reexporta el core.** Un `pnpm add @stellaria/nebula` y ya. Cómodo, pero
        rompe el aislamiento de subpaths que ADR-014 construyó: si reexporta todo, el consumidor
        pierde la frontera que evita cargar Recharts sin pedirlo. Y hay que versionarlo con los cinco.
      - **Deprecarlo** con `npm deprecate`, apuntando a `@stellaria/nebula-web`. Es lo más honesto si
        no va a mantenerse, y libera el nombre de expectativas.
      - **Solo documentación**: un paquete con README y sin código, que explica el mapa de paquetes.
        Barato y sin trampa, pero es raro en npm.

      **Recomendación: deprecarlo.** El valor del paraguas es la comodidad de un solo install, y en
      esta librería eso choca de frente con el argumento de los subpaths, que es lo que hace que
      importar un botón no cueste 130 kB de gráficas.

- [ ] **Quién publica.** Hace falta una cuenta con permiso en la org `stellaria` y un token. Si la
      publicación va por CI, el token es un secreto del repositorio y conviene decidirlo antes de
      generar la primera versión.

## Lo que W5.2 hace

1. `pnpm changeset` para la primera versión de los cinco. Con `0.0.0` de partida, decidir si la
   primera pública es `0.1.0` (API aún móvil) o `1.0.0` (contrato congelado). **Es una decisión, no
   un trámite**: `1.0.0` compromete a semver desde el minuto uno.
2. `pnpm version:packages` y revisar el changelog generado.
3. `pnpm release`.
4. **Verificación en un Next 16 virgen**: `pnpm create next-app`, instalar los paquetes desde npm
   —no desde el workspace—, montar el provider con un tema y un `Button`, y comprobar que la hoja de
   estilos llega y que no hay parpadeo de esquema.
5. Comprobar en npm que cada paquete muestra su README, su licencia y su enlace al repositorio.

## Lo que NO entra

- Native. `@stellaria/nebula-native` no se publica en W5: requiere N1.
- Los paquetes premium. Van en W6, con registry privado.
- `@stellaria/nebula-demos`: es andamiaje de demostración y está en `ignore`.
