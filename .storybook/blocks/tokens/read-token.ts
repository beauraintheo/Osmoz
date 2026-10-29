export interface TokenValue {
  color: boolean;
  value: string;
}

export const readToken = (element: Element, name: string): TokenValue => {
  const value = getComputedStyle(element).getPropertyValue(`--${name}`).trim();

  return { color: value !== "" && CSS.supports("color", value), value };
};
