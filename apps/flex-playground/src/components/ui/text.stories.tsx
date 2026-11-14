import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactElement } from "react";
import { expect } from "storybook/test";

import { Stack } from "./stack";
import { Text } from "./text";

const LABELS = {
  body: "Body: the explanation of a property.",
  canvas: "Canvas: an item on the canvas.",
  code: "Code: justify-content: center;",
  control: "Control: a value to pick.",
  default: "Default: the main text.",
  inline: "Inline in a sentence",
  label: "Label: the name of a field.",
  long: "flex-basis-is-a-very-long-unbroken-value-that-must-not-overflow-its-parent",
  muted: "Muted: a hint beside it.",
  overline: "Overline: a group of controls.",
  sentence: "A paragraph with an ",
  tile: "Tile: the number of an item.",
} as const;

const VARIANTS = ["body", "control", "label", "overline", "code", "canvas", "tile"] as const;

const meta = {
  args: { children: LABELS.body },
  argTypes: {
    as: {
      control: "select",
      description:
        "`p` for a paragraph, `span` for text inside a line, like a label beside a title.",
      options: ["p", "span"],
      table: { defaultValue: { summary: '"p"' } },
    },
    children: { description: "The text, from the app's catalog." },
    tone: {
      control: "select",
      description: "`muted` for secondary text: a hint, a tagline, a caption.",
      table: { defaultValue: { summary: '"default"' } },
    },
    variant: {
      control: "select",
      description:
        "The typography role: size, line height, weight and font family come with it. A title is a `Heading`, never a `Text`.",
      options: VARIANTS,
      table: { defaultValue: { summary: '"body"' } },
    },
  },
  component: Text,
  parameters: {
    app: "flux",
    layout: "fullscreen",
    tokens: {
      foreground: "Default text.",
      "muted-foreground": "Muted text.",
    },
  },
  tags: ["autodocs"],
  title: "Typography/Text",
} satisfies Meta<typeof Text>;

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
          "One role per use. `code` and `label` are set in Geist Mono, every other role in Geist.",
      },
    },
  },
  play: async ({ canvas }): Promise<void> => {
    const code = canvas.getByText(LABELS.code);
    const body = canvas.getByText(LABELS.body);

    await expect(getComputedStyle(code).fontFamily).toMatch(/Mono/);
    await expect(getComputedStyle(body).fontFamily).not.toMatch(/Mono/);
  },
  render: (): ReactElement => (
    <Stack gap={2}>
      {VARIANTS.map((variant) => (
        <Text key={variant} variant={variant}>
          {LABELS[variant]}
        </Text>
      ))}
    </Stack>
  ),
};

export const Tones: Story = {
  parameters: {
    docs: {
      description: {
        story: "`default` for the main text, `muted` for what comes beside it.",
      },
    },
  },
  play: async ({ canvas }): Promise<void> => {
    const main = canvas.getByText(LABELS.default);
    const muted = canvas.getByText(LABELS.muted);

    await expect(getComputedStyle(main).color).not.toBe(getComputedStyle(muted).color);
  },
  render: (): ReactElement => (
    <Stack gap={1}>
      <Text>{LABELS.default}</Text>
      <Text tone="muted">{LABELS.muted}</Text>
    </Stack>
  ),
};

export const Inline: Story = {
  parameters: {
    docs: {
      description: {
        story: '`as="span"` keeps the text inside its line, here within a paragraph.',
      },
    },
  },
  play: async ({ canvas }): Promise<void> => {
    const inline = canvas.getByText(LABELS.inline);

    await expect(inline.tagName).toBe("SPAN");
    await expect(inline.parentElement?.tagName).toBe("P");
  },
  render: (): ReactElement => (
    <Text>
      {LABELS.sentence}
      <Text as="span" variant="code">
        {LABELS.inline}
      </Text>
    </Text>
  ),
};

export const LongUnbrokenValue: Story = {
  parameters: {
    docs: {
      description: {
        story: "A value with no space wraps inside its parent instead of overflowing it.",
      },
    },
  },
  play: async ({ canvasElement }): Promise<void> => {
    const parent = canvasElement.querySelector<HTMLElement>("[data-parent]");

    await expect(parent && parent.scrollWidth <= parent.clientWidth).toBe(true);
  },
  render: (): ReactElement => (
    <div className="w-48" data-parent>
      <Text variant="code">{LABELS.long}</Text>
    </div>
  ),
  tags: ["edge-case"],
};
