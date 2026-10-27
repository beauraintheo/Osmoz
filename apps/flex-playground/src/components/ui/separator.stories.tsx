import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { Separator } from "./separator";

const inRow: Decorator = (Story) => (
  <div className="flex h-8 items-center gap-3">
    <Story />
  </div>
);

const meta = {
  component: Separator,
  parameters: { app: "flux" },
  tags: ["autodocs"],
  title: "Separator",
} satisfies Meta<typeof Separator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {};

export const Vertical: Story = {
  args: { orientation: "vertical" },
  decorators: [inRow],
  play: async ({ canvas }): Promise<void> => {
    const separator = canvas.getByRole("separator");

    await expect(separator).toHaveAttribute("aria-orientation", "vertical");
    await expect(separator).toHaveAttribute("data-orientation", "vertical");
  },
};

export const Decorative: Story = {
  args: { decorative: true, orientation: "vertical" },
  decorators: [inRow],
  play: async ({ canvas, canvasElement }): Promise<void> => {
    await expect(canvas.queryByRole("separator")).toBeNull();
    await expect(canvasElement.querySelector("hr")).toHaveAttribute("data-orientation", "vertical");
  },
};
