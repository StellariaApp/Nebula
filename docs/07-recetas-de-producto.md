# 07 — Recetas de producto: cómo se compone un producto de Stellaria con Nebula

> **Para quién.** Para el que construye o alinea un producto —landing, panel o los dos— con
> `@stellaria/nebula-web`. Es la respuesta a «¿cómo se usa esto bien?» pieza por pieza, y la
> rúbrica contra la que se audita un producto (`prompts/6-consumidores/C3-alineacion-visual.md`).
>
> **De dónde sale.** De Rosette en producción (Nebula 1.1.13, leído el 2026-09-12), contrastado
> con Stellaria, Polaris e Iris. Cada receta es lo que un producto real hace hoy y **por qué**; los
> «errores vistos» son fallos que ya costaron una sesión a alguien. Donde este doc contradiga al
> código de un componente, gana el código y se abre un hallazgo.
>
> **Qué NO es.** No es el lenguaje visual (eso es `06-visual-language.md`), ni el contrato de tema
> (`02-theming.md`), ni la plantilla para escribir componentes (`patterns/`). Tampoco sustituye a
> `stellaria-ui/`: aquella es dirección de marca en vocabulario pre-catálogo; ésta es la
> composición con los componentes que existen.

---

## 0 · Antes de usar un componente: dónde se lee

Un componente de Nebula tiene **cuatro fuentes**, y se leen en este orden:

| Orden | Fuente                                                                                         | Qué responde                                                                                                                                               |
| ----- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1     | `packages/web/src/components/<Nombre>/<Nombre>.md`                                             | **El porqué**: decisiones, ranuras, lo que no hace a propósito. 89 componentes lo tienen. ADR-019 prohíbe comentarios en el código, así que aquí está todo |
| 2     | `packages/web/src/components/<Nombre>/<Nombre>.types.ts`                                       | El contrato exacto de props, con `\| undefined` en las opcionales                                                                                          |
| 3     | `apps/playground-web/src/stories/<Nombre>.stories.tsx` → `Composition`, `AllThemes`            | Cómo se ve en contexto real, en los dos esquemas. `pnpm --filter playground-web dev` → :6006                                                               |
| 4     | `nebula.stellaria.app` → _Getting started_ (`installation`, `styling`, `rsc`, `accessibility`) | Las cuatro reglas del consumidor: qué instalar, qué gana (style props), qué corre en servidor, qué a11y trae                                               |

Y **este documento** es el quinto: cómo se combinan entre sí para formar un producto.

Precedencia si dos fuentes discrepan: `.types.ts` > `.md` > este doc > `stellaria-ui/`.

---

## 1 · Reglas transversales (aplican a toda receta)

1. **Props de estilo antes que CSS.** `p`, `r`, `gap`, `maw`, `flex`, `c`, `fz`, `display={{ base, phone, tablet, laptop }}`. vanilla-extract sólo para lo que las props no alcanzan: máscaras, selectores internos, `grid-template` con `auto-fit`, transiciones con `vars.motion`.
2. **Cero hex, cero px de altura, cero transición a mano.** Colores por rol (`primary.600`, `text.muted`, `surface.sunken`, `border.default`, `text.primary.70`); alturas de `vars.size.control.*` o de un `metrics.ts` con la suma escrita; motion de `vars.motion.duration.*` / `easing.*`.
3. **Servidor por defecto.** Un componente de cliente arrastra a cliente todo lo que renderiza. Islas mínimas: el armazón (átomos de carril y scroll), la nav (cajón móvil), el compositor, la puerta de edad. Lo demás, servidor con `GetDictionary`.
4. **`component={Link}` no cruza la frontera servidor → cliente.** Compila y revienta en producción («Functions cannot be passed directly to Client Components»). Un servidor que quiere un enlace con aspecto de botón usa una cáscara de cliente (`ButtonLink`, `TextLink`, `ActionLink`) o `component="a"` sin prefetch.
5. **El CSS global va en `@layer`** y debajo de las capas de Nebula. Una hoja sin capa que toque `*`, `html`, `body`, `a` o `button` **gana siempre** a Nebula, en silencio. Lo único global del producto: un `base.css` de ~15 líneas en `@layer legacy` (box-sizing, margin 0, antialiasing).
6. **El tema es una semilla, no un fichero de 627 valores.** `BuildProduct(SEED, scheme)` + `CompileThemes` → clases. Ver §3.
7. **Los iconos son un registro tipado.** `CreateIcons({ ...AllIconsPack, ...propios })` en `src/theme/icons.tsx`; `IconName` derivado. Pedir un icono que no existe no compila.
8. **Un `h1` por pantalla**, y es el título de la cabecera. Las tarjetas llevan `order={3}`.
9. **Cifras, ids, fechas y contadores en `ff="mono"`.** Nombres y planes en sans.
10. **Copia:** español seco, minúscula tras dos puntos, sin exclamaciones ni disculpas, y **una pantalla nunca habla de otra**.

---

## 2 · La raíz

**Cuándo.** Siempre. Es idéntica en los cuatro productos y no tiene variantes.

```tsx
// src/app/layout.tsx
import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";
import "@stellaria/nebula-web/styles.css";
import "./base.css"; // @layer legacy, ~15 líneas

<html lang={locale} suppressHydrationWarning data-scroll-behavior="smooth">
  <head>
    <ThemeScript
      defaultScheme="dark"
      defaultTheme={THEME_NAME}
      themesCSS={CSS}
      themesClasses={CLASSES}
    />
  </head>
  <body className={classes.body}>
    {" "}
    {/* bg surface.base · color text.primary · font sans · minHeight 100dvh */}
    <NebulaProvider
      applyTheme="root"
      defaultTheme={{ theme: THEME_NAME, scheme: "dark" }}
      themes={THEMES}
    >
      <ProviderJotai preferences={preferences}>{children}</ProviderJotai>
    </NebulaProvider>
  </body>
</html>;
```

**Reglas.**

- `ThemeScript` en `<head>` pinta la clase antes del primer frame; sin él la página nace en el tema por defecto hasta hidratar.
- Ni `Nav` ni `Footer` aquí: el armazón público y el del panel son hermanos y no comparten nada.
- Fuentes por `@fontsource-variable`, no por `next/font`: el tema las expone como `vars.font.family.sans` / `.mono`.
- Idioma: **en la ruta** para lo público (`/[lang]/…`, `generateStaticParams` + `dynamicParams=false`) y **por cookie** en el panel. Leer `cookies()` en un layout prerenderizado saca la ruta entera de estático.

**Errores vistos.** Poner el provider bajo un ancestro con `transform` (rompe `position: fixed` de los overlays; lo dice `installation.mdx`). Importar `vars` desde `@stellaria/nebula-web` (sale de `@stellaria/nebula-themes/web` desde ADR-168).

---

## 3 · El tema del producto

**Cuándo.** Un producto = una semilla. Si la marca cae cerca de uno de los 16 del catálogo, se adopta (`@stellaria/nebula-themes/<tema>/web`) y se deja escrito por qué.

```ts
// src/theme/_seed.ts
export const SEED = {
  name: "producto",
  primary: palettes.rose,  accent: palettes.pink,
  from: palettes.rose["500"], to: palettes.rose["400"],   // el degradado de marca
  tint: palettes.rose["900"],                             // el lavado del lienzo
  wash: 0.009, lift: { base: -14, sunken: -8, raised: -6, overlay: -8 },
  glass: "sheer", inkFloor: 2, angle: 100,
} satisfies ThemeSeed;
export const Producto = (scheme: ColorScheme) => BuildProduct(SEED, scheme);

// src/theme/index.ts
export const THEME_NAME = "producto";  export const THEME_SCHEME = "dark" as "dark" | "light";
const COMPILED = CompileThemes({ [THEME_NAME]: { dark: Producto("dark"), light: Producto("light") } });
export const { classes: CLASSES, css: CSS, base: BASE } = COMPILED;
export const THEMES = { [THEME_NAME]: { dark: { theme: dark, className: CLASSES.producto.dark }, light: { … } } };
```

**Reglas.**

- **Del producto es sólo el color**: `primary`, `accent`, `from`, `to`, `tint`. Lo demás (`wash`, `lift`, `glass`, `ramp`, `inkFloor`) es del sistema.
- Dark-first: `THEME_SCHEME = "dark"` en los cuatro productos.
- Paletas propias con `pnpm gen:palette from "#hex" --name x`; validación con `pnpm check:contrast -- --theme x.json`. Nebula sólo certifica AA para `nebula`; si el producto quiere AA, exige 0 FAIL y ajusta `inkFloor`.
- Para SVG de marca (logo, fondos) usa `vars.gradient.brand.edge / .tip / .image`, nunca `primary.500 → accent.500`.

**Decisión pendiente del propietario.** Los cuatro productos discrepan hoy en lo que no es color: `wash` 0.009 / 0.08 / 0.09 / 0.05; `lift.base` −14 / −6 / +12 / +6; `glass` sheer en tres. Por el principio de WB debería ser un solo juego de valores. Mientras no se cierre, un producto nuevo copia los de Rosette y lo anota.

**Errores vistos.** `ThemeSeed.name` está tipado como la unión cerrada de los 16 nombres: un nombre de producto pide `as SeedName` (hallazgo abierto). `assignInlineVars` en la raíz mete 40 kB de `style` y borra la clase del script.

---

## 4 · El armazón público (landing)

### 4.1 `Main`

```tsx
// src/app/[lang]/(landing)/layout.tsx
<JsonLd schema={organization} /> <JsonLd schema={website} />
<Main
  background={<StarField aurora density="md" fixed parallax />}
  header={<PublicNav />} footer={<PublicFooter />}
  withSkipLink skipLabel="Saltar al contenido"
  bounce momentum smooth
  contentProps={{ mih: "100vh", justify: "flex-start" }}>
  {children}
  <DockSettings />
</Main>
```

`Main` trae el `<main>`, el skip link, el fondo fijo y el scroll con física. **Aviso**: `momentum` escribe la posición ~60 veces por segundo; dos productos quitaron `smooth` porque «se pelean» y dos lo llevan. Mide en el tuyo y deja escrito cuál.

### 4.2 `Nav`

```tsx
<Nav aria-label={nav.aria} component="header" floating>
  <Nav.Logo aria-label={nav.home} component={HomeLink} href="/">
    <Logo height={24} />
  </Nav.Logo>
  <Nav.Links active={active} aria-label collapse="tablet" justify="flex-start" overflowMenu>
    {links.map((l) => (
      <Nav.Links.Link active={l.href === active} component={Link} href={l.href} key={l.href}>
        {l.label}
      </Nav.Links.Link>
    ))}
  </Nav.Links>
  <Nav.Actions collapse="tablet">
    <Button component={Link} href={cta.href} size="sm" variant="gradient">
      {cta.label}
    </Button>
  </Nav.Actions>
  <Burger closeLabel openLabel onChange={setMenu} opened={menu} showBelow="tablet" size="sm" />
  <Nav.Sidebar
    closeLabel
    collapse="tablet"
    footer={<Cta />}
    label
    onClose={() => setMenu(false)}
    opened={menu}
  >
    …los mismos enlaces…
  </Nav.Sidebar>
</Nav>
```

**Reglas.**

- Flotar, encogerse y ponerse de cristal al desplazar **lo hace `floating`**. No se escribe un listener de scroll para la nav. Nunca.
- `active` = el href **más largo** que prefija el pathname por tramos (`/a` no enciende `/ab`; `/` no enciende todo). `Nav.Links` tiene `activeMode="pathname"|"hash"|"auto"`: úsalo antes de calcularlo a mano.
- `HomeLink`: si ya estás en esa ruta, `preventDefault` + `scrollTo(0)` + `replaceState` — «volver arriba» en vez de renavegar.
- `nav.tsx` es de servidor; las islas son el logo, los enlaces, el burger y el cajón (`nav-client.tsx`). El estado del cajón es un átomo (`NavMenuAtom`).
- **Decisión pendiente**: tres productos llevan `floating sticky contentWidth={1152}` y uno sólo `floating`. ADR-070 da 1180 por defecto a Nav/Section/Hero/Footer; el 1152 a mano puede ser reliquia. Mide a 1280 y 1600 y pregunta.

### 4.3 El dock de preferencias

```tsx
<Dock aria-label={dock.aria} triggerLabel={dock.aria}>
  {(stacked) => (
    <>
      <Flex direction={stacked ? "column" : "row"} gap="sm" w={stacked ? "100%" : undefined}>
        <Select
          size="sm"
          aria-label
          data={idiomas}
          value={locale}
          onChange={CambiarIdioma}
          w={stacked ? "100%" : 72}
        />
        <Select
          size="sm"
          aria-label
          data={monedas}
          value={currency}
          onChange={CambiarMoneda}
          w={stacked ? "100%" : 85}
        />
      </Flex>
      {stacked ? tema : <Tooltip label={dock.theme} trigger={tema} />}
    </>
  )}
</Dock>
```

`Dock` (ADR-193) es la caja: el `Affix` abajo a la derecha, las dos superficies de cristal con `data-floating="dock"` y el pliegue bajo `phone` en un botón que abre los mismos controles apilados en un `Popover`. Los controles son del producto y se pintan dos veces —fila y columna— vía la función de `children`. Tres controles en fila miden ~300 px y un móvil tiene 390: por eso se recogen. Cambiar idioma **navega** (`router.replace(LocalePath(next, StripLocale(pathname)))`) y guarda cookie; cambiar moneda es `router.refresh()`. Sesión **no** va en el dock de la landing.

### 4.4 `Footer`

```tsx
<Footer glass>
  <Footer.Brand
    aria-label
    component={Link}
    description={footer.descriptor}
    href="/"
    logo={<Logo height={22} />}
  />
  {footer.groups.map((g) => (
    <Footer.Group key title={g.title}>
      {g.links.map((l) => (
        <Footer.Group.Link component={Link} href>
          {l.label}
        </Footer.Group.Link>
      ))}
    </Footer.Group>
  ))}
  <Footer.Legal>
    <Text c="text.muted" fz="caption">
      {footer.legal}
    </Text>
  </Footer.Legal>
</Footer>
```

---

## 5 · La landing: secciones, hero y tarjetas

### 5.1 La sección — `Section` (o su envoltorio `Band`)

```tsx
<Section id reveal py="xxxl" glass={alterna}
         align="flex-start" | "center"  ta="left" | "center"
         title={eyebrow ? <Flex direction="column" gap="md"><Badge variant="light" w="max-content" ml={-10}>{eyebrow}</Badge>{title}</Flex> : title}
         description={description}>
  {una composición}
</Section>
```

**Reglas.**

- Cada sección abre con eyebrow → título → descripción y contiene **una** composición: `SimpleGrid` de tarjetas, split texto + visual, banda de `Stat`, o CTA de cierre. No más de tres tipos por landing.
- Las secciones **alternan** sin cristal → con cristal → sin cristal.
- La entrada es `reveal` de `Section`; los hijos escalonan con `reveal={{ index }}`. No se escribe un `IntersectionObserver`.
- `Section` trae además `actions`, `aside`, `footer`, `divided`, `loading`, `error`, `empty` + `isEmpty`, `contentWidth`, `size`: úsalos antes de envolverla.
- **Desde ADR-189** `Section` lleva `eyebrow` (un `Badge` light antes del título, fuera de él) y `align="center"`: `band.tsx` sobra y se retira; `<Band eyebrow title align glass>` es `<Section eyebrow title align glass reveal py="xxxl">`.

### 5.2 La tarjeta de rejilla

```tsx
<SimpleGrid cols={{ base: 1, tablet: 2, laptop: 3 }} gap="md">
  {items.map((item, index) => (
    <Card key h="100%" p="lg" r="lg" variant="glass" glass="strong" reveal={{ index }}>
      <Flex direction="column" gap="xs">
        <Flex c="primary.600" gap="sm" align="center">
          <Icon name={ICONS[index]} size={22} />
          <Title fz="h5" order={3}>
            {item.title}
          </Title>
        </Flex>
        <Text c="text.muted" fz="body2">
          {item.description}
        </Text>
      </Flex>
    </Card>
  ))}
</SimpleGrid>
```

Siempre la misma. Los iconos van en un array constante por sección. **Error visto**: las vars de columnas de `SimpleGrid` **se heredan** en rejillas anidadas; declara los cinco puntos de ruptura en la hija.

### 5.3 El hero

```tsx
<Hero
  id="home"
  size="xl"
  mih="860px"
  contentWidth={620}
  gap={{ base: "xxxl", laptop: "xxl" }}
  hiper={
    <Flex gap="xs" wrap="wrap">
      <Badge variant="gradient">{badge}</Badge>
      <Badge variant="light">By Stellaria</Badge>
    </Flex>
  }
  title={
    <>
      {title}
      <br />
      <GradientText>{accent}</GradientText>
    </>
  }
  description={description}
  actionsProps={{ w: "100%", wrap: "wrap" }}
  actions={
    <>
      <ButtonLink href miw={{ base: "100%", phone: 140 }} size="lg" variant="gradient">
        {primary}
      </ButtonLink>
      <ButtonLink
        href
        miw={{ base: "100%", phone: 140 }}
        size="lg"
        variant="glass"
        rightSection={<Icon name="chevron-right" size={18} />}
      >
        {secondary}
      </ButtonLink>
    </>
  }
  right={
    <Card
      variant="glass"
      gradientBorder={{ beam: true }}
      r="xl"
      p="none"
      className={animations.idle}
    >
      <Cutout background priority />
    </Card>
  }
/>
```

**Reglas.** `gradientBorder={{ beam: true }}` es el acento **escaso**: hero, cierre, consentimiento, login. Nunca en una rejilla. `animations.idle` (flotado ±8 px / 2 s) es la única animación CSS propia que un producto se permite. **Error visto**: la ranura `right` es `flex-shrink: 0; max-width: max-content`; una imagen sin `maw="100%"` empuja el hero fuera del viewport en escritorio y no se ve en móvil.

### 5.4 Botones

| Papel                | Receta                                      |
| -------------------- | ------------------------------------------- |
| Principal            | `variant="gradient"` — **uno** por pantalla |
| Secundario           | `variant="glass"`                           |
| Terciario / en línea | `variant="ghost"` o `variant="light"`       |
| Icono que actúa      | `ActionIcon` (no acepta `component`)        |
| Icono que navega     | `Anchor` / `ActionLink`                     |

Variantes que existen: `filled · outline · light · glass · ghost · glow · gradient`. No existe `subtle`.

---

## 6 · El armazón del panel — `AppShell` en carril

### 6.1 El layout

```tsx
// src/app/dashboard/layout.tsx  · metadata: robots noindex
<App>{children}<Consent decided /><SignInModal providers /><Suspense fallback={null}><SignInOnParam /></Suspense></App>

// App — NO es async: el armazón se pinta ya y barra y página salen a la API a la vez
<Shell sidebar={<Sidebar aria-label="Navegación principal">
                  <Suspense fallback={<MenuSkeleton />}><Menu /></Suspense>
                  <Suspense fallback={<FooterSkeleton />}><Footer /></Suspense>
                </Sidebar>}
       mainProps={{ direction: "column", overflow: "hidden", position: "relative" }}>
  <VisuallyHidden><p>{TITLE}</p></VisuallyHidden>
  {children}
  <ToastProvider position="bottom-end" closeLabel regionLabel />   {/* el ÚNICO del producto */}
</Shell>

// Shell (cliente)
<AppShell overflow="hidden" sidebarCollapsed={mini}
          backdrop={<StarField aurora density="sm" fixed parallax scroller={refScroll} />} …/>
```

Dos `Suspense` porque tardan cosas distintas. El `StarField` hace parallax contra el contenedor que scrollea **en la pantalla** (por eso `Scroll` publica su ref en un átomo), no contra la ventana.

### 6.2 La barra

```tsx
<AppShell.Sidebar collapsed={mini} collapseLabels={{ collapse, expand }} onCollapse={setMini}
                  toggleProps={{ display: { base: "none", laptop: "block" } }}>
  <AppShell.Sidebar.Header>
    <Flex component={Link} href="/" display={{ base: "none", tablet: "flex" }} …>   {/* el sello ES el enlace a inicio */}
      <Mark size={30} />
      <AppShell.Label><Text fw="semibold" fz="body2" truncate>Dashboard Producto</Text><Text c="text.muted" fz="body2">Plan …</Text></AppShell.Label>
    </Flex>
    <Flex display={{ base: "flex", tablet: "none" }}><SelectorDeOrganizacion /></Flex>   {/* sólo en la tira */}
  </AppShell.Sidebar.Header>

  <AppShell.Sidebar.Body className={strip}>                    {/* strip: máscara de fundido, ver 6.3 */}
    {grupos.map((g) => (
      <AppShell.Links key title={g.title} display={g.mobile ? { base: "flex", tablet: "none" } : undefined}>
        {g.links.map((l) => (
          <AppShell.Link active={l.href === active} component={Link} href={l.href} key
            label={<AppShell.Label><span className={labelShort}>{l.short}</span><span className={labelLong}>{l.label}</span></AppShell.Label>}
            leftSection={<Icon name={l.icon} size={20} />}
            rightSection={l.count ? <Badge color="accent" size="xs" variant="light" w={20}>{l.count}</Badge> : undefined} />
        ))}
      </AppShell.Links>
    ))}
  </AppShell.Sidebar.Body>

  <AppShell.Sidebar.Footer p={{ base: "xs", laptop: "sm" }}>
    <Popover withArrow placement="right" width={250} offset={20} shadow="md"
             trigger={<Button variant="ghost" flex={1} h="100%" …><Avatar size={38} src name /><AppShell.Footer.Content>…nombre · saldo en mono · chevron-up…</AppShell.Footer.Content></Button>}>
      …idioma · moneda · tema (Segment) · Divider · entrar/salir (Button variant="light" fullWidth)…
    </Popover>
  </AppShell.Sidebar.Footer>
</AppShell.Sidebar>
```

**Reglas.**

- Activo = el href más largo que prefija el pathname por tramos. **Desde ADR-190** lo hace `AppShell.Sidebar activeMode="pathname"` entre todos los grupos; `ActiveRail` a mano sobra.
- La estructura de enlaces **es una función del diccionario** (`title`, `label`, `short`, `href`, `icon`, `count`, `mobile`). No hay otra lista de rutas.
- En el panel **no hay dock flotante**: idioma, moneda, tema y sesión viven en el popover del pie.
- Esqueletos con la geometría **exacta** (sello 30, textos 12/10, avatar 38, nueve filas de 20) para que al llegar no se mueva nada.

### 6.3 Los tres estados del carril

| Ancho           | Forma                                                                                                                                                                          |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `< tablet`      | **Tira horizontal abajo** (es el mismo `Sidebar`: ADR-183/184/185). Etiqueta corta, iconos, máscara de fundido a los lados, grupo «Inicio» visible. Se auto-desplaza al activo |
| `tablet…laptop` | Carril mini, sin botón de encoger                                                                                                                                              |
| `≥ laptop`      | Carril entero con etiquetas, plan, avatar + saldo y el botón                                                                                                                   |

**Regla medida.** Cada entrada del carril es una pestaña de la tira del móvil y se paga en píxeles: con seis, a 360 px caían dos fuera. Cuenta las tuyas antes de añadir una sección.

**Error visto.** El carril encogido deja los enlaces sin nombre accesible (`AppShell` oculta el cuerpo del `NavLink` y descarta `aria-label`). Sigue abierto en 1.1.13; lo cierra ADR-191. Rodeo mientras tanto: `VisuallyHidden` colgado de `rightSection`.

---

## 7 · La pantalla y sus cabeceras

### 7.1 `Screen` — toda pantalla del panel

```tsx
<Scroll display="flex" direction="column" flex={1}>
  {" "}
  {/* momentum bounce smooth + publica scrollTop>0 */}
  {hasHeader && (
    <AppShell.Section position="sticky" top={0} z="sticky" aria-label={title}>
      {" "}
      {/* UNA sola sección pegada */}
      <Flex data-floating="header" direction="column" gap={0} w="100%">
        <AppShell.Header
          actions={actions}
          order={1}
          subtitle={subtitle}
          title={title}
          titleProps={{ fz: "h5" }}
          subtitleProps={{ fz: "body3", c: "text.muted" }}
        />{" "}
        {/* h5 semibold · body3 apagado */}
        {crumbs && <AppShell.Subbar>{crumbs}</AppShell.Subbar>} {/* la miga DEBAJO del título */}
        {header} {/* lo que cuelga: ver 7.3 */}
      </Flex>
    </AppShell.Section>
  )}
  <Flex flex={1} p={padded ? { base: "sm", tablet: "lg" } : undefined}>
    {children}
  </Flex>
</Scroll>;
{
  footer;
}
{
  /* fuera del scroll: barra de acción fija */
}
```

**Reglas.** `AppShell.Header` pinta por defecto `h6` / `body2 text.secondary`; la norma del producto (§13) es `h5` / `body3 text.muted`, así que `Screen` pasa `titleProps` y `subtitleProps` **una vez** y ninguna pantalla vuelve a tocarlos (decisión del propietario, 2026-09-12). Relleno `sm` en móvil y `lg` desde tablet; excepciones: el feed (a sangre) y las barras de filtro (pegadas, borde inferior). La miga va en `AppShell.Subbar` **debajo** del título: encima empujaba el nombre a la segunda línea. Migas con `Breadcrumbs items labels size="sm"` y `component: Link` por item.

### 7.2 El interruptor de scroll

`Scroll` escucha `scroll` en **su propio contenedor** y escribe `ScrolledAtom = scrollTop > 0`. Umbral cero a propósito: con 80 px la cabecera tardaba un octavo de pantalla en responder y se leía como un salto. Es el único interruptor del panel; todas las cabeceras que se encogen lo leen.

**Desde ADR-187** el interruptor es del armazón: la pantalla scrollea dentro de `AppShell.Scroll` (el `Scroll` del catálogo con `momentum bounce smooth`, que adopta el papel al montar) y las cabeceras leen `useAppShellScroll().scrolled`; `ref` del mismo hook alimenta el `StarField scroller`. `Scroll` propio, `ScrolledAtom` y `RefScrollAtom` sobran. `useScrolled` acepta ahora `scroller` para cualquier otro contenedor.

### 7.3 La cabecera que se encoge

**Cuándo.** Pantallas largas cuya identidad y acciones tienen que seguir a la vista: ficha de un elemento, asistente por pasos, perfil público.

```tsx
const { scrolled } = useAppShellScroll(); // ADR-187

// en la pantalla: la sección pegada cuelga la cabecera y reserva su alto
<AppShell.Section position="sticky" top={0} z="sticky" hanging={<SheetHeader />} hangingHeight={SHEET_HEADER_HEIGHT}>…</AppShell.Section>

// SheetHeader: sin absolute ni sticky propios — de eso se ocupa la sección
<GlassSurface // o <Card variant="glass" glass="strong">
  r={0}
  level="strong"
  bdw={0}
  bdbw={1}
  display="flex"
  direction="column"
  mih={scrolled ? 0 : ALTO_ENTERA} // el máximo lo fija metrics.ts
  p={scrolled ? "sm" : { base: "md", tablet: "lg" }}
  gap={scrolled ? "sm" : "md"}
  style={{
    transitionProperty: "padding, gap, min-height",
    transitionDuration: vars.motion.duration.base,
    transitionTimingFunction: vars.motion.easing.standard,
  }}
>
  <Flex align="center" gap={scrolled ? "sm" : "lg"} w="100%">
    <Avatar
      radius="md"
      size={scrolled ? 40 : 96}
      src={`${src}?q=${scrolled ? "thumb" : "small"}`}
    />
    {scrolled ? (
      <Text fw="bold" fz="body1" truncate>
        {nombre}
      </Text>
    ) : null}{" "}
    {/* sólo cuando el título de arriba ya no se ve */}
    {scrolled ? null : (
      <Group flex={1} gap="xs" wrap>
        …insignias…
      </Group>
    )}{" "}
    {/* lo que ya se leyó se va */}
    <Flex ml="auto" shrink={0}>
      {acciones}
    </Flex>{" "}
    {/* lo que se pulsa se queda SIEMPRE */}
  </Flex>
  <Segment fullWidth overflowMode="scroll" variant="light" value onChange>
    …pestañas…
  </Segment>
</GlassSurface>;
```

El cuerpo ya no se rellena a mano: `hangingHeight` reserva el máximo con un espaciador después de la sección.

```ts
// metrics.ts — sin JSX, con la cuenta escrita
/** relleno lg·2 (48) + fila (96) + hueco md (16) + Segment sm (36) + borde (1) + … = 215 */
export const SHEET_HEADER_HEIGHT = 215;
```

**Por qué así, y no de otra forma.**

- **Fuera del flujo** (`hanging` lo cuelga en `absolute; top: 100%`): en flujo, encogerse restaba 80 px al alto del scroll; lo de abajo saltaba, con contenido corto `scrollTop` volvía a 0, la banda crecía otra vez — un bucle de parpadeo.
- **Sin `sticky` propio**: la sección de `Screen` ya lo es. Dos cosas ancladas al mismo cero se pisan y gana la última pintada.
- **La animación es CSS** (`transition` sobre `padding, gap, min-height`; un `Title` que pasa de `h3` a `h6` lleva `transition: font-size`). Lo que desaparece va en `<Transition mounted={!scrolled} transition="fade">`, que respeta `prefers-reduced-motion`.
- **Números en `metrics.ts`** con la suma. Un número mágico sin cuenta caduca al cambiar un subtítulo.
- Variante «en flujo pegada bajo la miga» (ficha pública): `position="sticky" top={TRAIL_HEIGHT}` donde `TRAIL_HEIGHT` es la altura que la miga **fija**, no estima.

### 7.4 `data-floating` — el contrato de las barras

Toda barra flotante lleva `data-floating="header" | "footer" | "dock"`. `AppShell.Header` y `Subbar` pegados, `Nav floating`, `Dock` y la cabecera de `hanging` lo llevan de serie (ADR-188); lo propio del producto lo pone a mano. `useFloatingBand()` y `CenterOn(el)` de `@stellaria/nebula-hooks` miden los `header` para saber dónde acaba el **techo** y los demás para dónde empieza el **suelo**, y centran un elemento entre los dos, no en la ventana. `lib/scroll.ts` sobra.

---

## 8 · Overlays

### 8.1 El modal — un solo patrón

```tsx
<Modal aria-label blurred centered opened={opened} onClose={close} [size="xl"]
       content={
         <Card variant="glass" glass="strong" p="md" r="lg" withBorder gap={0} w="100%">
           <ButtonClose aria-label position="absolute" top right onClick={close} />
           <Title fz="h6" order={2} pr="xl">{title}</Title>
           <Text c="text.muted">{subtitle}</Text>
           …cuerpo…
           <Group justify="flex-end" gap="sm"><Button variant="ghost">Cancelar</Button><Button variant="gradient">Confirmar · 50</Button></Group>
         </Card>
       } />
```

**Reglas.**

- **«El panel lo trae la tarjeta, no el modal.»** El `<dialog>` está en la top layer y con el panel de serie los rótulos apagados salían azulados (no hereda el contexto de color del tema).
- Puerta que no se cierra (edad, consentimiento): `closeOnClickOutside={false} closeOnEscape={false} withCloseButton={false}` + `Card gradientBorder={{ beam: true }}`.
- Un confirm anuncia el coste **en el botón** («Completar · 50 rosets») desde el primer pintado, y hay **un** principal.
- Cajón: `Modal drawer="end"`. `Drawer` es lo mismo preconfigurado; `Dialog` es el ligero. No mezcles los tres en un producto.
- Modal **o** ruta dedicada es una decisión de producto (Polaris eligió rutas). Se decide una vez y se escribe.

### 8.2 Menú, popover, tooltip, toast, portal

| Necesidad                                  | Receta                                                                                                                 |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| Acciones de un elemento (⋮)                | `<Menu items={[{ key, label, icon, danger }]} onAction placement="bottom end" trigger={<ActionIcon />} />`             |
| Ajustes, filtros, volumen                  | `<Popover trigger placement offset withArrow width padding>` — el panel y el anclaje los pone él                       |
| Nombre de un icono                         | `<Tooltip label trigger={…} />` — **`trigger`, no children**                                                           |
| Aviso de algo que llegó de otra pantalla   | `nebulaToast.success(body, { title, action: <Button size="xs" variant="light" />, duration: 20_000 })`                 |
| Algo que sale del flujo sólo bajo un ancho | `<Portal disabled={!compact}>` — `Portal` no pinta en SSR y `useMediaQuery` da `false`: coinciden en el primer pintado |

Un solo `ToastProvider`, en el armazón. `Tooltip` sólo tiene `color: "neutral" | "inverted"`.

---

## 9 · Estados: vacío, error, sin sesión, cargando

### 9.1 La lámina

```tsx
<SystemState kind="empty" | "error" | "notFound" | "session" | "blocked" title={…} action={<Button variant="gradient" />} [compact]>
  {cuerpo apagado}
</SystemState>
```

Ilustración a la izquierda (**cinco, y significan cosas distintas**), título `h3`/`h5`, cuerpo `text.muted body2`, **una** acción. `flex={1}` + `alignSelf: stretch`: la lámina ocupa el hueco de lo que no se pudo pintar. Bajo `tablet` la ilustración baja al 60 %.

**Reglas.**

- `Failed` = `kind="error"` + `RetryButton` (`router.refresh()` en `useTransition`). **Un fallo de la API pintado como «vacío» es un fallo grave.**
- `SignedOut` es un estado propio (`kind="session"`), no un vacío.
- Un texto gris suelto donde tocaba una lámina es un fallo.
- Las ilustraciones son activos del producto (retrato vertical, ratio 1:2) → ranura, no de Nebula. **Desde ADR-192** la lámina es `<EmptyModule layout="side" surface="glass" fill illustration title description action>`; `system-state.tsx` se reduce al mapa `kind → activo`.
- `Section` trae `loading`, `error`, `empty` + `isEmpty` para secciones de landing con datos: úsalos ahí.

### 9.2 Esqueletos

`Skeleton h w r animation` con la **geometría exacta** de lo real, uno por rama de `Suspense`, y `loading.tsx` por ruta. El de la barra lateral es la referencia: nueve filas de 20, sello de 30, textos de 12 y 10.

---

## 10 · Listas, rejillas y filtros

- **Rejilla de tarjetas**: `SimpleGrid cols={{ base: 2, tablet: 3, laptop: 4 }} gap="md"` + una única tarjeta de medio (§11.4) para **todas** las rejillas del producto. Dos rejillas con dos tarjetas es un fallo.
- **Filtros**: evalúa primero `Filters` (declarativo: `FilterDescriptor[]` + accessors; las fechas van diferidas). El patrón compacto que usa Rosette: `SearchInput clearable debounce` que crece (`flex="1 1 220px" miw={160}`) + un `Chip checked size="sm" variant="light"` por filtro activo (al desmarcar vuelve al neutro) + contador `caption` + `Popover placement="bottom end"` «Filtros» con un `Select size="sm"` por grupo y «Limpiar» en `ghost`. El botón va `variant={activos ? "light" : "glass"}`.
- **Paginación**: `Pagination total page onChange siblings boundaries size labels`.
- **Tablas**: `Table` para lo plano; `DataGrid` (subpath) sólo si hay ordenación/virtualización de verdad.
- **Cifras**: `Stat` con etiqueta en caja normal y cifra en mono. Rosette descartó las versalitas con tracking de `Stat` porque no existen en ninguna otra pantalla: si lo usas, que sea igual en todas.

---

## 11 · Medios

| Necesidad                                | Hoy en Nebula                                                | Receta                                                                                                                                                                       |
| ---------------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Vídeo en overlay, uno                    | `Player` (`/media`, react-player)                            | `<Player src opened onClose title ratio labels />`                                                                                                                           |
| Vídeo **en línea** (rejilla, chat, feed) | `VideoPlayer` (`/media` y core, ADR-195)                     | `<VideoPlayer src poster label defer duration fill onPlaying labels />`. `defer` no monta el `<video>` hasta el play: una rejilla de 24 abría 12 ficheros                    |
| Audio / nota de voz                      | `AudioPlayer` (`/media`, ADR-195)                            | `<AudioPlayer src label labels />`. Comparte hoja con el vídeo: misma pista, mismo pulgar                                                                                    |
| Visor de fotos a pantalla completa       | `Viewer` (ADR-196); `Lightbox` sigue para el visor con panel | `<Viewer images index onIndexChange opened onClose caption actions withDownload labels />`. Sin panel, arrastre continuo, pellizco, rueda, tira `scroll-snap`. Sólo imágenes |
| Carrusel                                 | `Carousel` (`/carousel`, embla)                              | `<Carousel items getKey renderItem index onIndexChange slideSize gap align />`                                                                                               |
| Fondo + figura recortada                 | `Cutout` (ADR-197)                                           | `<Cutout background={<Image fill …/>} figure figureSize figurePosition={{ bottom, right, translate, rotate }} r="xl" />`                                                     |
| Imagen                                   | `Image` / `BackgroundImage`                                  | `alt` obligatorio; `fit`; `fallback`                                                                                                                                         |

**Prohibido**: `<video controls>` y `<audio controls>` a pelo. Pintan la barra del navegador —gris en Chrome, azul en Firefox— sobre el cristal, y no se pueden vestir.

### 11.4 La tarjeta de medio (`MediaCard`)

Una sola para todas las rejillas: marco `3/4` con `GradientBackground`, láminas que pasan solas al pasar por encima (300 ms la primera, 900 ms las demás, y `useMediaQuery("(prefers-reduced-motion: reduce)")` las para), clip de adelanto mudo, o `playable` (la tarjeta **es** un reproductor y esconde insignias, menú y pie mientras corre, vía `onPlaying`). Esquinas: rótulos que sólo se leen (`cornerStart/End`) y botones que se pulsan (`action/actionStart`) **no comparten esquina**. Pie de cristal con avatar 30 + nombre `body2` + subtítulo `caption`. `href` o `onOpen`, nunca los dos. Desde ADR-198 es `MediaCard` del core: `frames` ya resueltos, `clip`/`playable`, `cornerStart/End`, `action/actionStart`, `avatar`, `title`, `subtitle`, `count`, `ceiling`, y `href` (con `component={Link}`) **o** `onOpen`.

---

## 12 · Formularios y navegación interna

- Campo = `FormField` raíz con `label`, `description`, `error`, `errorDisplay`, `required`; el control dentro. `className` va al control y `rootClassName` a la raíz.
- `Textarea`, `Segment`, `Select` y `Switch` **devuelven el valor**, no el evento.
- Pestañas dentro de una pantalla: `Segment` (sin paneles, es `radiogroup`) o `Tabs` (`data` con `content`, `lazy` para montar un panel cada vez). Cinco pestañas a 390 px: `overflowMode="scroll"`, no `wrap` (salían tres filas 2·2·1).
- Asistente por pasos: `Stepper steps active onStepClick allowNextStepsSelect size` dentro de un `Scroll axis="x"` que centra el peldaño activo con `scrollBy`. Cabecera del asistente = §7.3.
- Conmutador de acción (guardar, me gusta): `ActionIcon pressed={on} variant="glass"` (ADR-194) — **el estado va en el relleno, no en el color del trazo**, y `aria-pressed` lo anuncia. `stopPropagation` si vive dentro de una tarjeta-enlace.
- `Flex` usa `wrap="wrap"|"nowrap"`; `Group` usa `wrap` booleano. `Section` busca sus ranuras entre hijos **directos**.

---

## 13 · Tipografía y jerarquía de una pantalla (la norma)

| Pieza                  | Receta                                                                                  |
| ---------------------- | --------------------------------------------------------------------------------------- |
| Título de pantalla     | `AppShell.Header title` → `h5` semibold, `order={1}`, **único**                         |
| Subtítulo de pantalla  | `body3` `text.muted`                                                                    |
| Título de tarjeta      | `Title fz="h5" order={3}`                                                               |
| Cuerpo secundario      | `Text c="text.muted" fz="body2"`                                                        |
| Metadato               | `fz="caption"`, mono si es cifra                                                        |
| Rótulo apagado / valor | `DataRow`: `body3 text.muted` / `body3 medium mono`                                     |
| Insignia               | `Badge size="sm" variant="light"`; `outline` para lo neutro; `filled` para lo que manda |
| Tarjeta de contenido   | `Card variant="glass" withBorder r="xl"`                                                |
| Lámina / aviso         | `r="lg"`                                                                                |
| Barra a sangre         | `r={0}`, `bdw={0}`, `bdbw={1}`                                                          |

Dos hermanas con distinto radio, borde o nivel de cristal es un hallazgo. Versalitas con tracking: no existen en el producto.

---

## 14 · i18n

```ts
// src/i18n/dictionaries/<area>.ts
export const es = { … };  export const en: typeof es = { … };      // falta una clave y no compila
// servidor            // cliente
GetDictionary("public.landing")   useDictionary("dashboard.avatars")   // misma resolución, LocaleAtom hidratado en la raíz
Fill(template, { n })                                                 // {marcadores}; avisa en dev si queda uno sin rellenar
```

Un componente de servidor pasa a uno de cliente **strings resueltos** (`labels={{ close }}`), nunca el diccionario. El diccionario también es estructura: la navegación del panel sale de él.

---

## 15 · Lo que no se hace (y por qué)

| Anti-patrón                                                              | Por qué                                                                   |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| Listener de scroll para la nav                                           | `Nav floating` ya lo hace; Lagrange tiene uno (`scrollY > 24`) y es deuda |
| `useScrolled` para el panel                                              | Mide `window`; el carril scrollea el `<main>`                             |
| Cabecera que se encoge **en flujo**                                      | Bucle de parpadeo (§7.3)                                                  |
| Dos cosas `sticky` al mismo `top`                                        | Se pisan; gana la última pintada                                          |
| Panel de serie del `Modal`                                               | Rótulos azulados en la top layer                                          |
| `<video controls>` / `<audio controls>`                                  | Barra del navegador sobre el cristal                                      |
| Texto gris donde iba una lámina · «vacío» cuando falló                   | Miente sobre el estado                                                    |
| Dos tarjetas distintas para dos rejillas                                 | El producto se contradice                                                 |
| `gradientBorder` en una rejilla                                          | Deja de ser acento                                                        |
| Hex, px de alto, transición a mano, media query que una prop cubría      | Se rompe en el siguiente tema o la siguiente versión                      |
| `component={Link}` desde servidor                                        | Revienta en producción                                                    |
| CSS global sin `@layer`                                                  | Gana a Nebula en silencio                                                 |
| Dos docs de diseño de otra época (`design-style.md` con HeroUI/Tailwind) | Un agente que los lea primero construye el producto equivocado            |

---

## 16 · Huecos conocidos del catálogo (y de dónde se copia mientras tanto)

**Cerrados el 2026-09-12** (ADR-187 a ADR-198, implementados): cada fila dice qué componente o prop lo sustituye. Un producto que aún lleve la copia la retira en su próxima pasada de C3 y cuenta el cambio en su veredicto.

| Hueco                                   | Fichero en Rosette                                                | Lo sustituye                                                                    | ADR               |
| --------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------- | ----------------- |
| Reproductor de vídeo en línea + audio   | `video-player.tsx`, `voice-player.tsx`, `player.css.ts`           | `@stellaria/nebula-web/media` `VideoPlayer`, `AudioPlayer`                      | ADR-195           |
| Visor sin panel                         | `viewer.tsx`, `viewer.css.ts`                                     | `Viewer` o `Lightbox variant="bare"`                                            | ADR-196           |
| Recorte fondo + figura                  | `cutout.tsx`                                                      | `Cutout`                                                                        | ADR-197           |
| Lámina de estado ilustrada              | `system-state.tsx`, `failed.tsx`, `retry.tsx`                     | `EmptyModule layout="side" surface="glass" fill`                                | ADR-192           |
| Tarjeta de medio                        | `media-card.tsx`, `media-card.css.ts`                             | `MediaCard`                                                                     | ADR-198           |
| Sección con eyebrow y centrado          | `band.tsx`, `band.css.ts`                                         | `Section eyebrow align`                                                         | ADR-189           |
| Dock de preferencias                    | `dock.tsx`                                                        | `Dock`                                                                          | ADR-193           |
| `scrolled` del carril + `data-floating` | `app-client.tsx` (`Scroll`), `stores/sidebar.ts`, `lib/scroll.ts` | `AppShell.Scroll` + `useAppShellScroll` + `Section hanging` · `useFloatingBand` | ADR-187 · ADR-188 |
| Activo por tramos en el carril          | `app-client.tsx` (`ActiveRail`)                                   | `AppShell.Sidebar activeMode="pathname"`                                        | ADR-190           |
| Conmutador de icono                     | `piece-action.tsx`                                                | `ActionIcon pressed`                                                            | ADR-194           |

La lista razonada, con coste y prioridad, está en `prompts/6-consumidores/C2-armazon-de-producto.md` § «Lo que Rosette tiene y Nebula no».

---

## 17 · Checklist de cierre de una pantalla

- [ ] Es `Screen`: cabecera pegada con `h1` único, miga en `Subbar`, relleno `sm`/`lg`.
- [ ] Un solo botón `gradient`. Secundarios `glass`, terciarios `ghost`.
- [ ] Tarjetas hermanas con el mismo radio, borde y cristal.
- [ ] Cifras en mono. Copia en español seco; no nombra otra pantalla.
- [ ] Tiene lámina para vacío, **error** (con reintento), sin sesión y esqueleto con geometría real.
- [ ] Modales con `Card` de cristal; menús con `Menu`; un `ToastProvider`.
- [ ] Cero hex, cero px de alto fuera de `metrics.ts`, cero transición a mano, cero `<video controls>`.
- [ ] Responsive por props; mirada a 390 / 768 / 1440 en los dos esquemas.
- [ ] Todo texto del diccionario; los de cliente reciben strings.
- [ ] Lo copiado de Rosette se ha retirado a favor del catálogo (§16), o sigue copiado y está contado.
