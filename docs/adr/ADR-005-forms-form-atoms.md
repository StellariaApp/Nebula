# ADR-005 — Forms: contrato `field` duck-typed compatible con form-atoms

- **Estado**: aceptada · 2026-07-14 (C2-Q6) · Resuelve la divergencia FieldAtom propio (component-architecture.md) vs form-atoms (stellaria-input-components-plan.md)
- **Contexto**: los DOS consumidores reales (fonicredito 3.3, tfv 3.2) usan form-atoms + Zod con `field?: FieldAtom` en todos sus inputs (~20 componentes); el plan de inputs de Stellaria ya había elegido form-atoms con integración duck-typed.
- **Decisión**: `@stellaria/nebula-tokens/types/fields.ts` define `NebulaField<T>` (duck-typed: value/setValue/status/error/touched). Los inputs aceptan `field?: NebulaField<T>`; `@stellaria/nebula-hooks/useFieldProps` conecta con form-atoms cuando está instalado. form-atoms es **peer opcional recomendado**, nunca dependencia del core. Zod 4 como validación recomendada, no impuesta.
- **Alternativas**: FieldAtom propio (reinventa form-atoms y fuerza migración de ambas apps); inputs 100% agnósticos value/onChange (pierde la ergonomía que ambas apps ya explotan).
- **Consecuencias**: la migración de inputs de FC/TFV conserva su wiring de forms sin cambios; `FormField` lee status/error del field automáticamente; si form-atoms v4 cambia su API, solo se toca `useFieldProps`.
