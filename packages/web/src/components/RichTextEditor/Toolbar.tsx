"use client";

import { useState, type ReactElement } from "react";

import type { Editor } from "@tiptap/react";

import { cx } from "../../utils/style-props.js";
import { ActionIcon } from "../ActionIcon/ActionIcon.js";
import { Box } from "../Box/Box.js";
import type { BoxSlotProps } from "../Box/Box.types.js";
import { Button } from "../Button/Button.js";
import { Popover } from "../Popover/Popover.js";
import { TextInput } from "../TextInput/TextInput.js";

import * as styles from "./RichTextEditor.css.js";
import { ACTION_ICONS } from "./icons.js";
import type { RichTextAction, RichTextGroup, RichTextLabels } from "./RichTextEditor.types.js";

interface ToolbarProps {
  editor: Editor;
  groups: readonly RichTextGroup[];
  labels: RichTextLabels;
  disabled: boolean;
  slotProps?: BoxSlotProps | undefined;
  groupProps?: BoxSlotProps | undefined;
}

function IsActive(editor: Editor, action: RichTextAction): boolean {
  switch (action) {
    case "bold":
    case "italic":
    case "underline":
    case "strike":
    case "code":
    case "blockquote":
    case "codeBlock":
    case "link":
      return editor.isActive(action === "codeBlock" ? "codeBlock" : action);
    case "h1":
      return editor.isActive("heading", { level: 1 });
    case "h2":
      return editor.isActive("heading", { level: 2 });
    case "h3":
      return editor.isActive("heading", { level: 3 });
    case "bulletList":
      return editor.isActive("bulletList");
    case "orderedList":
      return editor.isActive("orderedList");
    default:
      return false;
  }
}

function Run(editor: Editor, action: RichTextAction): void {
  const chain = editor.chain().focus();
  switch (action) {
    case "bold":
      chain.toggleBold().run();
      return;
    case "italic":
      chain.toggleItalic().run();
      return;
    case "underline":
      chain.toggleUnderline().run();
      return;
    case "strike":
      chain.toggleStrike().run();
      return;
    case "code":
      chain.toggleCode().run();
      return;
    case "h1":
      chain.toggleHeading({ level: 1 }).run();
      return;
    case "h2":
      chain.toggleHeading({ level: 2 }).run();
      return;
    case "h3":
      chain.toggleHeading({ level: 3 }).run();
      return;
    case "bulletList":
      chain.toggleBulletList().run();
      return;
    case "orderedList":
      chain.toggleOrderedList().run();
      return;
    case "blockquote":
      chain.toggleBlockquote().run();
      return;
    case "codeBlock":
      chain.toggleCodeBlock().run();
      return;
    case "horizontalRule":
      chain.setHorizontalRule().run();
      return;
    case "unlink":
      chain.unsetLink().run();
      return;
    case "clear":
      chain.unsetAllMarks().clearNodes().run();
      return;
    case "undo":
      chain.undo().run();
      return;
    case "redo":
      chain.redo().run();
      return;
    case "link":
      return;
  }
}

function LinkAction(props: {
  editor: Editor;
  labels: RichTextLabels;
  disabled: boolean;
}): ReactElement {
  const { editor, labels, disabled } = props;
  const [opened, set_opened] = useState(false);
  const [href, set_href] = useState("");

  const Apply = (): void => {
    const value = href.trim();
    if (value === "") {
      editor.chain().focus().unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: value }).run();
    }
    set_opened(false);
    set_href("");
  };

  return (
    <Popover
      opened={opened}
      onOpenChange={set_opened}
      placement="bottom start"
      padding="sm"
      width={280}
      aria-label={labels.link}
      trigger={
        <ActionIcon
          variant="ghost"
          size="sm"
          aria-label={labels.link}
          aria-pressed={editor.isActive("link")}
          disabled={disabled}
        >
          {ACTION_ICONS.link}
        </ActionIcon>
      }
    >
      <TextInput
        label={labels.linkPrompt}
        value={href}
        onChange={set_href}
        type="url"
        placeholder="https://"
        onKeyDown={(event) => {
          if (event.key !== "Enter") return;
          event.preventDefault();
          Apply();
        }}
      />
      <Button size="sm" mt="sm" onPress={Apply}>
        {labels.link}
      </Button>
    </Popover>
  );
}

export function Toolbar(props: ToolbarProps): ReactElement {
  const { editor, groups, labels, disabled, slotProps, groupProps } = props;

  return (
    <Box
      aria-label={labels.toolbar}
      {...slotProps}
      role="toolbar"
      className={cx(styles.toolbar, slotProps?.className)}
    >
      {groups.map((group) => (
        <Box
          key={group.join("-")}
          {...groupProps}
          className={cx(styles.group, groupProps?.className)}
        >
          {group.map((action) =>
            action === "link" ? (
              <LinkAction key={action} editor={editor} labels={labels} disabled={disabled} />
            ) : (
              <ActionIcon
                key={action}
                variant="ghost"
                size="sm"
                aria-label={labels[action]}
                aria-pressed={IsActive(editor, action)}
                disabled={disabled}
                onPress={() => {
                  Run(editor, action);
                }}
              >
                {ACTION_ICONS[action]}
              </ActionIcon>
            ),
          )}
        </Box>
      ))}
    </Box>
  );
}

Toolbar.displayName = "RichTextEditorToolbar";
