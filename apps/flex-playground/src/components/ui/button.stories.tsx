import { RiArrowRightLine, RiSaveLine } from "@remixicon/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";

import { Button } from "./button";
import { Icon } from "./icon";

const meta = {
  args: { children: "Save", onClick: fn() },
  argTypes: {
    children: { description: "See UI/Button." },
    disabled: {
      control: "boolean",
      description: "See UI/Button.",
      table: { type: { summary: "boolean" } },
    },
    focusableWhenDisabled: {
      control: "boolean",
      description: "See UI/Button.",
      table: { type: { summary: "boolean" } },
    },
    onClick: { description: "See UI/Button." },
    pending: {
      control: "boolean",
      description: "Adds the spinner before the content and hides its icons. See UI/Button.",
      table: { type: { summary: "boolean" } },
    },
    size: {
      description:
        "`sm` for dense toolbars. Both sizes grow on a coarse pointer, to stay touchable.",
    },
    type: {
      control: "inline-radio",
      description: "See UI/Button.",
      options: ["button", "submit", "reset"],
      table: { type: { summary: '"button" | "submit" | "reset"' } },
    },
    variant: {
      description:
        "`primary` for the main action of a view, `secondary` for the others, `ghost` for a quiet action in a toolbar.",
    },
  },
  component: Button,
  parameters: { app: "flux", layout: "fullscreen" },
  tags: ["autodocs"],
  title: "Button",
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Secondary: Story = {};

export const Primary: Story = {
  args: { variant: "primary" },
};

export const Ghost: Story = {
  args: { variant: "ghost" },
};

export const Small: Story = {
  args: { size: "sm" },
};

export const WithIcon: Story = {
  play: async ({ canvas }): Promise<void> => {
    const button = canvas.getByRole("button", { name: "Save" });

    await expect(button.querySelector("svg[aria-hidden='true']")).not.toBeNull();
  },
  render: ({ children, ...args }): ReturnType<typeof Button> => (
    <Button {...args}>
      <Icon icon={RiSaveLine} />
      {children}
    </Button>
  ),
};

export const WithIconAtEnd: Story = {
  args: { children: "Next" },
  play: async ({ canvas }): Promise<void> => {
    const button = canvas.getByRole("button", { name: "Next" });

    await expect(button.lastElementChild).toHaveAttribute("aria-hidden", "true");
  },
  render: ({ children, ...args }): ReturnType<typeof Button> => (
    <Button {...args}>
      {children}
      <Icon icon={RiArrowRightLine} />
    </Button>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Pending: Story = {
  args: { pending: true, variant: "primary" },
  play: async ({ canvas }): Promise<void> => {
    const button = canvas.getByRole("button", { name: "Save" });

    const [spinner, icon] = button.children;

    await expect(button).toHaveAttribute("aria-busy", "true");
    await expect(button).toHaveTextContent("Save");
    await expect(spinner).toBeVisible();
    await expect(icon).not.toBeVisible();
  },
  render: ({ children, ...args }): ReturnType<typeof Button> => (
    <Button {...args}>
      <Icon icon={RiSaveLine} />
      {children}
    </Button>
  ),
};
