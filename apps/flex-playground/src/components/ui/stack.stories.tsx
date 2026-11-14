import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactElement } from "react";
import { expect } from "storybook/test";

import { Stack } from "./stack";

const ITEMS = ["1", "2", "3"] as const;

interface BoxProps {
  label: string;
}

const Box = ({ label }: BoxProps): ReactElement => (
  <div className="flex size-8 items-center justify-center rounded-sm border border-item-border bg-item text-tile text-item-foreground">
    {label}
  </div>
);

const boxes = ITEMS.map((label) => <Box key={label} label={label} />);

const gapOf = (element: HTMLElement): string => getComputedStyle(element).columnGap;

const meta = {
  args: {
    children: boxes,
    gap: 2,
  },
  argTypes: {
    align: {
      control: "select",
      description: "Aligns the children across the stack: `align-items`.",
      table: { defaultValue: { summary: '"stretch"' } },
    },
    children: { control: false, description: "The components to stack." },
    direction: {
      control: "select",
      description: "`column` stacks the children, `row` lines them up.",
      table: { defaultValue: { summary: '"column"' } },
    },
    gap: {
      control: "select",
      description:
        "The space between children, in steps of 4 px. Required: every stack decides its spacing. A step off the 4 px grid does not compile.",
    },
    justify: {
      control: "select",
      description: "Distributes the children along the stack: `justify-content`.",
      table: { defaultValue: { summary: '"start"' } },
    },
  },
  component: Stack,
  parameters: {
    app: "flux",
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  title: "Layout/Stack",
} satisfies Meta<typeof Stack>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: { actions: { disable: false }, controls: { disable: false } },
};

export const Directions: Story = {
  parameters: {
    docs: {
      description: {
        story: "`column`, the default, stacks the children; `row` lines them up.",
      },
    },
  },
  play: async ({ canvasElement }): Promise<void> => {
    const [column, row] = canvasElement.querySelectorAll<HTMLElement>("[data-stack]");

    await expect(column && getComputedStyle(column).flexDirection).toBe("column");
    await expect(row && getComputedStyle(row).flexDirection).toBe("row");
  },
  render: (): ReactElement => (
    <Stack direction="row" gap={8}>
      <Stack data-stack gap={2}>
        {boxes}
      </Stack>
      <Stack data-stack direction="row" gap={2}>
        {boxes}
      </Stack>
    </Stack>
  ),
};

export const Gaps: Story = {
  parameters: {
    docs: {
      description: {
        story: "Each step is 4 px: `1` is 4 px, `4` is 16 px. Half steps do not exist.",
      },
    },
  },
  play: async ({ canvasElement }): Promise<void> => {
    const stacks = [...canvasElement.querySelectorAll<HTMLElement>("[data-stack]")];

    await expect(stacks.map(gapOf)).toEqual(["4px", "8px", "16px"]);
  },
  render: (): ReactElement => (
    <Stack gap={6}>
      <Stack data-stack direction="row" gap={1}>
        {boxes}
      </Stack>
      <Stack data-stack direction="row" gap={2}>
        {boxes}
      </Stack>
      <Stack data-stack direction="row" gap={4}>
        {boxes}
      </Stack>
    </Stack>
  ),
};

export const Alignment: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`align` places the children across the stack, `justify` along it, here centered in a row with `between`.",
      },
    },
  },
  play: async ({ canvasElement }): Promise<void> => {
    const stack = canvasElement.querySelector<HTMLElement>("[data-stack]");
    const style = stack && getComputedStyle(stack);

    await expect(style?.alignItems).toBe("center");
    await expect(style?.justifyContent).toBe("space-between");
  },
  render: (): ReactElement => (
    <Stack
      align="center"
      className="h-16 w-64"
      data-stack
      direction="row"
      gap={2}
      justify="between"
    >
      {boxes}
    </Stack>
  ),
};
