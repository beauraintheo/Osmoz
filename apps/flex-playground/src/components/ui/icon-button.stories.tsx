import { RiArrowGoBackLine } from "@remixicon/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";

import { IconButton } from "./icon-button";

const meta = {
  args: {
    icon: RiArrowGoBackLine,
    label: "Undo",
    onClick: fn(),
    size: "default",
    type: "button",
    variant: "ghost",
  },
  argTypes: {
    disabled: {
      control: "boolean",
      description: "See Osmoz/Button.",
      table: { type: { summary: "boolean" } },
    },
    focusableWhenDisabled: {
      control: "boolean",
      description: "See Osmoz/Button.",
      table: { type: { summary: "boolean" } },
    },
    icon: {
      control: false,
      description: "A Remix icon component, sized by `size`.",
      table: { type: { summary: "ComponentType<SVGProps>" } },
    },
    label: { description: "See Osmoz/IconButton." },
    onClick: { description: "See Osmoz/Button." },
    pending: {
      control: "boolean",
      description: "Replaces the icon with the spinner. See Osmoz/Button.",
      table: { type: { summary: "boolean" } },
    },
    size: { control: "select", description: "See Flux/Button." },
    type: {
      control: "select",
      description: "See Osmoz/Button.",
      options: ["button", "submit", "reset"],
      table: { type: { summary: '"button" | "submit" | "reset"' } },
    },
    variant: {
      control: "select",
      description: "`ghost` by default, the usual look of a toolbar action. See Flux/Button.",
    },
  },
  component: IconButton,
  parameters: {
    actions: { disable: true },
    app: "flux",
    controls: { disable: true },
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  title: "IconButton",
} satisfies Meta<typeof IconButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: { actions: { disable: false }, controls: { disable: false } },
};

export const Secondary: Story = {
  args: { variant: "secondary" },
};

export const Primary: Story = {
  args: { variant: "primary" },
};

export const Small: Story = {
  args: { size: "sm" },
};

export const Disabled: Story = {
  args: { disabled: true },
  tags: ["state"],
};

export const FocusableWhenDisabled: Story = {
  args: { disabled: true, focusableWhenDisabled: true },
  tags: ["state"],
};

export const Pending: Story = {
  args: { pending: true },
  play: async ({ canvas }): Promise<void> => {
    const button = canvas.getByRole("button", { name: "Undo" });

    await expect(button).toHaveAttribute("aria-busy", "true");
    await expect(button.querySelectorAll("svg")).toHaveLength(1);
  },
  tags: ["state"],
};
