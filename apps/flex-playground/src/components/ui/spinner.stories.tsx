import { RiSaveLine } from "@remixicon/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { Icon } from "./icon";
import { Spinner } from "./spinner";

const LABELS = {
  loading: "Loading",
} as const;

const meta = {
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

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: "The sizes of Flux/Icon. It turns only when the visitor allows motion.",
      },
    },
  },
  play: async ({ canvasElement }): Promise<void> => {
    await expect(canvasElement.querySelectorAll("svg")).toHaveLength(2);
  },
  render: (): ReturnType<typeof Spinner> => (
    <div className="flex items-center gap-4">
      <Spinner />
      <Spinner size="sm" />
    </div>
  ),
};

export const WithLabel: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "A spinner that stands alone gets a `label`, announced as a status. Inside a pending button, the button's `aria-busy` says it instead.",
      },
    },
  },
  play: async ({ canvas }): Promise<void> => {
    await expect(canvas.getByRole("status")).toHaveTextContent(LABELS.loading);
  },
  render: (): ReturnType<typeof Spinner> => <Spinner label={LABELS.loading} />,
};

export const TakesAnIconsPlace: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The spinner has the size of the icon it replaces, so a control does not move when it starts loading.",
      },
    },
  },
  play: async ({ canvasElement }): Promise<void> => {
    const [icon, spinner] = Array.from(canvasElement.querySelectorAll("svg"), (svg) =>
      svg.getBoundingClientRect(),
    );

    await expect(spinner?.width).toBe(icon?.width);
    await expect(spinner?.height).toBe(icon?.height);
  },
  render: (): ReturnType<typeof Spinner> => (
    <div className="flex items-center gap-2">
      <Icon icon={RiSaveLine} />
      <Spinner />
    </div>
  ),
  tags: ["edge-case"],
};
