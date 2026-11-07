import { z } from "zod";

import { formatLength } from "@/domain/length/format-length";
import { parseLength } from "@/domain/length/parse-length";

import type { KeywordSchema, Keywords } from "./keyword-property";

interface LengthOptions<Values extends Keywords> {
  initial: Values[number];
  keywords: Values;
}

type LengthProperty<Values extends Keywords> = z.ZodDefault<
  z.ZodUnion<readonly [KeywordSchema<Values>, z.ZodString]>
> &
  LengthOptions<Values> & { kind: "length" };

const isNormalizedLength = (value: string): boolean => {
  const result = parseLength(value);

  return result.ok && formatLength(result.value) === value;
};

export const lengthProperty = <const Values extends Keywords>(
  options: LengthOptions<Values>,
): LengthProperty<Values> =>
  Object.assign(
    z
      .union([z.enum(options.keywords), z.string().refine(isNormalizedLength)])
      .default(options.initial),
    {
      ...options,
      kind: "length" as const,
    },
  );
