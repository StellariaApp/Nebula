import type { Meta, StoryObj } from "@storybook/react-vite";

import NumberInputControlled from "@stellaria/nebula-demos/NumberInput/Controlled.js";
import PasswordInputBasic from "@stellaria/nebula-demos/PasswordInput/Basic.js";
import SearchInputBasic from "@stellaria/nebula-demos/SearchInput/Basic.js";
import TextareaAutosize from "@stellaria/nebula-demos/Textarea/Autosize.js";
import TextInputBasic from "@stellaria/nebula-demos/TextInput/Basic.js";
import TextInputSizes from "@stellaria/nebula-demos/TextInput/Sizes.js";

const meta: Meta = {
  title: "Forms/Inputs",
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj;

export const Text: Story = { render: () => <TextInputBasic /> };

export const Sizes: Story = { render: () => <TextInputSizes /> };

export const Password: Story = { render: () => <PasswordInputBasic /> };

export const Search: Story = { render: () => <SearchInputBasic /> };

export const Number: Story = { render: () => <NumberInputControlled /> };

export const Multiline: Story = { render: () => <TextareaAutosize /> };

export const Dark: Story = { ...Text, globals: { theme: "dark" } };
