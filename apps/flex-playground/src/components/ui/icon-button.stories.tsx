import { RiArrowGoBackLine } from "@remixicon/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";

import { IconButton } from "./icon-button";

const meta = {
  args: {
    icon: RiArrowGoBackLine,
    label: "Undo",
    onClick: fn(),
  },
  argTypes: { icon: { control: false } },
  component: IconButton,
  parameters: { app: "flux", layout: "fullscreen" },
  tags: ["autodocs"],
  title: "IconButton",
} satisfies Meta<typeof IconButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Ghost: Story = {};

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
};

export const Pending: Story = {
  args: { pending: true },
  play: async ({ canvas }): Promise<void> => {
    const button = canvas.getByRole("button", { name: "Undo" });

    await expect(button).toHaveAttribute("aria-busy", "true");
    await expect(button.querySelectorAll("svg")).toHaveLength(1);
  },
};
