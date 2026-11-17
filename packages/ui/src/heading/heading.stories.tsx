import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { Heading } from "./heading.tsx";
import type { HeadingLevel } from "./heading.tsx";

const LEVELS: readonly HeadingLevel[] = [1, 2, 3, 4, 5, 6];

const TITLE = "Container properties";

const meta = {
  args: {
    children: TITLE,
    level: 2,
  },
  argTypes: {
    children: { description: "The title, from the app's catalog." },
    level: {
      control: "select",
      description:
        "The heading's rank in the page outline: `1` renders an `<h1>`, `6` an `<h6>`. Pick it from the outline, never from the look.",
      options: LEVELS,
      table: { type: { summary: "1 | 2 | 3 | 4 | 5 | 6" } },
    },
  },
  component: Heading,
  title: "Typography/Heading",
} satisfies Meta<typeof Heading>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: { actions: { disable: false }, controls: { disable: false } },
  play: async ({ canvas }): Promise<void> => {
    const heading = canvas.getByRole("heading", { level: 2 });

    await expect(heading.tagName).toBe("H2");
    await expect(heading).toHaveTextContent(TITLE);
  },
};

export const Levels: Story = {
  play: async ({ canvas }): Promise<void> => {
    const headings = LEVELS.map((level) => canvas.getByRole("heading", { level }));

    await expect(headings.map(({ tagName }) => tagName)).toEqual(
      LEVELS.map((level) => `H${level}`),
    );
  },
  render: (args): ReturnType<typeof Heading> => (
    <div>
      {LEVELS.map((level) => (
        <Heading {...args} key={level} level={level} />
      ))}
    </div>
  ),
  tags: ["!dev"],
};
