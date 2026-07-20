# Anexo A — APIs reales de `fonicredito-app/src/services/shared/components`

> Inventario exhaustivo verificado el 2026-07-14 leyendo los `types.ts` / `index.tsx` reales.
> Base: `C:\Users\Skr13\Documents\GitHub\fonicredito-app\src\services\shared\components\` — **52 componentes** (verificado con `ls`; 5 no exportados por el barrel `index.ts`: `Drops`, `HeaderFilter`, `HeaderUpdate`, `Notifications`, `UpdateModal`).
> Stack de la app: Expo ~54 · RN 0.81.5 · Unistyles ^3.0.21 · Reanimated ~4.1.1 · Jotai ^2.15.2 · form-atoms ^3.3.3 · Zod ^4.1.13 · MMKV ^4.2.

## Etiquetas de acoplamiento

| Tag     | Significado                                                                                           |
| ------- | ----------------------------------------------------------------------------------------------------- |
| **[G]** | Genérico puro — migrable a core de Nebula                                                             |
| **[F]** | Genérico pero atado a `form-atoms` (`field: FieldAtom`) — migrable si el contrato de forms lo absorbe |
| **[N]** | Atado a navegación (`expo-router` / `react-navigation`)                                               |
| **[L]** | Atado al patrón de listados con atoms Jotai (search/ordering/filter)                                  |
| **[B]** | Acoplado al negocio fintech (QueryMe, roles, notificaciones push, KYC)                                |
| **[I]** | Infraestructura de la app (OTA updates, splash, alerts store, logs)                                   |

## Contratos transversales

Tipos de estilo que consumen casi todos los componentes (`shared/types/styles.ts`), resueltos vía `utils/theme.ts` (`GetColorTheme`, `GetSpaceTheme`, `GetRadiusTheme`, `GetFontSizeTheme`) dentro de `StyleSheet.create` de Unistyles:

```ts
export type SpaceProps = {
  p?: SpaceSchema;
  pt?;
  pb?;
  pl?;
  pr?;
  px?;
  py?: SpaceSchema;
  m?: SpaceSchema;
  mt?;
  mb?;
  ml?;
  mr?;
  mx?;
  my?: SpaceSchema;
};
export type SizeProps = {
  w?: DimensionValue;
  miw?;
  maw?;
  h?;
  mih?;
  mah?: DimensionValue;
};
```

- `ColorScheme` (de `src/theme/colors.ts`): admite `"palette.shade"`, `"palette.shade.opacidad"`, hex y `transparent`.
- `RadiusSchema`: `none | xxs…xxl | full` · `SpaceSchema`: `xxxs…xxxl` · `FontSizeKeys`: `h1…h5, body1…body5`.
- `Alert` (`shared/types/alert.ts`) — contrato del sistema de toasts/diálogos:

```ts
export type Alert = {
  id?: string
  type?: "dialog" | "toast"
  title?: string
  message?: string
  color?: ColorScheme
  status?: "INFO" | "SUCCESS" | "ERROR" | "WARNING"
  loading?: boolean
  timeout?: number
  push?: "top" | "bottom"
  position?: "top" | "bottom" | "center"
  index?: number
  onClose?/onPress?/onConfirm?/onCancel?: (alert: Alert) => void
  data?: Record<string, string | Href> & { href?: Href }
  update?: boolean; stop?: boolean; height?: number
}
```

---

## 1. Primitivos base

### View — [G] — el primitivo raíz del design system

`View/types.ts`. Núcleo del que heredan casi todos. Animado por defecto (`AnimatedProps` de Reanimated).

```ts
export type ViewProps = Omit<AnimatedProps<RNViewProps>, "children"> & {
  gap?: SpaceSchema
  direction?: ViewStyle["flexDirection"]
  bg?: ColorScheme
  align?: ViewStyle["alignItems"]
  justify?: ViewStyle["justifyContent"]
  flex?: ViewStyle["flex"]
  wrap?: ViewStyle["flexWrap"]
  grow?: ViewStyle["flexGrow"]
  shrink?: ViewStyle["flexShrink"]
  basis?: ViewStyle["flexBasis"]
  r?: RadiusSchema
  children?: React.ReactNode
  isLoadingIgnore?: boolean
  isLoading?: boolean                 // integra Skeleton automático
  bc?/btc?/bbc?/blc?/brc?: ColorScheme   // border color por lado
  bw?/btw?/bbw?/blw?/brw?: number        // border width por lado
  zIndex?: ViewStyle["zIndex"]
  overflow?: "visible" | "hidden"
  position?: "static" | "relative" | "absolute"
  left?/right?/top?/bottom?: ViewStyle["..."]
} & SpaceProps & SizeProps
```

### Text — [G]

`Text/types.ts`. Texto tematizado, animado, con skeleton integrado.

```ts
export type TextProps = Omit<AnimatedProps<RNTextProps>, "style" | "children"> & {
  style?: StyleProp<TextStyle>;
  ff?: FontFamilyKeys;
  fw?: TextStyle["fontWeight"];
  c?: ColorScheme;
  fz?: FontSizeKeys;
  flex?: ViewStyle["flex"];
  ta?: TextStyle["textAlign"];
  self?: ViewStyle["alignSelf"];
  lh?: number;
  isLoading?: boolean;
  children?: React.ReactNode;
  decoration?: TextStyle["textDecorationLine"];
  bg?: ColorScheme;
  r?: RadiusSchema;
} & SpaceProps &
  SizeProps;
```

### SafeArea — [G]

```ts
export type SafeAreaEdges = ("top" | "bottom" | "left" | "right")[];
export type SafeAreaProps = ViewProps & { edges?: SafeAreaEdges };
```

### Scroll — [G]

ScrollView animado con gesture externo inyectable.

```ts
export type ScrollProps = AnimatedProps<ScrollViewProps> &
  ViewProps & {
    children?: React.ReactNode;
    gesture?: GestureType; // react-native-gesture-handler
    background?: React.ReactNode;
    flexed?: boolean;
  };
```

### List — [G]

FlatList con layout animations de Reanimated.

```ts
export type ListProps<T> = FlatListPropsWithLayout<T> & {
  children?: React.ReactNode;
  contentProps?: ViewProps;
  columnWrapperProps?: ViewProps;
  gesture?: GestureType;
} & ViewProps;
```

### Main — [G] — layout de pantalla

```ts
export type MainProps = ViewProps & {
  disableKeyboardBehavior?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  background?: React.ReactNode;
  footerBG?: ColorScheme;
  footerBGSize?: DimensionValue;
  headerBG?: ColorScheme;
  headerBGSize?: DimensionValue;
  edges?: SafeAreaEdges;
};
```

### Divider — [G]

```ts
export type DividerProps = Omit<ViewProps, "children"> & {
  orientation?: "horizontal" | "vertical";
};
```

## 2. Render helpers

### Conditional / Omit / Valid — [G]

```ts
export type ConditionalProps = { conditional?: boolean; children?: React.ReactNode };
export type OmitProps = { omit?: boolean; children?: React.ReactNode };
export type ValidProps = { valid?: boolean; children?: React.ReactNode; invalid?: React.ReactNode };
```

## 3. Acciones

### Button — [G]

```ts
export type ButtonProps = ViewProps & {
  self?: ViewStyle["alignSelf"];
  fullWidth?: boolean;
  fw?: TextStyle["fontWeight"];
  c?: ColorScheme;
  fz?: FontSizeKeys;
  variant?: "filled" | "outline" | "light" | "link";
  isLoading?: boolean;
  disabled?: boolean;
  onPress?: (e?: any) => void;
  spinnerProps?: ActivityIndicatorProps;
  textProps?: TextProps;
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
  r?: RadiusSchema;
  gap?: SpaceSchema;
  shrink?: TextStyle["flexShrink"];
  lh?: TextStyle["lineHeight"];
} & SpaceProps &
  SizeProps;
```

Declara `accessibilityRole` (uno de los 3 únicos componentes con a11y en la app).

### Action — [G/N] — botón-icono contenedor

```ts
export type ActionProps = ViewProps & {
  gap?: SpaceSchema
  icon?: React.ReactNode
  iconSize?: number
  iconColor?: ColorScheme
  size?: number
  c?: ColorScheme
  bg?: ColorScheme
  bc?: ColorScheme
  r?: RadiusSchema
  variant?: "filled" | "outline" | "light" | "ghost"
  header?: React.ReactNode
  footer?: React.ReactNode
  children?: React.ReactNode
  href?: Href                       // acoplamiento expo-router (opcional)
  onPress?/onLongPress?/onPressOut?: () => void
  isLoading?: boolean
  disabled?: boolean
}
```

### ActionRotate — [G]

`Action` preconfigurado (icono FontAwesome6 "rotate", refresh). `ActionRotateProps = ActionProps`.

### Toggle — [G]

```ts
export type ToggleProps = Omit<RNViewProps, "children"> & {
  value?: boolean;
  onChange?: (value: boolean) => void;
  disabled?: boolean;
  isLoading?: boolean;
  spinnerProps?: ActivityIndicatorProps;
  size?: number;
  c?: ColorScheme;
};
```

Declara `accessibilityRole`.

## 4. Data display

### Badge — [G]

```ts
export type BadgeProps = Omit<TouchableHighlightProps, "children"> & {
  show?: boolean
  self?: ViewStyle["alignSelf"]
  fullWidth?: boolean
  fw?: TextStyle["fontWeight"]
  c?: ColorScheme
  fz?: FontSizeKeys
  variant?: "filled" | "outline" | "light" | "subtle"
  isLoading?: boolean
  spinnerProps?: ActivityIndicatorProps
  textProps?: TextProps
  leftSection?/rightSection?: React.ReactNode
  r?: RadiusSchema
  label?: string
  icon?: React.ReactNode
  iconPosition?: "left" | "right"
  iconSize?: number
} & SpaceProps & SizeProps
```

### Card — [G]

```ts
export type CardProps = ViewProps & {
  type?: "view" | "touchable";
  isSelected?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  flat?: boolean;
  shadowless?: boolean;
  borderless?: boolean;
  onPress?: () => void;
  skeletonProps?: Partial<SkeletonProps>;
} & AnimationCardProps;
// AnimationCardProps (animations/card.ts):
// { animationIndex?, animationDelay?, animationDisabled?, background?, onPress?, enabledPress? }
// entrada escalonada (stagger por index) + press spring con haptic, ReduceMotion.System
```

### Currency — [G]

```ts
export type CurrencyProps = Omit<TextProps, "children"> & {
  amount?: number;
  transform?: (value: string) => string;
  isLoading?: boolean;
  prefix?: string;
  suffix?: string;
};
```

### Table — [G] — compuesto (Table/Header/Row/Title/Cell)

```ts
export type TableProps = { children?; style?; bg?: ColorScheme; borderColor?: ColorScheme };
export type TableHeaderProps = { children?; style?; bg?: ColorScheme };
export type TableRowProps = { children?; style?; onPress?: () => void };
export type TableTitleProps = { children?; style?; numeric?: boolean; flex?: number };
export type TableCellProps = {
  children?;
  style?;
  numeric?: boolean;
  flex?: number;
  fz?: FontSizeKeys;
  c?: ColorScheme;
  fw?: string;
};
```

### Accordion — [G] — compuesto con genérico Multiple

```ts
export type AccordionValue<Multiple extends boolean> =
  (Multiple extends true ? string[] : string | undefined) | undefined

export type AccordionProps<Multiple extends boolean = false> = ViewProps & {
  duration?: number
  multiple?: Multiple
  value?: AccordionValue<Multiple>
  defaultValue?: AccordionValue<Multiple>
  onChange?: (value: AccordionValue<Multiple>) => void
}
export type AccordionItemProps = ViewProps & {
  id: string
  title?/subtitle?: string | React.ReactNode
  center?: React.ReactNode
  content: React.ReactNode
  before?/after?: React.ReactNode
  disabled?: boolean
  actionable?: boolean
  idx?: number
  inverted?: boolean
  wrapperProps?/headerProps?: ViewProps
}
export type AccordionHeaderProps = ViewProps & {
  title?/subtitle?: string | React.ReactNode
  center?: React.ReactNode
  inverted?: boolean
  actionable?: boolean
  progress?: SharedValue<number>
}
```

## 5. Feedback

### Skeleton — [G]

```ts
export type SkeletonProps = Omit<AnimatedProps<ViewProps>, "children"> & {
  isLoading?: boolean;
  shimmerSpeed?: number;
  shimmerBackgroundColor?: string;
  gradientColors?: [string, string];
  defaultRadius?: number;
  animationType?: "gradient" | "pulse" | "none";
  children: React.ReactNode;
};
```

### Progress — [G]

```ts
export type ProgressSegment = { value: NumberOrPercentage; color: ColorScheme };
export type ProgressProps = ViewProps & {
  type?: "circular" | "bar";
  c?: ColorScheme;
  value?: NumberOrPercentage | ProgressSegment[]; // soporta multi-segmento
  strokeWidth?: number;
  size?: number;
  isLoading?: boolean;
  borderless?: boolean;
  animationType?: "spring" | "timing" | "none";
  timingConfig?: WithTimingConfig;
  springConfig?: SpringConfig;
};
```

### Dots — [G]

```ts
export type DotsProps = ViewProps & {
  c?: ColorScheme;
  dotSize?: number;
  dots?: number;
  duration?: number;
} & SpaceProps &
  SizeProps;
```

### Toast — [G/I]

Sin `types.ts` propio: recibe `Alert` (contrato arriba). Gestos de swipe-dismiss (gesture-handler), stack de hasta 5 con offset, progreso de timeout, haptics (`GenerateFeedback`), `DateAgo`. **Acoplado al store `useAlert`** (cola de alerts en Jotai) — el patrón visual es genérico, el wiring es de la app.

### Tooltip — [G]

```ts
export type TooltipSide = "top" | "bottom" | "left" | "right"
export type TooltipPosition = TooltipSide | `${TooltipSide}-start` | `${TooltipSide}-end`
export type TooltipProps = {
  label: React.ReactNode
  children: React.ReactNode
  position?: TooltipPosition
  offset?/offsetX?/offsetY?: number
  withArrow?: boolean; arrowSize?: number; arrowOffset?: number
  bg?/c?: ColorScheme; fz?: FontSizeKeys; fw?: TextStyle["fontWeight"]; r?: RadiusSchema
  multiline?: boolean; maw?/miw?: number
  isLoading?: boolean
  opened?: boolean
  autoHide?: boolean; autoHideDuration?: number; autoHideResetKey?: string | number
  keepMounted?: boolean
  transitionDuration?: number
  labelProps?: TextProps; wrapperProps?: ViewProps; activityIndicatorProps?: ActivityIndicatorProps
  disabled?: boolean
}
```

### Refresh — [G]

`RefreshControlProps` de RN tal cual, tematizado.

## 6. Overlays

### Sheet — [G] — bottom sheet propio (sin librería externa); base de InputSelect/UpdateModal/Notifications/Logs

```ts
export type SheetProps = ViewProps & {
  sheetId?: string                    // registro global vía useSheet(id) + atom-family Jotai
  children?: React.ReactNode
  title?/subtitle?: HeaderProps["title" | "subtitle"]
  headerProps?: HeaderProps
  contentProps?: ViewProps
  header?/footer?/top?/bottom?: React.ReactNode
  modal?: boolean
  fixed?: boolean
  draggable?: boolean
  initialOpen?: boolean
  detached?: boolean
  clear?: boolean
  flat?: boolean
  hideHandle?: boolean
  closeClickOutside?: boolean
  showButtonClose?/hideButtonClose?: boolean
  hideBackdrop?: boolean
  backdropColor?: ColorScheme
  backdropOpacity?: number
  onOpened?/onClosed?: () => void
  points?: `${number}%`[]             // snap points
  pointInitial?: `${number}%`
}
```

## 7. Inputs y forms (integración `form-atoms`)

### Header — [G/F] — wrapper de label/description/error, reutilizado por todos los inputs

```ts
export type HeaderProps = Omit<ViewProps, "top"> & {
  w?: DimensionValue
  gap?: SpaceSchema
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl" | "xxxl"
  align?/justify?/ta?: TextStyle[...]
  header?/footer?/children?: React.ReactNode
  leftSection?/rightSection?: React.ReactNode
  wrapperProps?/headProps?: ViewProps
  titleProps?/subtitleProps?: TextProps
  error?: string
  errorProps?: ErrorProps
  field?: FieldAtom<any>              // lee status/error del campo automáticamente
  title?/subtitle?: string | React.ReactNode
  status?: ValidateStatus             // de form-atoms
  withBack?: boolean; onBack?: () => void; backIcon?/back?: React.ReactNode; backProps?: ActionProps
  top?/middle?/bottom?: React.ReactNode
}
```

### Error — [F]

```ts
export type ErrorProps = Partial<TooltipProps> & {
  field?: FieldAtom<any>;
  error?: string;
};
```

### InputText — [F] — input raíz del que derivan Phone/Search/Select

```ts
export type InputTextProps = TextInputProps /* RN */ & {
  title?/subtitle?: HeaderProps["title" | "subtitle"]
  headerProps?: HeaderProps
  field?: FieldAtom<any>
  leftSection?/rightSection?: React.ReactNode
  leftSectionProps?/rightSectionProps?/sectionProps?/containerProps?: ViewProps
  separator?: boolean
}
```

### InputPhone — [F]

```ts
export type InputPhoneProps = InputTextProps & { fieldDial?: FieldAtom<any> };
export type Dial = { id: string; label: string; value: string; length: number };
```

### InputSearch — [L]

```ts
export type InputSearchProps = InputTextProps & {
  atom?: PrimitiveAtom<string>; // acoplamiento a Jotai
  isRefetching?: boolean;
  isWritting?: boolean;
  onSearch?: (value: string) => void;
};
```

### InputSelect — [F] — select sobre Sheet

```ts
export type InputSelectProps = Omit<InputTextProps, "value" | "onChangeText"> & {
  actionProps?: ActionProps;
  options?: InputSelectOption[];
  sheetProps?: SheetProps;
  onSelectOption?: (option: InputSelectOption) => void;
  value?: any;
  type?: "input" | "action";
  actionIcon?: React.ReactNode;
};
export type InputSelectOption = { id: string; label: string; value: any };
```

### InputCheckbox — [F]

```ts
export type InputCheckboxProps = ActionProps & {
  title?/subtitle?: HeaderProps["title" | "subtitle"]
  headerProps?: HeaderProps
  field?: FieldAtom<any>
  leftSection?/rightSection?: React.ReactNode
  leftSectionProps?/rightSectionProps?/sectionProps?/containerProps?: ViewProps
  checked?: boolean
  onChange?: (checked: boolean) => void
  size?: number
}
```

### InputCalendar — [F]

```ts
export type InputCalendarProps = CalendarProps /* react-native-calendars */ & {
  title?/subtitle?: HeaderProps["title" | "subtitle"]
  headerProps?: HeaderProps
  onEnd?: () => void
  field?: FieldAtom<any>
}
```

### Signature — [F] — pad de firma con Skia

```ts
export type SignatureProps = {
  field?: FieldAtom<File | null>; // File de expo-file-system
  value?: File | null;
  onChange?: (file: File | null) => void;
  penColor?: string;
  backgroundColor?: string;
  strokeWidth?: number;
  h?: number;
  format?: "jpeg" | "png";
  quality?: number;
  containerProps?: ViewProps;
};
```

### Segment — [G] — segmented control compuesto (Header/Control/Content/Footer, swipeable)

```ts
export type SegmentProps = Omit<ViewProps, "children"> & {
  children: React.ReactNode
  value?/defaultValue?: string
  onChange?: (value: string) => void
  c?: ColorScheme
  size?: "sm" | "md" | "lg"
  disabled?: boolean
  fullWidth?: boolean
}
export type SegmentControlProps     = Omit<ViewProps,"children"> & { data?: SegmentDataItem[]; children?; textProps?: TextProps }
export type SegmentControlItemProps = TextProps & { value: string; disabled?: boolean }
export type SegmentContentProps     = Omit<ViewProps,"children"> & { children; swipeable?: boolean; loop?: boolean; fill?: boolean; delay?: number }
export type SegmentContentItemProps = Omit<ViewProps,"children"> & { value: string; children }
export type SegmentDataItem = { label: React.ReactNode; value: string; disabled?: boolean }
```

Declara `accessibilityRole` en `Control`.

## 8. Decorativos

### Drop — [G]

```ts
export type DropProps = { size?: number; left?/top?/bottom?/right?: number; color?: ColorScheme }
```

### Drops — [G]

Composición de 2 `Drop` con safe-area (fondo decorativo). `{ zIndex?: number; offset?: number; children?: React.ReactNode }`.

## 9. Patrón de listados (Jotai) — [L]

### HeaderFilter

```ts
export type HeaderFilterProps = {
  isFetching?: boolean
  refetch?: () => void
  atom_search: PrimitiveAtom<string>
  atom_ordering: PrimitiveAtom<string | null>
  atom_filter?: PrimitiveAtom<string | null>
  options_ordering?/options_filter?: InputSelectOption[]
  children?: React.ReactNode
}
```

### BadgesFilter — variante con callbacks (sin atoms)

```ts
export type BadgesFilterProps = {
  search?: string; setSearch?: (v: string) => void
  ordering?: string | null; setOrdering?: (v: string | null) => void
  filter?: string | null; setFilter?: (v: string | null) => void
  optionsOrdering?/optionsFilter?: { label: string; value: string }[]
}
```

## 10. Navegación — [N]

### TabBar

```ts
export type TabBarProps = BottomTabBarProps /* @react-navigation/bottom-tabs */ & {
  header?/footer?/children?: React.ReactNode
  descriptors: Record<string, BottomTabDescriptorExtended>
}
```

### Tabs

```ts
export type TabsScreenParams = { icon?: React.ReactNode; index?: number; href?: Href };
export type TabsScreenProps = Omit<ScreenProps /* expo-router */, "options"> & {
  options?: ScreenProps["options"] & TabsScreenParams;
};
```

## 11. Negocio / KYC — [B]

### Camera — cámara KYC (VisionCamera + face/document detection)

```ts
export type CameraProps = {
  visible: boolean;
  onClose: () => void;
  onCapture: (file: File, documentDetected: boolean) => void | Promise<void>;
  requireFace?: boolean;
  requireDocument?: boolean;
  documentOptional?: boolean; // detecta y reporta pero no bloquea el shutter
  allowCameraSwitch?: boolean;
  initialCamera?: "front" | "back";
  labels?: Partial<CaptureLabels>;
  thresholds?: Partial<CaptureThresholds>;
  filenamePrefix?: string;
};
export type CaptureThresholds = {
  minFaceWidth: number;
  stabilityFrames: number;
  debounceStableFrames: number;
  debounceMinIntervalMs: number;
  lostFaceTimerMs: number;
  lostDocTimerMs: number;
};
```

API razonablemente genérica, pero depende de `react-native-vision-camera` + tflite/opencv y su caso de uso es onboarding KYC.

### Bell — sin props; usa `useNotifications()` y `router.push("/promoter/notifications")`. 100% app.

### HeaderUser — `{ title?: string; progress: SharedValue<number>; banner?: boolean }`; usa `QueryMe`, `UserRole` (roles `admin`/`qa`), sheet de cambio de rol, store de altura. 100% app.

### ScreenError — [B/N]

```ts
export type ScreenErrorProps = Omit<MainProps, "children" | "title"> & {
  title?/message?: ReactNode
  image?: ImageSourcePropType; imageStyle?: StyleProp<ImageStyle>
  contentProps?: ViewProps; titleProps?/messageProps?: TextProps
  homePath?: Href; homeLabel?: ReactNode
}
```

Patrón genérico, pero el footer default usa `QueryMe` + `REDIRECT_ROLE` (redirección por rol).

### Notifications — `NotificationBanner` / `NotificationSheet`, sin props; copy fintech, `useDeviceToken`. 100% app.

## 12. Infraestructura de app — [I]

- **HeaderUpdate** — `{ progress: SharedValue<number> }`; banner OTA/build con `expo-updates`, `AtomPendingBuild`, `useStoreUrl`, `useUpdateModal`. Exporta además `HeaderUpdateProvider`, `HeaderUpdateBanner`, `HeaderUpdateCard`.
- **UpdateModal** — sin props; sheet de actualización OTA/tienda (`expo-updates`, `AtomUpdateModal`, `useResumeUpdateCheck`).
- **Splash** — `{ loader?: boolean; progress?: number; progressLabel?: string }`; logo por tema (assets propios), barra de progreso de update.
- **Theme** — sin props; selector system/dark/light sobre `useTheme` (Jotai + MMKV + UnistylesRuntime).
- **Logs** — visor de logs de debug:

```ts
export type LogsProps = {
  atom: WritableAtom<LogEntry[], any, any>;
  title: string;
  sheetId: string;
  exportPrefix: string;
  emptySubtitle: string;
};
```

---

## Resumen de disposición

| Grupo                             | Componentes                                                                                                                                                                                                                        |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **[G] núcleo migrable** (27)      | View, Text, SafeArea, Scroll, List, Main, Divider, Conditional, Omit, Valid, Button, Action, ActionRotate, Toggle, Badge, Card, Currency, Table, Accordion, Skeleton, Progress, Dots, Tooltip, Refresh, Sheet, Segment, Drop/Drops |
| **[F] atados a form-atoms** (9)   | Header, Error, InputText, InputPhone, InputSelect, InputCheckbox, InputCalendar, Signature, (InputSearch también [L])                                                                                                              |
| **[L] patrón listados Jotai** (3) | HeaderFilter, BadgesFilter, InputSearch                                                                                                                                                                                            |
| **[N] navegación** (2)            | TabBar, Tabs                                                                                                                                                                                                                       |
| **[B] negocio** (5)               | Camera, Bell, HeaderUser, ScreenError, Notifications                                                                                                                                                                               |
| **[I] infra app** (6)             | HeaderUpdate, UpdateModal, Splash, Theme, Logs, Toast (wiring)                                                                                                                                                                     |

**Observaciones transversales**

1. Todo el sistema deriva de `View`/`Text` con props tokenizadas abreviadas (`c`, `bg`, `r`, `fz`, `p/px/py`, `gap`) — mismo paradigma que el Collector de Stellaria, con menos rigor de tipos (usa `FieldAtom<any>`, `onPress?: (e?: any) => void`).
2. `isLoading` con Skeleton automático está integrado en los primitivos (`View`, `Text`) — patrón valioso a considerar en Nebula.
3. Accesibilidad: solo `Button`, `Segment.Control` y `Toggle` declaran `accessibilityRole`. Todo lo demás carece de a11y.
4. Animación por defecto en primitivos (`AnimatedProps` + `CreateAnimated`), haptics en interacciones (`GenerateFeedback`), `ReduceMotion.System` respetado en springs.
5. Cero tests en toda la app; el único gate es `tsc --noEmit`.
