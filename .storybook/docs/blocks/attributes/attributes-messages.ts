export const ATTRIBUTES_MESSAGES = {
  columns: {
    attribute: "Attribute",
    stories: "Set in",
    value: "Value",
  },
  present: "Present, without a value",
  value: (value: string): string => `"${value}"`,
};
