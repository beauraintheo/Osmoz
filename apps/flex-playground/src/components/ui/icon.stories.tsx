import { RiAlertLine } from "@remixicon/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { Icon } from "./icon";

const meta = {
  args: { icon: RiAlertLine },
  argTypes: {
    icon: { control: false, description: "A Remix icon component. See UI/Icon." },
    label: {
      control: "text",
      description: "See UI/Icon.",
      table: { type: { summary: "string" } },
    },
    size: {
      description:
        "`default` grows on a coarse pointer, next to touch-sized controls. `sm` keeps its size.",
    },
  },
  component: Icon,
  parameters: { app: "flux", layout: "fullscreen" },
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
