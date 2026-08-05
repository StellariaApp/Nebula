"use client";

import { useId, useMemo, type FormEvent, type ReactElement } from "react";

import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ResolveAccent } from "../../utils/scale.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { Button } from "../Button/Button.js";
import { Text } from "../Text/Text.js";
import { Title } from "../Title/Title.js";

import { FormContext, useFormContext } from "./Form.context.js";
import { banderoleColor } from "./Form.vars.css.js";
import * as styles from "./Form.css.js";
import type {
  FormBanderoleProps,
  FormContentProps,
  FormContextValue,
  FormFooterProps,
  FormHeaderProps,
  FormProps,
} from "./Form.types.js";

function FormRoot(props: FormProps): ReactElement {
  const {
    children,
    onSubmit,
    isPending = false,
    disabled = false,
    color = "primary",
    noValidate = true,
    id,
    name,
    className,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const auto_id = useId();
  const error_id = `${id ?? auto_id}-error`;

  const context = useMemo<FormContextValue>(
    () => ({ isPending, disabled, color, errorId: error_id }),
    [isPending, disabled, color, error_id],
  );

  const HandleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    if (onSubmit === undefined) return;
    event.preventDefault();
    void onSubmit(event);
  };

  return (
    <FormContext.Provider value={context}>
      <form
        className={cx(styles.root, sprinkle_class, className)}
        style={sprinkle_style}
        onSubmit={HandleSubmit}
        noValidate={noValidate}
        data-pending={isPending ? "true" : undefined}
        {...(id === undefined ? {} : { id })}
        {...(name === undefined ? {} : { name })}
      >
        <fieldset className={styles.fieldset} disabled={disabled || isPending}>
          {children}
        </fieldset>
      </form>
    </FormContext.Provider>
  );
}

function Header(props: FormHeaderProps): ReactElement {
  const { title, description, children, actions, className, ...style_rest } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  return (
    <div className={cx(styles.header, sprinkle_class, className)} style={sprinkle_style}>
      <div className={styles.header_text}>
        {title === undefined ? null : (
          <Title order={3} className={styles.title}>
            {title}
          </Title>
        )}
        {description === undefined ? null : (
          <Text component="p" c="text.secondary" fz="body3">
            {description}
          </Text>
        )}
        {children}
      </div>
      {actions === undefined ? null : <div className={styles.header_actions}>{actions}</div>}
    </div>
  );
}

function Banderole(props: FormBanderoleProps): ReactElement {
  const { children, side = "start", color, className, ...style_rest } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);
  const form = useFormContext();

  return (
    <div
      className={cx(styles.banderole, styles.banderole_side[side], sprinkle_class, className)}
      style={{
        ...assignInlineVars({ [banderoleColor]: ResolveAccent(color ?? form.color, "600") }),
        ...sprinkle_style,
      }}
    >
      {children}
    </div>
  );
}

function Content(props: FormContentProps): ReactElement {
  const { children, columns = 1, className, ...style_rest } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  return (
    <div
      className={cx(styles.content, styles.columns[columns], sprinkle_class, className)}
      style={sprinkle_style}
    >
      {children}
    </div>
  );
}

function Footer(props: FormFooterProps): ReactElement {
  const {
    children,
    error,
    submitText = "Guardar",
    cancelText = "Cancelar",
    onCancel,
    hideSubmit = false,
    align = "end",
    className,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);
  const form = useFormContext();

  return (
    <div className={cx(styles.footer, sprinkle_class, className)} style={sprinkle_style}>
      {error === undefined || error === false ? null : (
        <div className={styles.error} id={form.errorId} role="alert">
          {error}
        </div>
      )}
      <div className={cx(styles.actions, styles.align[align])}>
        {children ?? (
          <>
            {onCancel === undefined ? null : (
              <Button variant="ghost" color="gray" onPress={onCancel} disabled={form.isPending}>
                {cancelText}
              </Button>
            )}
            {hideSubmit ? null : (
              <Button
                type="submit"
                variant="filled"
                color={form.color}
                loading={form.isPending}
                disabled={form.disabled}
              >
                {submitText}
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

FormRoot.displayName = "Form";
Header.displayName = "Form.Header";
Banderole.displayName = "Form.Banderole";
Content.displayName = "Form.Content";
Footer.displayName = "Form.Footer";

export const Form = Object.assign(FormRoot, {
  Header,
  Banderole,
  Content,
  Footer,
});
