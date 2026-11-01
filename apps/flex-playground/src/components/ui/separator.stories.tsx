import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { Separator } from "./separator";

const inRow: Decorator = (Story) => (
  <div className="flex h-8 items-center gap-3">
    <Story />
  </div>
);

const meta = {
  argTypes: {
    decorative: {
      control: "boolean",
      description: "See UI/Separator.",
      table: { type: { summary: "boolean" } },
    },
    orientation: {
      control: "inline-radio",
      description: "`vertical` stretches to the height of its row. See UI/Separator.",
      options: ["horizontal", "vertical"],
      table: {
        defaultValue: { summary: "horizontal" },
        type: { summary: '"horizontal" | "vertical"' },
      },
    },
  },
  component: Separator,
  parameters: { app: "flux", layout: "fullscreen" },
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
