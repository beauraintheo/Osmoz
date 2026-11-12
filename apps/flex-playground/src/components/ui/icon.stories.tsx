import { RiAlertLine, RiInformationLine } from "@remixicon/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { Icon } from "./icon";

const LABELS = {
  hint: "justify-content aligns the items along the main axis of the container.",
  warning: "Warning",
} as const;

const meta = {
  args: { icon: RiAlertLine },
  argTypes: {
    icon: { control: false, description: "A Remix icon component. See Osmoz/Icon." },
    label: {
      control: "text",
      description: "See Osmoz/Icon.",
      table: { type: { summary: "string" } },
    },
    size: {
      control: "select",
      description:
        "Both are 16px with a mouse. `default` grows to 20px on a coarse pointer, next to touch-sized controls. `sm` keeps its size.",
    },
  },
  component: Icon,
  parameters: {
    app: "flux",
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  title: "Display/Icon",
} satisfies Meta<typeof Icon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: { actions: { disable: false }, controls: { disable: false } },
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Both are 16px with a mouse: they differ only on a touch screen. `default` goes next to a control and grows with it to 20px on a coarse pointer. `sm` goes inside a small control and stays at 16px.",
      },
    },
  },
  play: async ({ canvasElement }): Promise<void> => {
    const widths = [...canvasElement.querySelectorAll("svg")].map(
      (icon) => icon.getBoundingClientRect().width,
    );

    await expect(widths).toStrictEqual([16, 16]);
  },
  render: (): ReturnType<typeof Icon> => (
    <div className="flex items-center gap-4">
      <Icon icon={RiAlertLine} />
      <Icon icon={RiAlertLine} size="sm" />
    </div>
  ),
};

export const WithLabel: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "An icon that carries meaning alone gets a `label`, read by assistive technologies. Without one, it is decorative.",
      },
    },
  },
  play: async ({ canvas }): Promise<void> => {
    await expect(canvas.getByRole("img", { name: LABELS.warning })).toBeVisible();
  },
  render: (): ReturnType<typeof Icon> => <Icon icon={RiAlertLine} label={LABELS.warning} />,
};

export const NextToALongText: Story = {
  parameters: {
    docs: {
      description: {
        story: "In a narrow row, the text wraps and the icon keeps its size.",
      },
    },
  },
  play: async ({ canvasElement }): Promise<void> => {
    const icon = canvasElement.querySelector("svg");
    const { height, width } = icon?.getBoundingClientRect() ?? { height: 0, width: 0 };

    await expect(width).toBeGreaterThan(0);
    await expect(width).toBe(height);
  },
  render: (): ReturnType<typeof Icon> => (
    <p className="flex w-48 items-start gap-2 text-body">
      <Icon icon={RiInformationLine} />
      <span>{LABELS.hint}</span>
    </p>
  ),
  tags: ["edge-case"],
};
