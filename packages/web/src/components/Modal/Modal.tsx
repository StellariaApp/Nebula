"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type MouseEvent,
  type ReactElement,
  type SyntheticEvent,
} from "react";

import type { SizeValue } from "@stellaria/nebula-tokens";
import { assignInlineVars } from "@vanilla-extract/dynamic";
import { useDialog, usePreventScroll } from "react-aria";

import { OverlayMotion, type OverlayMotionPreset } from "../../overlays/overlay-motion.js";
import { vars } from "../../theme/contract.css.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { ButtonClose } from "../ButtonClose/ButtonClose.js";

import * as styles from "./Modal.css.js";
import type { ModalProps, ModalSide, ModalSize } from "./Modal.types.js";
import * as variables from "./Modal.vars.css.js";

const SIZE_WIDTH: Record<ModalSize, number> = {
  xs: 320,
  sm: 440,
  md: 560,
  lg: 720,
  xl: 960,
};

type Layout = "centered" | "top" | "fullScreen" | `drawer-${ModalSide}`;

const MOTION_PRESET: Record<Layout, OverlayMotionPreset> = {
  centered: "scale",
  top: "slide-down",
  fullScreen: "fade",
  "drawer-start": "edge-start",
  "drawer-end": "edge-end",
  "drawer-top": "edge-top",
  "drawer-bottom": "edge-bottom",
};

function ResolveLayout(
  full_screen: boolean,
  drawer: boolean | ModalSide | undefined,
  centered: boolean,
): Layout {
  if (full_screen) return "fullScreen";
  if (drawer === true) return "drawer-end";
  if (typeof drawer === "string") return `drawer-${drawer}`;
  return centered ? "centered" : "top";
}

function ResolveWidth(size: SizeValue): string {
  if (typeof size === "number") return `${String(size)}px`;
  if (size in SIZE_WIDTH) return `${String(SIZE_WIDTH[size as ModalSize])}px`;
  return size;
}

export function Modal(props: ModalProps): ReactElement {
  const {
    opened,
    onClose,
    children,
    title,
    subtitle,
    footer,
    size = "md",
    fullScreen = false,
    blurred = false,
    drawer,
    centered = true,
    closeOnClickOutside = true,
    closeOnEscape = true,
    withCloseButton = true,
    closeLabel = "Cerrar",
    padding = "lg",
    radius,
    className,
    bodyClassName,
    "aria-label": aria_label,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const dialog_ref = useRef<HTMLDialogElement>(null);
  const surface_ref = useRef<HTMLDivElement>(null);
  const auto_id = useId();
  const title_id = `${auto_id}-title`;

  const { dialogProps, titleProps } = useDialog(
    aria_label === undefined ? {} : { "aria-label": aria_label },
    dialog_ref,
  );

  usePreventScroll({ isDisabled: !opened });

  const [visible, set_visible] = useState(opened);

  useEffect(() => {
    if (opened) set_visible(true);
  }, [opened]);

  useEffect(() => {
    const node = dialog_ref.current;
    if (node === null) return;
    if (visible && !node.open) node.showModal();
    if (!visible && node.open) node.close();
  }, [visible]);

  const HandleExitComplete = (): void => {
    set_visible(false);
  };

  const HandleCancel = (event: SyntheticEvent<HTMLDialogElement>): void => {
    event.preventDefault();
    if (closeOnEscape) onClose();
  };

  const HandleClick = (event: MouseEvent<HTMLDialogElement>): void => {
    if (!closeOnClickOutside) return;
    if (event.target === dialog_ref.current) onClose();
  };

  const layout = ResolveLayout(fullScreen, drawer, centered);
  const has_header = title !== undefined || subtitle !== undefined || withCloseButton;

  const css_vars = assignInlineVars({
    [variables.width]: ResolveWidth(size),
    [variables.backdropBlur]: blurred ? `blur(${vars.blur.sm})` : "none",
  });

  return (
    <dialog
      {...dialogProps}
      ref={dialog_ref}
      className={cx(styles.dialog({ layout }), sprinkle_class, className)}
      style={{ ...css_vars, ...sprinkle_style }}
      onCancel={HandleCancel}
      onClick={HandleClick}
      {...(title === undefined || aria_label !== undefined ? {} : { "aria-labelledby": title_id })}
      data-open={opened ? "true" : undefined}
      data-drawer={drawer === undefined || drawer === false ? undefined : "true"}
    >
      <OverlayMotion
        open={opened}
        surface={layout.startsWith("drawer") ? "drawer" : "modal"}
        onExitComplete={HandleExitComplete}
        preset={MOTION_PRESET[layout]}
        ref={surface_ref}
        className={styles.surface({ layout, ...(radius === undefined ? {} : { radius }) })}
      >
        {has_header ? (
          <div className={styles.header}>
            <div className={styles.heading}>
              {title === undefined ? null : (
                <h2 {...titleProps} id={title_id} className={styles.title}>
                  {title}
                </h2>
              )}
              {subtitle === undefined ? null : <span className={styles.subtitle}>{subtitle}</span>}
            </div>
            {withCloseButton ? (
              <ButtonClose aria-label={closeLabel} size="sm" onPress={onClose} />
            ) : null}
          </div>
        ) : null}
        <div className={cx(styles.body({ padding }), bodyClassName)}>{children}</div>
        {footer === undefined ? null : <div className={styles.footer}>{footer}</div>}
      </OverlayMotion>
    </dialog>
  );
}

Modal.displayName = "Modal";
