const LENGTH_PATTERN = /^(\d+(?:\.\d+)?)([a-z%]*)$/i;
const LENGTH_UNITS = ["px", "%", "rem", "em", "ch", "vw", "vh"] as const;
const PLAIN_NUMBER_PATTERN = /^\d+(?:\.\d+)?$/;

type LengthUnit = (typeof LENGTH_UNITS)[number];

export interface Length {
  amount: number;
  unit: LengthUnit | null;
}

type ParseLengthResult =
  | { ok: true; value: Length }
  | { error: "empty" | "invalid-number" | "missing-unit" | "unknown-unit"; ok: false };

export const parseLength = (input: string): ParseLengthResult => {
  const trimmed = input.trim();

  if (trimmed === "") return { error: "empty", ok: false };
  if (trimmed === "0") return { ok: true, value: { amount: 0, unit: null } };

  const match = LENGTH_PATTERN.exec(trimmed);

  if (match === null) return { error: "invalid-number", ok: false };

  const [, digits, suffix] = match;
  const amount = Number(digits);

  if (!PLAIN_NUMBER_PATTERN.test(String(amount))) return { error: "invalid-number", ok: false };
  if (suffix === "") return { error: "missing-unit", ok: false };

  const unit = LENGTH_UNITS.find((candidate) => candidate === suffix);

  if (unit === undefined) return { error: "unknown-unit", ok: false };

  return { ok: true, value: { amount, unit } };
};
