import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactElement } from "react";
import { expect } from "storybook/test";

import { Heading } from "./heading";
import { Stack } from "./stack";

const LABELS = {
  label: "Label",
  overline: "Overline",
  title: "Title",
} as const;

const meta = {
  args: {
    children: LABELS.title,
    level: 1,
  },
  argTypes: {
    children: { description: "See Osmoz/Heading." },
    level: {
      control: "select",
      description: "See Osmoz/Heading. It never changes the look: `variant` does.",
    },
    variant: {
      control: "select",
      description:
        "The typography role: `title` for the app's name and page titles, `overline` above a group of controls, `label` for a small region title.",
      table: { defaultValue: { summary: '"title"' } },
    },
  },
  component: Heading,
  parameters: {
    app: "flux",
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  title: "Typography/Heading",
} satisfies Meta<typeof Heading>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: { actions: { disable: false }, controls: { disable: false } },
};

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`title`, the default, and `label` in Geist Mono; `overline` in Geist capitals, above a group of controls.",
      },
    },
  },
  play: async ({ canvas }): Promise<void> => {
    const title = canvas.getByRole("heading", { name: LABELS.title });
    const overline = canvas.getByRole("heading", { name: LABELS.overline });

    await expect(getComputedStyle(title).fontFamily).toMatch(/Mono/);
    await expect(getComputedStyle(overline).fontFamily).not.toMatch(/Mono/);
  },
  render: (): ReactElement => (
    <Stack gap={2}>
      <Heading level={2}>{LABELS.title}</Heading>
      <Heading level={3} variant="overline">
        {LABELS.overline}
      </Heading>
      <Heading level={3} variant="label">
        {LABELS.label}
      </Heading>
    </Stack>
  ),
};

export const LevelApartFromLook: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The level follows the outline, the variant follows the mockup: an `h2` and an `h3` can share a look.",
      },
    },
  },
  play: async ({ canvas }): Promise<void> => {
    const h2 = canvas.getByRole("heading", { level: 2 });
    const h3 = canvas.getByRole("heading", { level: 3 });

    await expect(getComputedStyle(h2).fontSize).toBe(getComputedStyle(h3).fontSize);
  },
  render: (): ReactElement => (
    <Stack gap={2}>
      <Heading level={2} variant="overline">
        {LABELS.overline}
      </Heading>
      <Heading level={3} variant="overline">
        {LABELS.label}
      </Heading>
    </Stack>
  ),
  tags: ["edge-case"],
};
