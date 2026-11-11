import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import type { CSSProperties } from "react";
import { expect } from "storybook/test";

import { Separator } from "./separator.tsx";

const LAYOUTS = {
  horizontal: { minWidth: "6rem", width: "100%" },
  vertical: { display: "flex", height: "2rem" },
} as const satisfies Record<string, CSSProperties>;

const inLayout: Decorator = (Story, { args }) => (
  <div
    data-story-layout=""
    style={LAYOUTS[args.orientation === "vertical" ? "vertical" : "horizontal"]}
  >
    <Story />
  </div>
);

const meta = {
  argTypes: {
    orientation: {
      control: "select",
      description:
        "Set as `aria-orientation` and `data-orientation`, so the app draws the line in the right direction.",
      options: ["horizontal", "vertical"],
      table: {
        defaultValue: { summary: '"horizontal"' },
        type: { summary: '"horizontal" | "vertical"' },
      },
    },
  },
  component: Separator,
  decorators: [inLayout],
  title: "Display/Separator",
} satisfies Meta<typeof Separator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: { actions: { disable: false }, controls: { disable: false } },
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
  tags: ["!dev"],
};
