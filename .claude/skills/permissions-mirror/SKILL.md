---
name: permissions-mirror
description: Spec de PermissionGate de Nebula (docs/01 §6) — gating de permisos con resolver inyectado y keys tipadas por la app, sin acoplar el core a ningún backend.
---

# Permission gating (spec de `PermissionGate`)

Adaptación del patrón `PermissionsKeys` de tfv y la skill 33 de Stellaria: Nebula NO define keys de negocio ni consulta backends — **la app inyecta el resolver**.

## Contrato (docs/01 §6 · ADR-056)

- `@stellaria/nebula-tokens` — contrato sin runtime, compartido W/N:
  - `NebulaPermissions` (interfaz vacía que la app **aumenta** con `keys`) → `PermissionKey`.
  - `PermissionDeniedMode = "hide" | "disable"` y `PermissionProps { permission?, permissionMode? }`.
- `@stellaria/nebula-hooks`:
  - `PermissionProvider<K extends PermissionKey>` — recibe `resolver: (key: K) => boolean` de la app.
  - `usePermission(key)` · `usePermissionResolver()` (varias keys en un render, para colecciones) · `usePermissionGranted(key | undefined)` (el que usan los componentes).
- Componente core `PermissionGate` (`<PermissionGate permission="x" fallback={…}>`, `mode="hide" | "disable"`).
- Prop `permission` en `Button`, `ActionIcon`, `QuickAction`, `NavLink` y en los items de `Menu` y `Tabs`; `CardComplex` en W3.5. Default `permissionMode="hide"` en todas.

## Cómo se tipan las keys en una app

```ts
declare module "@stellaria/nebula-tokens" {
  interface NebulaPermissions {
    keys: "cobros.ver" | "cobros.anular";
  }
}
```

Una vez por app. A partir de ahí un typo en cualquier `permission` del catálogo es error de
compilación. Sin aumentar el registro, `PermissionKey` es `string` y el sistema funciona igual, pero
sin la red.

## Reglas obligatorias

- **Ausencia de permiso = denegación explícita** (sin provider ⇒ todo `permission` gated se oculta/deshabilita según su prop, nunca se muestra por defecto).
- Nada de strings de permisos hardcodeadas dentro de Nebula — las keys son de la app; Nebula solo las transporta tipadas.
- Evaluar permisos en el gate/hook, no dispersos en la vista (una sola fuente de verdad por render).
- El gating es de UI, no de seguridad: el backend sigue siendo la autoridad (espejo, no reemplazo).

## Checklist

- [ ] ¿La key viene tipada del generic de la app (no `string` plano)?
- [ ] ¿La acción/vista usa `PermissionGate` o prop `permission` (no `if` ad-hoc)?
- [ ] ¿El fallback (ocultar vs disabled) está definido explícitamente?
- [ ] ¿Cero imports de servicios/API dentro del core para resolver permisos?
