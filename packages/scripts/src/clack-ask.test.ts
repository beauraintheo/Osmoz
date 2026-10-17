import { CANCEL_SYMBOL, select } from "@clack/prompts";
import type * as Clack from "@clack/prompts";
import { describe, expect, it, vi } from "vite-plus/test";

import { clackAsk } from "./clack-ask.ts";

vi.mock("@clack/prompts", async (importOriginal) => ({
  ...(await importOriginal<typeof Clack>()),
  select: vi.fn(),
}));

const options = [{ value: "flex", label: "flex" }];

describe("clackAsk", () => {
  it("asks the question with the options and returns the answer", async () => {
    vi.mocked(select).mockResolvedValueOnce("flex");

    await expect(clackAsk("Which app?", options)).resolves.toBe("flex");
    expect(select).toHaveBeenCalledWith({ message: "Which app?", options });
  });

  it("returns undefined when the prompt is cancelled", async () => {
    vi.mocked(select).mockResolvedValueOnce(CANCEL_SYMBOL);

    await expect(clackAsk("Which app?", options)).resolves.toBeUndefined();
  });
});
