import { z } from "zod";

interface TextOptions {
  initial: string;
  maxCharacters: number;
}

type TextProperty = z.ZodDefault<z.ZodString> & TextOptions & { kind: "text" };

export const textProperty = (options: TextOptions): TextProperty =>
  Object.assign(z.string().max(options.maxCharacters).default(options.initial), {
    ...options,
    kind: "text" as const,
  });
