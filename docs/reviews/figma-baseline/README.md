# Baseline de diseño — Polaris medido desde los PNG locales

> Sustituye a la extracción por API de `WR1.2` mientras la cuota de Figma esté agotada, y la
> complementa después. **Las imágenes no se versionan**: viven en `.figma/` (ignorado), el refine se
> hace en local. Lo que sí está en el repo es este índice, las medidas derivadas y el instrumento.

| Artefacto                      | Ruta                                            | Versionado        |
| ------------------------------ | ----------------------------------------------- | ----------------- |
| Imágenes fuente (93 PNG, 7 MB) | `.figma/`                                       | ❌ (`.gitignore`) |
| Medidas derivadas              | `docs/reviews/figma-baseline/measurements.json` | ✅                |
| Tabla tipográfica de Geist     | `docs/reviews/figma-baseline/type-scale.json`   | ✅                |
| Instrumento                    | `tools/figma-measure/`                          | ✅                |

---

## 1. La escala es 1:1, y está verificada

Los PNG se exportaron **sin escalar**: un píxel de imagen es un píxel de diseño. No es una suposición,
son dos anclas independientes contra los valores que
[`geometria-figma-vs-nebula-2026-07-28.md`](../geometria-figma-vs-nebula-2026-07-28.md) sí llegó a
sacar por API antes del 429:

| Elemento                              | Medido en el PNG                               | API (julio)                  |
| ------------------------------------- | ---------------------------------------------- | ---------------------------- |
| `Pagination Item`, alto de la píldora | **27 px**                                      | ~27 px (hug: 6+6 + texto 12) |
| `Metric Card`, grosor de borde        | **1 px** (752×120 sobre un relleno de 750×118) | 1 px                         |

**Cómo re-verificar antes de fiarte de una hoja concreta**: busca en ella un borde que el diseño
declare de 1 px y comprueba que mide 1 píxel. Las dos anclas cubren dos hojas de noventa y tres; el
export fue en lote y el cromo de Figma es idéntico en todas, pero la comprobación cuesta un minuto.

## 2. Qué contiene cada hoja

Cada PNG es una **hoja de variantes con los dos esquemas**, no un componente suelto. El reparto
light/dark cambia según la hoja:

- **Apilado** (`Button`, `Field`, `Badge`, `Checkbox`…): mitad superior light, mitad inferior dark.
- **Lado a lado** (`Pagination Item`, `Nav Tab Bar`…): izquierda light, derecha dark.

`measurements.json` da el marco interior de cada hoja, así que la mitad se calcula dividiendo por el
eje correspondiente. Eso convierte cada hoja en **evidencia directa de la relación entre temas**, que
es justo lo que la rúbrica de WR2 pide verificar en los cuatro.

### El cromo de Figma está dentro de la imagen

Cada export trae el chip con el nombre, un marco gris y la **línea magenta discontinua** de selección.
El instrumento detecta la magenta y devuelve el marco interior; todo lo que hay fuera se descarta. El
offset del chip varía entre hojas (40–140 px) y **no indica escala**: es dónde estaba el rótulo.

## 3. Cómo se mide la tipografía sin estimar

El propietario confirma que **la familia del diseño es la que Nebula carga hoy** (Geist Variable,
`@fontsource-variable/geist`). Con la familia fija, el tamaño se deduce del rasterizado:

```bash
cd tools/figma-measure
node type-scale.mjs "Placeholder"     # tabla + anchos de tinta de esa cadena
```

Devuelve dos cosas:

1. **Alto de tinta por tamaño y peso.** El par `(cap, x)` desambigua lo que el alto de mayúscula solo
   no puede: `(7,5)=10` · `(8,6)=11` · `(9,6)=12` · `(9,7)=13` · `(10,8)=14` · `(11,9)=16`.
2. **Ancho de tinta de una cadena concreta**, que es el discriminante fuerte. Para «Placeholder»:
   53 px a 10 · 59 a 11 · 64 a 12 · 69 a 13 · 75 a 14 · 85 a 16. Mides el ancho del run en el PNG y
   solo un tamaño encaja.

El método es **medición, no estimación**: se compara el rasterizado del PNG contra el rasterizado de
la misma cadena en la misma fuente. Lo que no se puede sacar de una imagen es el `line-height`, que
no deja tinta: eso queda como NO MEDIDO hasta que vuelva la API.

## 4. Primeras medidas ya extraídas

Salen de `measurements.json` y sirven de ejemplo de lo que el instrumento da sin trabajo manual:

| Componente        | Medida                                                                              |
| ----------------- | ----------------------------------------------------------------------------------- |
| `Field`           | Input **168 px** de ancho; el halo de foco añade **4 px por lado** (176 contra 168) |
| `Pagination Item` | Píldora **27 px** de alto; la deshabilitada mide **36×27**                          |
| `Metric Card`     | Relleno **750×118**, borde **1 px**                                                 |
| `Divider`         | Marco 318×182 → **90 px** por esquema                                               |

## 5. Mapeo Polaris → familia de WR2

De las 93 hojas, ~40 son componentes de sistema con equivalente en Nebula y ~50 son **piezas de
dominio** (Invoice Row, Warehouse Card, Client Card, Production Stage…). Las de dominio **no se
descartan**: son la mejor evidencia de composición —cómo el diseño combina las piezas del sistema en
algo real—, que es lo que la sección «Coherencia de familia» busca.

| Familia WR2                      | Hojas de referencia                                                                                                                                                                                                                                                                                                              |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **WR2.1** Layout y superficie    | Divider, Template, Toolbar, Sidebar, Sidebar Company, Sidebar Warehouse, Chat Panel, Notifications Panel, Permission Section, Brand Panel/Auth                                                                                                                                                                                   |
| **WR2.2** Tipografía y contenido | Text, Title, Link, Section Label, Keyboard Hint                                                                                                                                                                                                                                                                                  |
| **WR2.3** Acciones y navegación  | Button, Icon Button, Breadcrumbs, Pagination, Pagination Item, Stepper, Stepper Step, Nav Tab Bar, Nav Tab Item, Sidebar Nav Item, Menu Item, Mobile Header, Header                                                                                                                                                              |
| **WR2.4** Campos de formulario   | Field, FieldSearch, FieldSelect, FieldPills, Checkbox, Radio, Toggle, Pill, Pills, Role Chip, Strength Meter, Image Upload Zone                                                                                                                                                                                                  |
| **WR2.5** Colecciones y overlays | Modal, User Options Menu, Floating Indicator                                                                                                                                                                                                                                                                                     |
| **WR2.6** Datos y feedback       | Badge, Avatar, Status Icon, Toast, Error Banner, Empty State, Table Header, Metric Card, Plan Card, Module Card, Service Card, Provider Card, User Card, Client Card, Company Card, Address Card, Billing Account Card, Warehouse Card, Notification Item, y todas las filas de dominio (`* Row`, `* Entry`, `* Node`, `* Item`) |
| **WR2.7** Fechas y media         | Map, Warehouse Map, Chat Message, Logo                                                                                                                                                                                                                                                                                           |
| **WR2.8** Efectos y DnD          | — (el diseño no cubre esta familia; queda NO MEDIDO)                                                                                                                                                                                                                                                                             |

## 6. Cómo usar el instrumento

```bash
cd tools/figma-measure
pnpm install

# Windows: apunta al Chromium que ya instaló Playwright
export FIGMA_MEASURE_CHROME=".../ms-playwright/chromium-1228/chrome-win64/chrome.exe"

node measure.mjs                 # las 93 hojas -> measurements.json
node measure.mjs "Button.png"    # una sola
node type-scale.mjs "Etiqueta"   # tabla tipográfica + anchos de esa cadena
```

`measure.mjs` devuelve, por hoja: dimensiones, marco interior tras descartar el cromo de Figma, y la
caja envolvente de cada color relevante con su porcentaje de área. Con eso salen anchos, altos y
grosores de borde. **Los paddings y gaps por elemento no salen solos**: hay que acotar la región y
volver a medir, y eso es el trabajo por familia de WR2 — ahora con instrumento en vez de a ojo.

## 7. Lo que sigue sin poder medirse aquí

- **`line-height`**: no deja tinta.
- **Tokens con nombre**: la imagen da el valor, no si el diseño lo llamó `space-3` o `12`. Saber si
  el diseño tiene una escala nombrada requiere la API o el export de variables.
- **Estados no dibujados**: si una hoja no pinta el `disabled`, no existe para esta auditoría.

Los tres se resuelven cuando vuelva la cuota (**~2026-08-02**) o si se exportan las variables a JSON
desde Dev Mode, que no consume API.
