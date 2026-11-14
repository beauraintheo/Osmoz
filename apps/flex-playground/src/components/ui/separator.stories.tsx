import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { Separator } from "./separator";

const LABELS = {
  container: "Container",
  css: "CSS",
  html: "HTML",
  item: "Item",
} as const;

const meta = {
  argTypes: {
    length: {
      control: "select",
      description:
        "For a vertical separator: `full` stretches to the height of its row, `inset` draws a short line centered in it, like between two groups of a toolbar.",
      table: { defaultValue: { summary: '"full"' } },
    },
    orientation: {
      control: "select",
      description: "`vertical` stretches to the height of its row. See Osmoz/Separator.",
      options: ["horizontal", "vertical"],
      table: {
        defaultValue: { summary: "horizontal" },
        type: { summary: '"horizontal" | "vertical"' },
      },
    },
  },
  component: Separator,
  parameters: {
    app: "flux",
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  title: "Display/Separator",
} satisfies Meta<typeof Separator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: { actions: { disable: false }, controls: { disable: false } },
  render: (args): ReturnType<typeof Separator> => (
    <div className="w-64">
      <Separator {...args} />
    </div>
  ),
};

export const Orientations: Story = {
  parameters: {
    docs: {
      description: {
        story: "`horizontal` between stacked blocks, `vertical` between items of a row.",
      },
    },
  },
  play: async ({ canvas }): Promise<void> => {
    const separators = canvas.getAllByRole("separator");

    await expect(separators).toHaveLength(2);
    await expect(separators[1]).toHaveAttribute("aria-orientation", "vertical");
  },
  render: (): ReturnType<typeof Separator> => (
    <div className="flex w-64 flex-col gap-3 text-control">
      <span>{LABELS.container}</span>
      <Separator orientation="horizontal" />
      <div className="flex h-6 items-center gap-3">
        <span>{LABELS.css}</span>
        <Separator orientation="vertical" />
        <span>{LABELS.html}</span>
      </div>
    </div>
  ),
};

export const StretchesToItsRow: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "A vertical separator takes the height of its row, even when the row centers its items.",
      },
    },
  },
  play: async ({ canvas, canvasElement }): Promise<void> => {
    const row = canvasElement.querySelector("[data-row]");
    const separator = canvas.getByRole("separator");

    await expect(separator.getBoundingClientRect().height).toBe(
      row?.getBoundingClientRect().height,
    );
  },
  render: (): ReturnType<typeof Separator> => (
    <div className="flex h-12 items-center gap-3 text-control" data-row>
      <span>{LABELS.item}</span>
      <Separator orientation="vertical" />
      <span>{LABELS.item}</span>
    </div>
  ),
  tags: ["edge-case"],
};

export const Inset: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`length="inset"` draws a short line centered in its row, whatever the row\'s height.',
      },
    },
  },
  play: async ({ canvas, canvasElement }): Promise<void> => {
    const row = canvasElement.querySelector("[data-row]")?.getBoundingClientRect();
    const separator = canvas.getByRole("separator").getBoundingClientRect();

    await expect(separator.height).toBe(20);
    await expect(separator.top + separator.height / 2).toBe(row && row.top + row.height / 2);
  },
  render: (): ReturnType<typeof Separator> => (
    <div className="flex h-14 items-center gap-3 py-2 text-control" data-row>
      <span>{LABELS.css}</span>
      <Separator length="inset" orientation="vertical" />
      <span>{LABELS.html}</span>
    </div>
  ),
};
