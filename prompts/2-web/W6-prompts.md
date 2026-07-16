# Prompts W6 — Componentes premium (superficie web)

> 3 prompts secuenciales. Requiere W5 cerrado (core web publicado). Cierra la etapa web: los 5 paquetes premium quedan publicados con su superficie **web**; la superficie native de cada uno llega en N5.

---

## Prompt W6.1 — Infraestructura premium: registry privado + licencias

```
Actúa como ingeniero de plataforma/negocio en C:\Users\Skr13\Documents\GitHub\Nebula.
W5 cerrado: el core web está publicado en npm.

LEE ANTES: docs\adr\ADR-013 (modelo premium), docs\adr\ADR-014 (reglas de deps),
docs\00-inventory.md §1.18 (alcance por paquete premium), docs\05-roadmap.md W6.

MISIÓN:
1. Mini-ADR (supuesto #5 pendiente): mecánica del registry privado — npm private packages (org
   stellaria, acceso por team/token) vs Verdaccio propio vs licencias por token en registry público.
   Presenta comparativa (coste, DX del cliente, revocación, seguridad) con recomendación AL
   PROPIETARIO y espera su decisión antes de implementar.
2. Implementar la mecánica elegida: publishConfig por paquete premium, CI de publicación separado,
   documentación de onboarding del cliente (cómo instala un comprador).
3. Scaffold de packages/domains/ (un paquete se crea al implementar su primer módulo — crea aquí
   SOLO commerce, el primero).
4. Playground web: sección "Premium" separada (galería con acceso/badge diferenciado).
5. Decisión de consumo: los premium ¿consumen el core publicado (dogfooding real) o workspace con
   verificación extra? Decide, justifica en el mini-ADR.

ACEPTACIÓN: flujo demostrado de instalación premium con credenciales de prueba; ADR registrado.
REPORTE: decisión de registry + flujo compra→instalación documentado.
```

## Prompt W6.2 — `nebula-commerce` + `nebula-sales` (web)

```
Actúa como desarrollador de los dominios premium en C:\Users\Skr13\Documents\GitHub\Nebula.
W6.1 cerrado (infraestructura premium lista).

LEE ANTES: docs\00-inventory.md §1.18 (alcance y regla de frontera: entidades por props/duck-typing,
CERO imports de apps ni backends), docs\api\tfv-components.md §7 (APIs de negocio reales de
referencia — no copia), docs\patterns\web-component-template.md.

MISIÓN — superficie WEB de:
1. @stellaria/nebula-commerce: ProductCard, PriceTag, StockIndicator, CartItem, CartSummary,
   Categories/Category patterns. Entidades duck-typed (ProductLike, CartItemLike…) con los campos
   MÍNIMOS que la UI necesita, definidas en el paquete.
2. @stellaria/nebula-sales: OrderCard, InvoicePreview, ReceiptPreview, ReceiptView, NumPad,
   Scanner web (getUserMedia — evalúa y pregunta si el alcance web procede o se pospone a native),
   ShipmentTracker, ShippingCalculator (motor de cálculo inyectable — la lógica de negocio NO va aquí).
3. Testing contract + stories premium + gate de deps (solo core+hooks+icons — lint).

ACEPTACIÓN: ambos paquetes instalan desde el registry premium en un proyecto externo (superficie web).
REPORTE: superficie entregada + decisiones de duck-typing.
```

## Prompt W6.3 — `payments` + `people` + `maps` (web) + cierre etapa web

```
Actúa como desarrollador de los dominios premium en C:\Users\Skr13\Documents\GitHub\Nebula.
W6.2 cerrado.

LEE ANTES: los mismos docs de W6.2 + docs\api\tfv-components.md (CardSubscription, AvatarUser,
OptionUser/Client, Map con fields de geocoding — referencias reales).

MISIÓN — superficie WEB de:
1. @stellaria/nebula-payments: CardSubscription/planes (recurring/pricing display), checkout summary,
   payment status patterns. Sin pasarela (la UI recibe estados por props).
2. @stellaria/nebula-people: UserCard, ContactCard, AvatarUser pattern, ActivityItem, NotificationItem.
3. @stellaria/nebula-maps: Map/GoogleMap (@vis.gl/react-google-maps como peer — API key del
   consumidor) + geocoding→NebulaField (patrón fields de TFV Map).
4. Publicación premium web de los 5 paquetes en el registry privado (versionado changesets).
5. CIERRE DE LA ETAPA WEB: docs\w6-closure.md — core web publicado (W5) + 5 premium web publicados,
   galería premium completa en playground web.

ACEPTACIÓN: verificación de instalación premium externa de los 5 (superficie web).
REPORTE: cierre de etapa web + qué queda para las superficies native (N5) + señalar al propietario
que pricing/landing comercial quedan FUERA de este roadmap.
```
