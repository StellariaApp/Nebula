# ADR-056 — La prop `permission` en el catálogo y el registro de keys

- **Estado**: **aceptada** · 2026-07-30 (W3.3 bloque D, ampliación pedida por el propietario)
- **Amplía**: `docs/01-architecture.md` §6.
- **Relacionado**: ADR-005 (contrato `NebulaField`, que vive en tokens por el mismo motivo que este).

## Contexto

`docs/01` §6 dice que hay «props `permission` en las acciones de `CardComplex`/`Menu`/`Button`» y que
las keys van «tipadas por la app vía generics (`PermissionProvider<K extends string>`)». El bloque D
entregó el provider, el hook y `PermissionGate`, pero no la prop: componer
`<PermissionGate><Button/></PermissionGate>` funciona y es explícito, y para un menú de seis items es
seis envoltorios.

Al ir a escribir la prop aparecen dos problemas que la redacción de §6 no resuelve.

**El primero es de tipado.** Los generics funcionan en `PermissionGate<K>` porque es una función suelta.
No funcionan en `Button`, que es `forwardRef<HTMLButtonElement, ButtonProps>`: hacerlo genérico obliga a
castear el `forwardRef` a una interfaz llamable, como ya hace el polimorfismo de ADR-018 §2, y a
repetirlo en cada componente con `permission`. Y tampoco funcionan en un **item de colección**
—`MenuItemData`, `TabItem`—, que es un objeto dentro de un array, no una llamada donde inferir nada.
Con `permission?: string` la promesa de §6 queda en nada: un typo es una denegación silenciosa.

**El segundo es de semántica.** «Sin permiso» no significa lo mismo en un botón suelto que en un item
de una colección: en el botón hay que decidir entre ocultar y deshabilitar; en la colección, entre
sacarlo del array y marcarlo `disabled`.

## Decisión

1. **El contrato vive en `@stellaria/nebula-tokens`**, en `types/permissions.ts`, junto a
   `NebulaField`. Es la misma clase de cosa: un contrato compartido, sin runtime, que web y native
   implementan por separado. `hooks` aporta el runtime; `tokens` sigue con cero dependencias.

2. **Las keys se tipan por un registro con declaration merging**, no por generics:

   ```ts
   export interface NebulaPermissions {}
   export type PermissionKey =
     NebulaPermissions extends { keys: infer K extends string } ? K : string;
   ```

   La app lo aumenta una vez:

   ```ts
   declare module "@stellaria/nebula-tokens" {
     interface NebulaPermissions {
       keys: "cobros.ver" | "cobros.anular";
     }
   }
   ```

   A partir de ahí **todo** el catálogo tipa sus keys —props de componente, items de colección,
   `usePermission`, `PermissionGate`— sin anotar un generic en ningún punto de uso. Sin aumentar,
   `PermissionKey` es `string` y nada cambia: el registro es opt-in y no rompe a quien no lo use.

3. **Los generics existentes se conservan y se reconstrainan a `PermissionKey`.**
   `usePermission<K extends PermissionKey = PermissionKey>` sigue admitiendo la anotación explícita, y
   ahora un typo falla porque `"cobros.anualr"` no extiende `PermissionKey` cuando el registro está
   aumentado. Antes, con `K extends string`, la key inferida siempre satisfacía la restricción y el
   generic no verificaba nada.

4. **`PermissionProps` es el contrato de la prop**, y lo extienden los componentes:

   ```ts
   export interface PermissionProps {
     permission?: PermissionKey | undefined;
     permissionMode?: PermissionDeniedMode | undefined;
   }
   ```

   `permissionMode` por defecto es **`"hide"`** en todas las superficies, igual que `PermissionGate`.
   Una sola regla que recordar, y es la que respeta la norma de la skill: sin permiso, no se muestra.

5. **Superficies que la reciben**, y por qué:

   | Componente | Sin permiso, `hide` | Sin permiso, `disable` |
   | ---------- | ------------------- | ---------------------- |
   | `Button` · `ActionIcon` · `QuickAction` | no renderiza | `disabled` real, no un envoltorio inerte |
   | `NavLink` | no renderiza | `disabled`, y el `href` se retira |
   | `MenuItemData` | sale de la colección | entra en `disabledKeys` |
   | `TabItem` | sale de la colección, y su contenido con ella | pestaña deshabilitada |

   `ButtonCopy` la hereda de `ActionIconProps`. `CardComplex` la recibirá en W3.5 en su grupo de
   acciones, que es lo que §6 nombra y aún no existe.

6. **En los controles, `disable` usa el `disabled` nativo**, no el contenedor `inert` de
   `PermissionGate`. Un botón ya sabe deshabilitarse: tiene estado visual, `aria-disabled` y bloqueo de
   press por React Aria. `inert` existe en `PermissionGate` porque ahí el contenido es arbitrario y no
   hay ningún `disabled` que poner.

7. **En las colecciones el filtrado ocurre una vez, no por item.** `usePermissionResolver()` devuelve
   el resolver y `ApplyPermissions` recorre el array. No se puede llamar a un hook por item —el número
   de items varía entre renders— y ese es justo el motivo de que `usePermissionResolver` exista.

## Alternativas

- **Solo `PermissionGate`, sin prop.** Cero API nueva y explícito en el punto de uso, pero no cubre los
  items de colección: envolver un objeto de un array en un componente no es posible, así que `Menu` y
  `Tabs` se quedarían fuera del sistema. Y §6 pide la prop por su nombre.
- **`permission?: string` sin registro.** Es lo más simple y lo que hace la mayoría de las librerías;
  a cambio incumple el punto de §6 que dice «keys tipadas por la app» y convierte cada typo en una
  denegación silenciosa, que es el peor fallo posible en un sistema de permisos porque parece
  funcionar.
- **Hacer genérico cada componente** (`Button<K>`, …). Cumple con generics puros, pero obliga a castear
  todos los `forwardRef` del catálogo, deja el generic sin inferir en cada uso —`<Button<AppKey>>` en
  cada botón— y sigue sin resolver los items de colección. Rechazada por coste y por no cubrir el caso.
- **`permissionMode` por defecto `"disable"`.** Comunica mejor que la acción existe, pero muestra a
  todo el mundo lo que no puede hacer y contradice la regla de la skill —«nunca se muestra por
  defecto»—. Queda como opt-in, que es donde tiene sentido: cuando el producto **quiere** decir «esto
  existe, pídelo».

## Consecuencias

- **Ampliación de API pública en 6 superficies** más 2 tipos de item. Es aditiva —`permission` es
  opcional y sin ella nada pasa por el gate— y los paquetes siguen `private: true`.
- **`PermissionDeniedMode` se muda de `packages/web` a `packages/tokens`.** `@stellaria/nebula-web` lo
  reexporta, así que el import público no cambia; el que cambia es de dónde sale, y era necesario para
  que native comparta el contrato sin duplicarlo.
- **`Button`, `ActionIcon`, `NavLink` y `QuickAction` pueden devolver `null`.** Su firma pasa a
  `ReactElement | null`. Un consumidor que dependiera de que el componente siempre renderiza algo
  —midiendo su nodo, por ejemplo— tiene que contemplarlo.
- **Coste de bundle**: `usePermissionGranted` es un `useContext` y una comparación. Medido en `Button`,
  el módulo no se mueve de banda.
- **`NebulaPermissions` tiene que ser una interfaz vacía** para que la app pueda declarar `keys` sin
  chocar con un miembro previo; declaration merging exige tipos idénticos para propiedades del mismo
  nombre. Eso obliga a desactivar `@typescript-eslint/no-empty-object-type` **en ese archivo**, con la
  excepción declarada en `eslint.config.js` y no como `eslint-disable` inline, para no romper la regla
  de ADR-019 de código sin comentarios.
- **Paridad W/N**: native hereda el contrato de tokens y solo implementa el reparto hide/disable de su
  lado. El lint de paridad compara props y este las iguala de partida.
- **El gating sigue siendo de UI.** Nada de esto es seguridad: el backend sigue siendo la autoridad y
  esto es su espejo, no su reemplazo.
