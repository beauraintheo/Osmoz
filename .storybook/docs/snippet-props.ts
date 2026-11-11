const HANDLER = /^on[A-Z]/;

export const showInSnippet = (value: unknown, key: string): boolean =>
  value !== undefined && !(HANDLER.test(key) && typeof value === "function");

const COMPONENT_NAME = /^[A-Z][A-Za-z0-9]{3,}$/;

export const functionName = (value: unknown): string =>
  typeof value === "function" && COMPONENT_NAME.test(value.name) ? value.name : "…";
