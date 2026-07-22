---
name: permissions-mirror
description: Spec de PermissionGate de Nebula (docs/01 §6) — gating de permisos con resolver inyectado y keys tipadas por la app, sin acoplar el core a ningún backend.
---

# Permission gating (spec de `PermissionGate`)

Adaptación del patrón `PermissionsKeys` de tfv y la skill 33 de Stellaria: Nebula NO define keys de negocio ni consulta backends — **la app inyecta el resolver**.

## Contrato (docs/01 §6)

- `@stellaria/nebula-hooks`:
  - `PermissionProvider<K extends string>` — recibe `resolver: (key: K) => boolean` de la app; las keys quedan tipadas por la app vía el generic.
  - `usePermission(key: K): boolean`.
- Componente core `PermissionGate` (`<PermissionGate permission="x" fallback={…}>`).
- Props `permission` en las acciones de `CardComplex`/`Menu`/`Button` consumen el mismo provider.

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
