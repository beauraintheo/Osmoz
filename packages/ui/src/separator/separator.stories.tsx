import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { Separator } from "./separator.tsx";

const meta = {
  args: {},
  component: Separator,
  title: "Separator",
} satisfies Meta<typeof Separator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }): Promise<void> => {
    const separator = canvas.getByRole("separator");

    await expect(separator).toHaveAttribute("aria-orientation", "horizontal");
    await expect(separator).toHaveAttribute("data-orientation", "horizontal");
  },
};

export const Vertical: Story = {
  args: { orientation: "vertical" },
  play: async ({ canvas }): Promise<void> => {
    const separator = canvas.getByRole("separator");

    await expect(separator).toHaveAttribute("aria-orientation", "vertical");
    await expect(separator).toHaveAttribute("data-orientation", "vertical");
  },
};

export const Decorative: Story = {
  args: { decorative: true, orientation: "vertical" },
  play: async ({ canvas, canvasElement }): Promise<void> => {
    const separator = canvasElement.querySelector("hr");

    await expect(canvas.queryByRole("separator")).toBeNull();
    await expect(separator).toHaveAttribute("role", "none");
    await expect(separator).not.toHaveAttribute("aria-orientation");
    await expect(separator).toHaveAttribute("data-orientation", "vertical");
  },
};
