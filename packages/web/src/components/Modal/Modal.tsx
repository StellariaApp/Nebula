"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type PointerEvent,
  type ReactElement,
  type SyntheticEvent,
} from "react";

import type { SizeValue } from "@stellaria/nebula-tokens";
import { assignInlineVars } from "@vanilla-extract/dynamic";
import { UNSAFE_PortalProvider, useDialog, usePreventScroll } from "react-aria";

import { OverlayMotion, type OverlayMotionPreset } from "../../overlays/overlay-motion.js";
import { vars } from "@stellaria/nebula-themes/web";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { ButtonClose } from "../ButtonClose/ButtonClose.js";

import * as styles from "./Modal.css.js";
import type { ModalProps, ModalSide, ModalSize } from "./Modal.types.js";
import * as variables from "./Modal.vars.css.js";
import { Box } from "../Box/Box.js";
import { Text } from "../Text/Text.js";

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
    content,
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
    closeLabel = "Close",
    padding = "lg",
    radius,
    className,
    headerProps,
    headingProps,
    titleProps,
    subtitleProps,
    bodyProps,
    footerProps,
    bodyClassName,
    "aria-label": aria_label,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const dialog_ref = useRef<HTMLDialogElement>(null);
  const surface_ref = useRef<HTMLDivElement>(null);
  const [portal_node, set_portal_node] = useState<HTMLDivElement | null>(null);
  const pressed_outside = useRef(false);
  const auto_id = useId();
  const title_id = `${auto_id}-title`;

  const { dialogProps, titleProps: aria_title } = useDialog(
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

  const GetPortalContainer = (): HTMLElement | null => portal_node;

  const HandleCancel = (event: SyntheticEvent<HTMLDialogElement>): void => {
    event.preventDefault();
    if (closeOnEscape) onClose();
  };

  const PressedOutside = (event: PointerEvent<HTMLDialogElement>): boolean => {
    if (event.target !== dialog_ref.current) return false;
    const panel = surface_ref.current;
    if (panel === null) return true;
    if (panel.hasAttribute("inert")) return false;
    const box = panel.getBoundingClientRect();
    return (
      event.clientX < box.left ||
      event.clientX > box.right ||
      event.clientY < box.top ||
      event.clientY > box.bottom
    );
  };

  const HandlePointerDown = (event: PointerEvent<HTMLDialogElement>): void => {
    pressed_outside.current = PressedOutside(event);
  };

  const HandleClick = (): void => {
    const outside = pressed_outside.current;
    pressed_outside.current = false;
    if (!closeOnClickOutside) return;
    if (outside) onClose();
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
      onPointerDown={HandlePointerDown}
      onClick={HandleClick}
      {...(title === undefined || aria_label !== undefined ? {} : { "aria-labelledby": title_id })}
      data-open={opened ? "true" : undefined}
      data-drawer={drawer === undefined || drawer === false ? undefined : "true"}
    >
      <UNSAFE_PortalProvider getContainer={GetPortalContainer}>
        <OverlayMotion
          open={opened}
          surface={layout.startsWith("drawer") ? "drawer" : "modal"}
          onExitComplete={HandleExitComplete}
          preset={MOTION_PRESET[layout]}
          ref={surface_ref}
          className={styles.surface({
            layout,
            bare: content !== undefined,
            ...(radius === undefined ? {} : { radius }),
          })}
        >
          {content ?? (
            <>
              {has_header ? (
                <Box {...headerProps} className={cx(styles.header, headerProps?.className)}>
                  <Box {...headingProps} className={cx(styles.heading, headingProps?.className)}>
                    {title === undefined ? null : (
                      <Text
                        component="h2"
                        {...aria_title}
                        {...titleProps}
                        id={title_id}
                        className={cx(styles.title, titleProps?.className)}
                      >
                        {title}
                      </Text>
                    )}
                    {subtitle === undefined ? null : (
                      <Text
                        component="span"
                        {...subtitleProps}
                        className={cx(styles.subtitle, subtitleProps?.className)}
                      >
                        {subtitle}
                      </Text>
                    )}
                  </Box>
                  {withCloseButton ? (
                    <ButtonClose aria-label={closeLabel} size="sm" onPress={onClose} />
                  ) : null}
                </Box>
              ) : null}
              <Box
                {...bodyProps}
                className={cx(styles.body({ padding }), bodyClassName, bodyProps?.className)}
              >
                {children}
              </Box>
              {footer === undefined ? null : (
                <Box {...footerProps} className={cx(styles.footer, footerProps?.className)}>
                  {footer}
                </Box>
              )}
            </>
          )}
        </OverlayMotion>
      </UNSAFE_PortalProvider>
      <div ref={set_portal_node} className={styles.portal} />
    </dialog>
  );
}

Modal.displayName = "Modal";
