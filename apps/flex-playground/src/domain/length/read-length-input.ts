import { formatLength } from "./format-length";
import { parseLength } from "./parse-length";

type ReadLengthInputResult =
  | Extract<ReturnType<typeof parseLength>, { ok: false }>
  | { ok: true; value: string };

export const readLengthInput = (
  input: string,
  keywords: readonly string[],
): ReadLengthInputResult => {
  const keyword = input.trim().toLowerCase();

  if (keywords.includes(keyword)) return { ok: true, value: keyword };

  const result = parseLength(input);

  return result.ok ? { ok: true, value: formatLength(result.value) } : result;
};
