import { z } from "zod";

export type Keywords = readonly [string, ...string[]];

export type KeywordSchema<Values extends Keywords> = z.ZodEnum<z.util.ToEnum<Values[number]>>;

interface KeywordOptions<Values extends Keywords> {
  initial: Values[number];
  values: Values;
}

type KeywordProperty<Values extends Keywords> = z.ZodDefault<KeywordSchema<Values>> &
  KeywordOptions<Values> & { kind: "keyword" };

export const keywordProperty = <const Values extends Keywords>(
  options: KeywordOptions<Values>,
): KeywordProperty<Values> =>
  Object.assign(z.enum(options.values).default(options.initial), {
    ...options,
    kind: "keyword" as const,
  });
