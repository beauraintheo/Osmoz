import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { Spinner } from "./spinner";

const meta = {
  args: { size: "default" },
  argTypes: {
    label: {
      control: "text",
      description: "Visually hidden. See Osmoz/Spinner.",
      table: { type: { summary: "ReactNode" } },
    },
    size: {
      control: "select",
      description: "The sizes of Flux/Icon, so the spinner can take an icon's place.",
    },
  },
  component: Spinner,
  parameters: {
    app: "flux",
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  title: "Feedback/Spinner",
} satisfies Meta<typeof Spinner>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: { actions: { disable: false }, controls: { disable: false } },
};

export const Small: Story = {
  args: { size: "sm" },
};

export const WithLabel: Story = {
  args: { label: "Loading" },
  play: async ({ canvas }): Promise<void> => {
    await expect(canvas.getByRole("status")).toHaveTextContent("Loading");
  },
};
