import { RiSaveLine } from "@remixicon/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";

import { Button } from "./button";

const meta = {
  args: { children: "Save", onClick: fn() },
  argTypes: { icon: { control: false } },
  component: Button,
  parameters: { app: "flux" },
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
  args: { icon: <RiSaveLine /> },
  play: async ({ canvas }): Promise<void> => {
    const button = canvas.getByRole("button", { name: "Save" });

    await expect(button.querySelector("[aria-hidden='true'] svg")).not.toBeNull();
  },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Pending: Story = {
  args: { icon: <RiSaveLine />, pending: true, variant: "primary" },
  play: async ({ canvas }): Promise<void> => {
    const button = canvas.getByRole("button", { name: "Save" });

    await expect(button).toHaveAttribute("aria-busy", "true");
    await expect(button.querySelectorAll("svg")).toHaveLength(1);
  },
};
