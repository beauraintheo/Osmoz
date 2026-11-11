const HANDLER = /^on[A-Z]/;

export const showInSnippet = (value: unknown, key: string): boolean =>
  value !== undefined && !(HANDLER.test(key) && typeof value === "function");
