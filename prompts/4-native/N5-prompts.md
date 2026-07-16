# Prompts N5 — Componentes premium (superficie native) + cierre premium

> 2 prompts secuenciales. Requiere N4 cerrado (core native publicado) y W6 cerrado (premium web + registry privado ya operativos). Cierra la etapa native y el programa premium completo.

---

## Prompt N5.1 — `commerce` + `sales` (native)

```
Actúa como desarrollador de los dominios premium en C:\Users\Skr13\Documents\GitHub\Nebula.
N4 cerrado (core native publicado); W6 cerrado (premium web + registry operativos).

LEE ANTES: docs\00-inventory.md §1.18, los paquetes premium existentes en packages\domains\ (sus
entidades duck-typed y contratos YA están definidos desde W6 — tu trabajo es la superficie native
con PARIDAD de API, no rediseñar), docs\04-migration-map.md §2 (anatomía native), el lint de paridad
W/N (de N1).

MISIÓN — superficie NATIVE de:
1. @stellaria/nebula-commerce: ProductCard, PriceTag, StockIndicator, CartItem, CartSummary,
   Categories/Category patterns (mismo contrato que web; layout/gestos nativos).
2. @stellaria/nebula-sales: OrderCard, InvoicePreview, ReceiptPreview, ReceiptView, NumPad (teclado
   POS táctil), **Scanner sobre @stellaria/nebula-native-camera** (QR/barcode — evalúa el módulo de
   detección y pregunta si añade dependencia), ShipmentTracker, ShippingCalculator.
3. Testing contract + stories en playground native (sección Premium) + lint de paridad W/N en verde
   para todos los componentes premium WN.

ACEPTACIÓN: ambos paquetes con superficie dual completa; paridad verificada; instalación premium
externa en app Expo de prueba.
REPORTE: paridad por componente + decisiones native-específicas (gestos, haptics).
```

## Prompt N5.2 — `payments` + `people` + `maps` (native) + cierre premium

```
Actúa como desarrollador de los dominios premium en C:\Users\Skr13\Documents\GitHub\Nebula.
N5.1 cerrado.

LEE ANTES: los mismos docs de N5.1.

MISIÓN — superficie NATIVE de:
1. @stellaria/nebula-payments: CardSubscription/planes, checkout summary, payment status patterns.
2. @stellaria/nebula-people: UserCard, ContactCard, AvatarUser, ActivityItem, NotificationItem.
3. @stellaria/nebula-maps: evalúa el motor native (react-native-maps vs expo-maps vs webview) —
   PREGUNTA con comparativa antes de añadir la dependencia; geocoding→NebulaField con paridad web.
4. Publicación de las superficies native de los 5 paquetes (bumps changesets en el registry privado).
5. CIERRE PREMIUM Y DE LA ETAPA NATIVE: docs\n5-closure.md — los 5 paquetes premium duales
   publicados; galería premium completa en AMBOS playgrounds; resumen del catálogo total de Nebula
   (core web + core native + 5 premium duales + native-camera).

ACEPTACIÓN: verificación de instalación premium externa (web y native) de los 5; lint de paridad
premium en verde.
REPORTE: cierre + estado comercial (qué falta para vender — fuera de roadmap) + handoff a la etapa
Review (5-review/R-prompts.md).
```
