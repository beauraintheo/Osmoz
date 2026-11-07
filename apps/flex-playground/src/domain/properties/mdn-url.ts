import type { CONTAINER_PROPERTIES } from "./container-properties";
import type { ITEM_PROPERTIES } from "./item-properties";

type CssProperty =
  | keyof typeof CONTAINER_PROPERTIES
  | Exclude<keyof typeof ITEM_PROPERTIES, "content">;

const MDN_CSS_URL = "https://developer.mozilla.org/docs/Web/CSS/";

export const mdnUrl = (property: CssProperty): string => `${MDN_CSS_URL}${property}`;
