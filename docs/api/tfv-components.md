# Anexo B — APIs reales de `tfv-frontend/packages/components`

> Inventario exhaustivo verificado el 2026-07-14 leyendo los `types.ts` / `type.ts` / `types.tsx` / `index.tsx` reales.
> Base: `C:\Users\Skr13\Documents\GitHub\tfv-frontend\packages\components\` — **117 componentes** (verificado con `ls`).
> Contexto estructural: **no es un monorepo de paquetes** — es una app Next.js 14 única (`packages/` es organización de código). Los componentes son **wrappers sobre Mantine 7.17** estilizados con Vanilla Extract híbrido.
> Stack: Next 14.2 · React 18.3 · Mantine 7.17.8 · Vanilla Extract 1.17 · motion 12 · Jotai 2.9 · form-atoms 3.2 · Zod 3.23 · XState 5 · i18next · TanStack Query 5 + Axios.

## Etiquetas de acoplamiento

| Tag     | Significado                                                                                                           |
| ------- | --------------------------------------------------------------------------------------------------------------------- |
| **[G]** | Genérico — el patrón/API es reutilizable (aunque la implementación sea Mantine y haya que reescribirla)               |
| **[F]** | Genérico atado a `form-atoms` (`field: FieldAtom`)                                                                    |
| **[M]** | API dominada por passthrough de Mantine (la migración implica rediseñar el contrato, no portarlo)                     |
| **[B]** | Acoplado al negocio (tipos `User/Client/Website/WebsiteProduct/CompanyService/Subscription`, hooks de dominio, rutas) |
| **[I]** | Infraestructura de la app (PWA, dev-mode, Novu, PDF, i18n)                                                            |

## Contratos transversales

- `ExtendedColors` (`types/shared/theme`): tokens de color estilo `"palette.shade"` sobre las paletas Mantine/VE.
- `IconsKeys` (`types/shared/icon`): catálogo propio de iconos SVG (componente `Icon`).
- `ValueVar` (`types/css/vars`): valores CSS (px/%/var).
- `Link` (`types/shared`): `{ label, href, icon, ... }` para navegación declarativa.
- `Filter` (`types/shared/filter`): descriptor declarativo de filtros (`type: select|multiselect|radio|range|date|text|none`, `key`, `defaultValue(s)`).
- `PermissionsKeys` (`types/auth/permissions`): gating de acciones por permiso (aparece en `Card`, `Service`).
- Patrón dominante de theming: `import { vars } from "../../themes"` (Mantine `themeToVars` + Vanilla Extract) + `assignInlineVars` para vars dinámicas.

---

## 1. Primitivos genéricos

### Button — [G/M]

```ts
export type ButtonProps<E = {}> = {
  icon?: IconsKeys
  color?/colorHover?/colorText?/colorTextHover?/colorIcon?: ExtendedColors
  scrollTo?: string
  onClick?: MouseEventHandler<HTMLButtonElement>
  children?: React.ReactNode
  variant?: "filled" | "light" | "outline"
  disabled?: boolean
  responsive?: boolean
  auto?: boolean
  inverted?: boolean
  onlyIcon?: boolean
  iconPosition?: "left" | "right"
  iconProps?: IconProps
  href?: string
  error?: boolean
  selected?: boolean
  shrink?: boolean
  mini?: boolean
  tooltip?: string
  tooltipProps?: Partial<TooltipProps /* Mantine */>
  linkProps?: AnchorProps
} & Omit<PolymorphicComponentProps<"button", ButtonPropsMantine>, "component" | "color">
  & { component?: any } & E
```

### ActionIcon — [G/M]

```ts
export type ActionIconProps = PolymorphicComponentProps<any, Omit<ActionIconMantineProps, "c">> & {
  c?: ExtendedColors;
  icon?: IconsKeys;
  iconProps?: Omit<IconProps, "icon">;
  sizeIcon?: number | string;
  component?: "button" | "div";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  tooltipProps?: TooltipProps;
  tooltip?: string;
  isSelected?: boolean;
};
```

### Buttons — [G] — agrupador de botones

```ts
export type ButtonsProps = FlexProps & { loading?: boolean; children?; shrink?: boolean };
```

### Badge — [G/M]

```ts
export type BadgeProps = Omit<BadgePropsMantine, "c" | "color"> & {
  iconPosition?: "left" | "right"
  variant?: "light" | "filled" | "outline" | "flat"
  icon?: IconsKeys
  label?: string
  labelPopover?: string
  labelValue?: string | number | undefined
  c?/color?/colorText?/colorBorder?/colorAlt?: ExtendedColors
  colorRaw?: string
  iconProps?: IconProps
  show?: boolean; full?: boolean; grow?: boolean; responsive?: boolean
  className?: string
  popover?: PopoverProps          // badge con popover integrado
  fontWeight?: 400 | 500 | 600 | 700 | 800 | 900
  shrink?: boolean
  hideLabel?: boolean
}
```

### Pill — [M] — `PillProps = {} & MantinePillProps`

### Avatar — [G]

```ts
export type AvatarProps = FlexProps & {
  title?: string;
  subtitle?: string;
  image?: string;
  icon?: IconsKeys;
  responsive?: boolean;
  orientation?: "left" | "right";
  onlyImage?: boolean;
  shrink?: boolean;
  size?: "sm" | "md" | "lg";
};
```

### Icon / Icons — [G]

```ts
export type IconProps = Omit<React.SVGProps<SVGSVGElement>, "fill"> & {
  width?/height?/size?: ValueVar
  fill?: ExtendedColors
  icon?: IconsKeys
  className?: string
  style?: React.CSSProperties
}
// Icons = picker de iconos:
export type IconsProps = { value?: IconsKeys; onChange?: (v: IconsKeys) => void; hideInput?: boolean } & InputBaseProps
```

### Paper — [G]

```ts
export type PaperProps = FlexProps & {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  flat?: boolean;
  header?: HeaderProps;
};
```

### Paragraph — [M] — `TextProps (Mantine) & { component?: "p" | "div"; children? }`

### Divider / DividerTitle — [G]

```ts
export type DividerProps = Omit<FlexProps, "c" | "color"> & {
  title?: string
  c?/color?: ExtendedColors
  orientation?: "horizontal" | "vertical"
}
// DividerTitle reutiliza DividerProps: título centrado entre dos líneas dashed
```

### Link — [G/M]

```ts
export type LinkProps = Omit<LinkNextProps, "href"> & Omit<AnchorProps, "href" | "color" | "c"> & {
  href?: string
  children: React.ReactNode
  className?: string
  color?/colorHover?/c?: ExtendedColors
}
```

### Logo — [I] — asset de marca (variant vertical/horizontal/icon, monotone, responsive por breakpoint). App-específico por contenido, patrón genérico.

### Skeleton — [G]

```ts
export type SkeletonProps = {
  root?: boolean;
  loading?: boolean;
  children?: React.ReactNode;
  skeleton?: React.ReactNode;
  count?: number;
};
```

### Grid — [G]

```ts
export type GridProps = {
  width?/height?/gap?/column?/row?: string
  className?: string
  style?: MantineStyleProp
  widthTablet?/widthPhone?/heightTablet?/heightPhone?: string   // responsive por props
  children?: React.ReactNode
  scrollable?: boolean
} & FlexProps
```

### Group — [G]

```ts
export type GroupProps = FlexProps & {
  href?: string
  title?/subtitle?: string
  icon?: IconsKeys
  link?: Link
  borderless?: boolean
  flat?/flatAfter?/flatBefore?/flatHeader?: boolean
  header?/headerAfter?/headerBefore?: React.ReactNode
  children?/after?/before?: React.ReactNode
  isLoading?: boolean
  animated?: boolean; animatedDelay?: number; animatedIndex?: number
  height?: string
  responsive?: boolean
  size?: string
}
```

### Grow — [M] — `GrowProps = {} & FlexProps`

### Wrap — [G]

```ts
export type WrapProps = {
  flex?: boolean;
  grow?: boolean;
  basis?: string;
  responsive?: boolean;
  animated?: boolean;
} & Omit<FlexProps, "flex" | "grow">;
```

### Main — [G] — `MainProps = { fixed?: boolean } & FlexProps`

### Container — [G] — layout de sección con slots

```ts
export type ContainerProps = {
  title?/subtitle?: string | React.ReactNode
  flat?: boolean
  sidebar?: React.ReactNode
  beforeHeader?/header?/headerLeft?/headerRight?/afterHeader?: React.ReactNode
  beforeContent?/afterContent?/rightContent?/leftContent?/footer?: React.ReactNode
  icon?: IconsKeys
  scrollable?: boolean
  expandable?: boolean
  order?: TitleOrder
  loading?: boolean
  isError?: boolean
  error?: EmptyProps
  children?: React.ReactNode
  styles?: { section?; header?; head?; content?: React.CSSProperties }
}
```

### Section — [G] — `{ children?; header?; footer? }`

### Portal — [G] — `{ portal?: boolean; children?; root?: () => Element | DocumentFragment }`

### Conditional / Omit / Valid / Invert — [G] — render helpers

```ts
export type ConditionalProps = {
  conditional?: boolean;
  children: [React.ReactNode, React.ReactNode];
}; // ¡binario, distinto a fonicredito!
export type OmitProps = { omit?: boolean; children? };
export type ValidProps = { valid?: boolean; children?; invalid?: React.ReactNode };
export type InvertProps = { isInverted?: boolean; children? }; // invierte el orden de 2 hijos
```

### Rating — [G]

```ts
export type RatingProps = Omit<FlexProps, "c" | "color" | "onChange"> & {
  c?/color?: ExtendedColors
  value?/defaultValue?: number
  onChange?: (value: number) => void
  size?: ValueVar
}
```

### Warning — [G] — `FlexProps & { title?: string; icon?: IconsKeys; radius?: string }`

### Tooltip — [G] ⚠️ _naming trap_: NO es un tooltip — es un **menú de acciones** (Mantine Menu)

```ts
export type TooltipProps = {
  float?: boolean
  right?/top?/width?: string
  actions?: TooltipActionsProps[]       // secciones { id, title, items }
  className?: string
  menu?: MenuProps
  actionIcon?: ActionIconProps
  children?: React.ReactNode
  type?: "button" | "action"
}
export type TooltipItemProps = {
  id: string; label?: string; icon?: IconsKeys; shortcut?: string
  disabled?: boolean; show?: boolean; color?: ExtendedColors
  onClick?: () => void; isLast?: boolean; component?: React.ReactNode
}
```

### Popover — [G/M] — tooltip/popover real (Mantine Popover + icon/label/dropdown)

```ts
type Props = PopoverProps /* Mantine */ & {
  icon?: IconsKeys;
  iconPosition?: "left" | "right";
  label?: string;
  dropdown?: React.ReactNode;
};
```

## 2. Overlays y modales

### Modal — [G]

```ts
export type ModalProps = {
  title?/subtitle?: string
  textAlign?: "left" | "center" | "right" | "justify"
  header?: React.ReactNode
  opened?: boolean
  onClose?: () => void
  closeOnClickOutside?: boolean
  children?: React.ReactNode
  isLoading?: boolean
  width?/height?/maxWidth?/maxHeight?: string
  fullScreen?/fullSize?: boolean
  responsive?: boolean
  clear?: boolean
  blurred?: boolean
  drawer?: boolean                      // modo drawer lateral
} & Omit<MantineModalProps, "onClose">
```

### ModalDelete — [G] — modal de confirmación destructiva

```ts
export type ModalDeleteProps = {
  title?/subtitle?: string
  opened: boolean
  onClose: () => void
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
  isPending: boolean; isLoading: boolean
  fullScreen?: boolean
  alert?: React.ReactNode
  children: React.ReactNode
  form?: FormProps
}
```

### Aside — [G] — panel lateral controlado por store Jotai

```ts
export type AsideProps<T extends object = {}> = { width?: string; height?: string } & AsideHTML & {
    flat?: boolean;
    opened?: boolean;
    initialState?: Aside<T>; // stores/aside
    fullScreen?: boolean;
  };
```

### ViewDrawer — [G] — `{ children? }` (drawer de vista)

### OverlayCancel — [G/B]

```ts
export type OverlayCancelProps = {
  opacity?: `${number}%`
  blur?: `${number}px`
  color?/colorBorder?: string
  radius?: ...
} & Partial<CancelZod>       // CancelZod: tipo de cancelación del dominio
```

### Preview — [G] — lightbox de imágenes con zoom/pan/slideshow

```ts
type Props = {
  image?: string;
  images?: (string | undefined)[];
  imagesUploads?: (Upload | undefined)[]; // ⚠️ tipo de dominio Upload (con quality.thumbnail)
  open: boolean;
  onClose: () => void;
  initialIndex?: number;
};
```

### Player — [G/I] — modal de vídeo (react-player): `{ video?: string; open: boolean; onClose: () => void }`

## 3. Forms (form-atoms + Header)

### Header — [F/M] — wrapper label/description/error de todos los inputs (sobre Mantine InputWrapper)

```ts
export type HeaderProps = Omit<InputWrapperProps, "c" | "color"> & {
  size?: "sm" | "md" | "lg" | "xl" | "xxl"
  descriptionRaw?: boolean
  withBanner?: boolean
  lines?/linesTitle?: number
  c?/color?: ExtendedColors
  justify?/align?/textAlign?: React.CSSProperties[...]
  children?: React.ReactNode
  rightSection?/leftSection?: React.ReactNode
  hideContent?: boolean
  noWrap?: boolean
  descriptionProps?: InputDescriptionProps
  labelProps?: InputLabelProps
  clickable?: boolean
  avatar?: string
  loading?: boolean
  gap?/gapContent?: StyleProp<MantineSpacing>
  error?: React.ReactNode
  direction?: React.CSSProperties["flexDirection"]
  input?: boolean
  field?: FieldAtom<any>
}
```

### Inputs — [F/M] — patrón uniforme: `<MantineInputProps> & { headerProps?: HeaderProps; field?: FieldAtom<any> }`

```ts
export type InputTextProps = TextInputProps & { headerProps?; field? };
export type InputNumberProps = NumberInputProps & { headerProps?; field? };
export type InputSelectProps = SelectProps & { headerProps?; field? };
export type InputDialProps = SelectProps & { headerProps?; field? }; // select de prefijos telefónicos
export type InputColorProps = ColorInputProps & { headerProps?; field? };
export type InputSliderProps = SliderProps & { label?; description?; headerProps?; field? };
export type /* InputSwitch */ InputTextProps = SwitchProps & { headerProps?; field? };
// ⚠️ bug real: InputSwitch/types.ts exporta su tipo con el nombre equivocado "InputTextProps"
```

### Form — [G] — orquestador de formulario

```ts
export type FormProps = Omit<DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>, "color" | "title"> & {
  containerProps?: FlexProps
  banderoleProps?: BanderoleProps
  headerProps?: HeaderProps
  title?/subtitle?: string | React.ReactNode
  banderole?: string; banderolePosition?: "left" | "right"; fit?: BanderoleProps["fit"]
  header?/headerAfter?/headerBefore?: React.ReactNode
  footer?/footerBefore?/footerAfter?: React.ReactNode
  isPending?/isLoading?: boolean
  submitText?: string; submitColor?: ExtendedColors
  cancelText?: string; onCancel?: () => void
  c?/color?: ExtendedColors
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => Promise<void> | void
  children?: React.ReactNode
  withoutWrapper?: boolean
  disabled?: boolean
  error?: boolean; errorText?: string; errorIcon?: IconsKeys
  flat?: boolean
  main?: boolean
}
```

### FormDelete — [G] — `{ alert?; onSubmit?; isPending; isLoading; children }`

### Dropzone — [F/M]

```ts
export type DropzoneProps = Omit<DropzonePropsMantine, "onDrop"> & {
  w?/h?: string | number
  label?/description?: string
  replace?: boolean
  files?: FileDropzone[]
  onDrop?: (files: FileDropzone[]) => void
  type?: "image" | "file" | "pdf" | "video"
  error?: string
  colorBG?: string
  drop?: Drop; hideDrop?: boolean
  field?: FieldAtom<FileDropzone[]>
  fieldColor?: FieldAtom<string>
}
```

### Editor — [F/M] — rich text (Mantine TipTap)

```ts
export type EditorProps = {
  label?/description?: string
  children?: React.ReactNode
  content?/data?: string
  fullToolbar?: boolean
  editorProps?: Partial<RichTextEditorProps>
  immediatelyRender?: boolean
  omitColors?/omitFonts?/omitControls?: boolean
  styles?: React.CSSProperties
  height?: string | number
  field?: FieldAtom<string>
} & Partial<EditorOptions /* tiptap */>
```

### EditorImage — [F/I] — editor de imagen (Pintura vendored)

`EditorImageProps = DropzoneProps & { editor?: PinturaEditorProps }` + tipos completos de Pintura (eventos, crop state, refs). Depende de la librería comercial Pintura vendida/vendorizada en `EditorImage/pintura/`.

### Signature — [G] — firma sobre `react-canvas-draw`

```ts
export type SignatureProps = CanvasDrawProps & {
  label?/description?/error?: string
  signatureTitle?/signatureDescription?: string
}
```

### Map — [F/I] — Google Maps con geocoding a form-atoms

```ts
export type MapProps = MapGoogleProps /* @vis.gl/react-google-maps */ & {
  children?: React.ReactNode
  height?: string
  searchable?: boolean
  onClickPlace?: (place: google.maps.places.PlaceResult | null) => void
  onClick?: ((e: MapMouseEvent) => void) | null
  fields?: { latitude?/longitude?/zipcode?/country?/countryCode?/state?/city?/colony?/street?/number?: FieldAtom<any> }
}
```

### Segment — [G/M]

```ts
export type SegmentProps = Omit<
  SegmentedControlProps & InputWrapperProps,
  "value" | "onChange" | "data"
> & {
  value?: any;
  onChange?: (v: any) => void;
  data?: { label: string; value: any }[];
};
```

### Icons (picker), Rating — ver §1.

## 4. Patrones de datos (List/Cards/Carousel/GridList)

Patrón central: **todo listado renderiza `CardProps[]`** con skeleton/empty integrados.

### Card — [G/B] — el compuesto más grande del sistema (~90 props)

```ts
export type CardProps = {
  id?: string | number
  href?: string
  title?: string | React.ReactNode
  disabled?: boolean
  align?/justify?: "flex-start" | "center" | "flex-end"
  leftSection?/rightSection?: React.ReactNode
  titleBadge?: string
  button?: string; buttonProps?: ButtonProps; onClickButton?: () => void; iconButton?: IconsKeys
  scrollOnClick?: boolean
  sectionWrap?: boolean
  onClickCard?: (e: React.MouseEvent) => void; disableClick?: boolean
  description?: string | React.ReactNode; descriptionRaw?: boolean
  color?/colorOutline?/colorBG?: string
  image?: string; imageComponent?: React.ReactNode
  images?: (string | undefined)[]; imagesUploads?: (Upload | undefined)[]   // ⚠️ dominio Upload
  imageHeightAuto?: boolean; imageHeight?/imageHeightTb?/imageHeightMb?: number | string
  actions?: React.ReactNode
  badge?/badgeTitle?: BadgeProps; badgesTitle?/badgesMain?/badges?: BadgeProps[]
  badgesGrow?/badgesWrap?: boolean; badgesMainContainer?: React.CSSProperties
  tooltip?: TooltipProps
  showImage?/hideTooltip?/hidePreview?: boolean
  className?: string; width?/height?: string
  avatar?: string; avatarProps?: AvatarProps
  footer?/header?/section?/content?: React.ReactNode; headerProps?: HeaderProps
  flatSection?/flatHeader?/flatFooter?/flatContent?: boolean
  icon?: IconsKeys
  lines?/linesTitle?: number
  createdAt?/updatedAt?: Date; createdAtIcon?/updatedAtIcon?: IconsKeys; createdAtTitle?/updatedAtTitle?: string
  radio?: boolean; radioStyles?: React.CSSProperties
  isSelected?/borderless?/deleted?: boolean
  children?: React.ReactNode
  autoHide?/autoHideImage?/autoHideResponsible?/autoHideButton?: boolean
  hideImage?/hideResponsible?/hideButton?: boolean
  sectionImageComponent?: React.ReactNode
  // 4 acciones con permission-gating cada una:
  onClickAdd?; addIcon?; addColor?; addPermission?: PermissionsKeys
  onClickAction?; actionIcon?; actionColor?; actionPermission?; actionDisabled?
  onClickDownload?; downloadIcon?; downloadColor?; downloadPermission?; downloadDisabled?
  preview?: boolean; onClickPreview?; previewIcon?; previewColor?; previewPermission?; previewDisabled?
  responsibleTitle?: string; responsible?: Partial<User>                    // ⚠️ dominio User
  animated?: boolean; animatedDelay?: number; animatedIndex?: number
  cardProps?: PolymorphicComponentProps<"div", CardMantineProps>
  style?: React.CSSProperties
}
```

### List — [G]

```ts
export type ListProps = FlexProps & {
  isEmpty?/isLoading?: boolean
  cards?: CardProps[]; cardsSkeleton?: CardProps[]; card?: CardProps
  empty?: EmptyProps
  skeleton?: SkeletonProps; skeletonCardQuantity?: number
  skeletonCard?: (props: Partial<CardProps>) => JSX.Element; skeletonCards?: React.ReactNode
  children?: React.ReactNode
  auto?: boolean
  orientation?: "horizontal" | "vertical"
  scrollable?: boolean
}
```

### Cards — [G] — `GridProps & { ...mismo contrato cards/skeleton/empty que List }`

### Carousel / CarouselCards — [G/M] — `CarouselPropsMantine & { ...mismo contrato cards/skeleton }` (CarouselCards es duplicado casi exacto de Carousel)

### CarouselImages — [G/B]

```ts
export type CarouselImagesProps = FlexProps & {
  image?: string;
  images?: (string | undefined)[];
  imagesUploads?: (Upload | undefined)[];
  imageComponent?: React.ReactNode;
  icon?: IconsKeys;
  carouselProps?: Omit<CarouselProps, "children">;
  hidePreview?: boolean;
  hideImageBackground?: boolean;
};
```

### GridList — [G] — conmutador list/grid/carousel

```ts
export type GridListProps = {
  type?: "list" | "grid" | "carousel"
  listProps?: ListProps; gridProps?: CardsProps; carouselProps?: CarouselProps
  isEmpty?/isLoading?: boolean
  empty?: EmptyProps
  children?: React.ReactNode
  color?: ExtendedColors
}
```

### Empty — [G]

```ts
export type EmptyProps = Omit<FlexProps, "flex" | "color" | "c"> & {
  icon?: IconsKeys
  title?/subtitle?: React.ReactNode
  children?: React.ReactNode
  minHeight?: string
  className?: string; styles?: React.CSSProperties
  back?: string; backText?: string
  hasQuery?: boolean
  flex?: boolean
  borderless?/roundless?: boolean
  color?/c?: ExtendedColors
  iconProps?: IconProps; buttonProps?: ButtonProps; headerProps?: HeaderProps
}
```

### NotFound — [G] — `{ title?; subtitle?; back?; backText?; icon?; className?; styles?; color? }`

### Accordion / AccordionList — [M]

```ts
export type AccordionProps<M extends boolean = false> = AccordionPropsMantine<M> & {};
export type AccordionListProps<M extends boolean = false> = AccordionPropsMantine<M> & {
  sticky?: boolean;
  flat?: boolean;
};
export type AccordionListItemProps = AccordionItemPropsMantine & {
  icon?: IconsKeys;
  label?: string;
};
```

### Tabs — [M] — `TabsPropsMantine & { flat?; variant?: "filled" | "light"; group?; scroll? }`

### Stepper — [M] — `StepperPropsMantine & { fullScreen?: boolean }` + `StepperErrors` recursivo

### Pagination — [G]

```ts
export type PaginationProps = {
  color?: ExtendedColors
  standalone?: boolean
  pagination?: Paginate<unknown>       // ⚠️ tipo de dominio (respuesta paginada del API)
  isLoading?: boolean
  limit?/page?: number
  modals?: string[]
  hideControls?: boolean
  popoverPosition?: PopoverProps["position"]; popoverProps?: PopoverProps
  navigationOptions?: NavigateOptions   // ⚠️ Next.js router
}
```

### Charts — [G] — grid de paneles para gráficas: `{ children?; isLoading?; columns?: number }` (recharts vive en las páginas)

### Panel — [G] — layout de dos paneles

```ts
export type PanelProps = {
  flat?/flatPanel?: boolean
  gap?: string
  justify?/align?: ...
  leftPanel?/rightPanel?: React.ReactNode; hideLeftPanel?/hideRightPanel?: boolean
  card?: boolean
  width?/height?/minHeight?/minWidth?: string
  maxFixed?: boolean
  children?: React.ReactNode
  isLoading?: boolean
  style?: React.CSSProperties; styles?: { container?; panel?; content?; divider? }
  scrollable?/float?/fixed?: boolean
  top?: string
  color?: string
}
```

## 5. Búsqueda y filtros

### Search — [G] — barra de búsqueda con slots + filtros declarativos

```ts
export type SearchProps = {
  color?: ExtendedColors
  main?: boolean
  rounded?: boolean
  after?/middle?/before?/top?/bottom?/left?/right?: React.ReactNode
  filters?: Filter[]
  isLoading?: boolean
  children?: React.ReactNode
  refetch?: () => void
  hideSearch?: boolean
}
```

### SearchInput — [G/M] — `PolymorphicComponentProps<"input", InputProps> & { isWriting?: boolean; onClear?: () => void }`

### Filter / FilterItem / Filters — [G] — sistema declarativo de filtros sobre search params

```ts
export type ParamsFilterProps = {
  value?: (key: string) => string | undefined;
  values?: (key: string) => string[] | undefined;
  onSet?: (key: string, value: string | string[]) => void;
  onDelete?: (key: string) => void;
};
// Filter: { filter: IFilter; last?: boolean } & ParamsFilterProps
// FilterItem: render por tipo (select/multiselect/radio/range/date/text) con Mantine
// Filters: { isLoading?; filters?: IFilter[] } & ParamsFilterProps — popover contenedor
```

## 6. Navegación / shell

- **Navbar** — [G] — `FlexProps & { absolute?; logo?: string; links?: Link[]; color?; disableClick? }`
- **Sidebar** — [G] — `FlexProps & { logo?; links?: Link[]; color? }`
- **Sidenav** — [G/B] — `SidebarHTML & { meProps?: MeProps }` (shell de dashboard con menú de usuario)
- **Footer** — [G] — `Omit<FlexProps,"color"> & { company?; address?; logo?; omitLinks?; omitBrands?; links?: Link[]; brands?: Link[]; color? }`
- **Breadcrumbs** — [G/N] — sin props; deriva rutas de `usePaths()` (Next pathname) + store Jotai de montaje
- **Banner** — [G] — hero/section banner (~30 props: hiper/title/subtitle, image, linearGradient, color/accent/subtle, blur, overlay, slots left/right/bottom/before/after, tamaños sm–xl)
- **Banderole** — [G] — franja lateral de imagen para forms: `Omit<FlexProps,"color"|"c"> & { image?; position?; fit?; blur?; c?; color? }`
- **Feature** — [G] — `FlexProps & { icon?; title?; description?; link?; linkText?; iconProps?; anchorProps? }`

## 7. Acoplados al negocio — [B]

| Componente                                               | Props clave (verificadas)                                                                                                                                                                                     | Dominio        |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| **Cart**                                                 | `{ type?, cartType?: WebsiteCartType, color?, path?, website?: Website, me?: User, currency? }` + `useWebsiteCart()`                                                                                          | e-commerce     |
| **Product**                                              | `Omit<UnstyledButtonProps,"c"> & { product?: WebsiteProduct, isLoading?, isSelected?, animatedIndex?, animatedDelay?, onClick?, onAddToCart?: (WebsiteItem)=>void, onBuyNow? }`                               | e-commerce     |
| **Products**                                             | `GridListProps & { isLoading?, products?: WebsiteProduct[], productProps? }`                                                                                                                                  | e-commerce     |
| **Ware**                                                 | `{ path?, product?: WebsiteProduct, color? }`                                                                                                                                                                 | almacenes      |
| **Categories / Category**                                | `GridListProps & { categories?: CategoryGlobal[], categoryProps?, isLoading? }` / `Omit<UnstyledButtonProps,...> & { category?: CategoryGlobal, size?, mini?, onClick?, href?: (c)=>string, animatedIndex? }` | catálogo       |
| **CardSubscription**                                     | `CardProps & { subscription?: Subscription, isRecomended?, quantity?, buttons?, onClick? }`                                                                                                                   | pagos          |
| **Client**                                               | `{ w?, client?: Partial<Client>, icon?, responsive?, showRole?, direction?, onlyImage?, checked?, verify? }`                                                                                                  | CRM            |
| **AvatarUser**                                           | `AvatarProps & { user?: User }`                                                                                                                                                                               | usuarios       |
| **Me**                                                   | `UnstyledButtonProps & { menuProps?, avatarProps?, links?: Link[], linksMore?, avatar?: ReactNode \| ((me: User)=>ReactNode) }` — **server component async** (`await getMe()`)                                | auth           |
| **OptionClient/User/CompanyUser/Provider**               | `{ option: ComboboxItem, checked?, <entidades>? }` — renderers de opciones de combobox por entidad                                                                                                            | CRM            |
| **Option**                                               | `{ checked?, label?, icon?, image? }` — genérico base de los anteriores [G]                                                                                                                                   | —              |
| **Service / Services**                                   | `UnstyledButtonProps & { label?, description?, icon?, href?, badge?, isSelected?, animated*, permission?: PermissionsKeys }` / `GridProps & { links?: Link[] }`                                               | dashboard      |
| **PopoverCompanyService**                                | `{ companyService?: CompanyService }` + router push a dashboard                                                                                                                                               | dashboard      |
| **Login / Register / ForgotPassword / Recover / Verify** | todos `(props: FormProps)` + hook de dominio (`useLogin`, `useRegister`, …) — pantallas de auth completas                                                                                                     | auth           |
| **Bell / BellNovu / Inbox / Notification**               | `BellProps = { new?, count?, dropdown?, className? }` [G]; BellNovu/Inbox/Notification atados a **Novu**                                                                                                      | notificaciones |
| **Aside/AsidePdf**                                       | AsidePdf: render PDF dinámico (react-pdf), sin props                                                                                                                                                          | documentos     |
| **PoweredDocument**                                      | footer "Powered by The Film Vault" para PDFs (react-pdf), sin props                                                                                                                                           | marca          |

## 8. Infraestructura de app — [I]

- **BannerDev / Dev** — indicador de entorno de pruebas; `DevProps = { children?, withPortal?, portalProps? }`.
- **BannerPWA** — banner de instalación PWA (`usePWA`), sin props.
- **Toggles** — switcher de tema dark/light + selector de idioma (i18next) + toggle dev. Sin props. Único uso propio de `aria-label` en todo el paquete.
- **Alert** — `AlertProps = Alert & {}` (tipo del store de alerts en `types/shared`).
- **Notification** — item de notificación Novu.

---

## Resumen de disposición

| Grupo                                             | Cuenta | Componentes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ------------------------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Genéricos (patrón migrable)**                   | ~59    | Button, ActionIcon, Buttons, Badge, Pill, Avatar, Icon, Icons, Paper, Paragraph, Divider, DividerTitle, Link, Skeleton, Grid, Group, Grow, Wrap, Main, Container, Section, Portal, Conditional, Omit, Valid, Invert, Rating, Warning, Tooltip(menu), Popover, Modal, ModalDelete, Aside, ViewDrawer, Preview, Player, Form, FormDelete, Header, InputText, InputNumber, InputSelect, InputDial, InputColor, InputSlider, InputSwitch, Segment, Dropzone, Editor, Signature, Card, List, Cards, Carousel, CarouselCards, CarouselImages, GridList, Empty, NotFound, Accordion, AccordionList, Tabs, Stepper, Pagination, Charts, Panel, Search, SearchInput, Filter/FilterItem/Filters, Navbar, Sidebar, Footer, Banner, Banderole, Feature, Breadcrumbs, Option |
| **Negocio (se reconstruyen en app sobre Nebula)** | ~30    | Cart, Product, Products, Ware, Categories, Category, CardSubscription, Client, AvatarUser, Me, OptionClient, OptionUser, OptionCompanyUser, OptionProvider, Service, Services, PopoverCompanyService, Login, Register, ForgotPassword, Recover, Verify, BellNovu, Inbox, Notification, AsidePdf, PoweredDocument, Sidenav, OverlayCancel, Map                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **Infra app**                                     | ~8     | BannerDev, BannerPWA, Dev, Toggles, Alert, Logo, Bell(wiring), EditorImage(Pintura)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |

**Observaciones transversales**

1. **Dependencia estructural de Mantine**: ~70% de los componentes extienden props de Mantine directamente. Migrar a Nebula = rediseñar contratos, no portarlos; los props "extra" (icon, color semántico, responsive, flat, animated*, permission) son la capa de valor propio.
2. **Patrón `field?: FieldAtom<any>` + `headerProps`** uniforme en todos los inputs — converge exactamente con fonicredito y con el plan de inputs de Stellaria.
3. **Permission gating declarativo** (`addPermission`, `actionPermission`, `permission: PermissionsKeys`) integrado en Card/Service — requisito confirmado para Nebula.
4. **Patrón animated{Index,Delay}** (entrada escalonada) presente en Card/Group/Service/Product/Category — equivalente web del `AnimationCardProps` de fonicredito.
5. **Naming traps documentados**: `Tooltip` es un menú; `InputSwitch` exporta `InputTextProps`; `Conditional` aquí es binario (`children: [A, B]`) mientras en fonicredito es unario; dos `Sidebar`/`SidebarProps` distintos (Sidebar y Sidenav).
6. **a11y**: delegada por completo a Mantine; único `aria-label` propio en `Toggles`. Sin focus management propio.
7. Cero tests, cero Storybook.
