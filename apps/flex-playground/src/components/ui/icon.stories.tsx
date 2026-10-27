import { RiAlertLine } from "@remixicon/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { Icon } from "./icon";

const meta = {
  args: { icon: RiAlertLine },
  argTypes: { icon: { control: false } },
  component: Icon,
  parameters: { app: "flux" },
  tags: ["autodocs"],
  title: "Icon",
} satisfies Meta<typeof Icon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Small: Story = {
  args: { size: "sm" },
};

export const WithLabel: Story = {
  args: { label: "Warning" },
  play: async ({ canvas }): Promise<void> => {
    await expect(canvas.getByRole("img", { name: "Warning" })).toBeVisible();
  },
};
