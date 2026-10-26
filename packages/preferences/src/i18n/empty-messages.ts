import type { Messages } from "./create-locale-store.ts";

export const emptyMessages = (catalog: Messages, prefix = ""): string[] =>
  Object.entries(catalog).flatMap(([key, message]) => {
    const path = `${prefix}${key}`;

    if (typeof message === "string") {
      return message.trim() === "" ? [path] : [];
    }

    return typeof message === "function" ? [] : emptyMessages(message, `${path}.`);
  });
