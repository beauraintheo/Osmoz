import { RiArrowRightLine, RiFileCopyLine, RiSaveLine } from "@remixicon/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";

import { Button } from "./button";
import { Icon } from "./icon";

const meta = {
  args: {
    children: "Save",
    onClick: fn(),
    size: "default",
    type: "button",
    variant: "secondary",
  },
  argTypes: {
    children: { description: "See Osmoz/Button." },
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
    onClick: { description: "See Osmoz/Button." },
    pending: {
      control: "boolean",
      description: "Adds the spinner before the content and hides its icons. See Osmoz/Button.",
      table: { type: { summary: "boolean" } },
    },
    size: {
      control: "select",
      description:
        "`sm` for dense toolbars. Both sizes grow on a coarse pointer, to stay touchable.",
    },
    type: {
      control: "select",
      description: "See Osmoz/Button.",
      options: ["button", "submit", "reset"],
      table: { type: { summary: '"button" | "submit" | "reset"' } },
    },
    variant: {
      control: "select",
      description:
        "`primary` for the main action of a view, `secondary` for the others, `ghost` for a quiet action in a toolbar.",
    },
  },
  component: Button,
  parameters: {
    app: "flux",
    layout: "fullscreen",
    tokens: {
      "accent-foreground": "Background of a primary action on hover.",
      card: "Background of a secondary action.",
      foreground: "Text and icon of a secondary or ghost action.",
      input: "Border of a secondary action.",
      muted: "Background of a secondary or ghost action on hover.",
      primary: "Background and border of a primary action.",
      "primary-foreground": "Text and icon of a primary action.",
      ring: "Focus outline.",
    },
  },
  tags: ["autodocs"],
  title: "Button",
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: { actions: { disable: false }, controls: { disable: false } },
};

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

const COPY_HTML = "Copy HTML";

export const Usage: Story = {
  args: { children: "Copy CSS", variant: "primary" },
  play: async ({ canvas }): Promise<void> => {
    await expect(canvas.getAllByRole("button")).toHaveLength(2);
  },
  render: ({ children, ...args }): ReturnType<typeof Button> => (
    <div className="flex gap-2">
      <Button {...args}>
        <Icon icon={RiFileCopyLine} />
        {children}
      </Button>
      <Button>
        <Icon icon={RiFileCopyLine} />
        {COPY_HTML}
      </Button>
    </div>
  ),
  tags: ["usage"],
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
  tags: ["state"],
};
