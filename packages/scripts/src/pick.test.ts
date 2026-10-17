import { cancel, intro } from "@clack/prompts";
import { afterEach, describe, expect, it, vi } from "vite-plus/test";

import { clackAsk } from "./clack-ask.ts";
import { execCommand } from "./exec-command.ts";
import { listApps } from "./list-apps.ts";
import { pickCommand } from "./pick-command.ts";

vi.mock("@clack/prompts", () => ({ cancel: vi.fn(), intro: vi.fn() }));
vi.mock("./clack-ask.ts", () => ({ clackAsk: vi.fn() }));
vi.mock("./list-apps.ts", () => ({ APPS_DIR: "/repo/apps", listApps: vi.fn(() => ["flex"]) }));
vi.mock("./pick-command.ts", () => ({ pickCommand: vi.fn(async () => 3) }));

describe("pick", () => {
  afterEach(() => {
    process.exitCode = undefined;
  });

  it("asks what to run on the apps of the repo, exits with the result, and reports a cancel", async () => {
    await import("./pick.ts");

    expect(intro).toHaveBeenCalledWith("Osmoz");
    expect(listApps).toHaveBeenCalledWith("/repo/apps");
    expect(pickCommand).toHaveBeenCalledWith({
      apps: ["flex"],
      ask: clackAsk,
      exec: execCommand,
      onCancel: expect.any(Function),
    });
    expect(process.exitCode).toBe(3);

    vi.mocked(pickCommand).mock.calls[0]?.[0].onCancel();

    expect(cancel).toHaveBeenCalledWith("Nothing was run.");
  });
});
