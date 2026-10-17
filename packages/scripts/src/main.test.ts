import { afterEach, describe, expect, it, vi } from "vite-plus/test";

import { execCommand } from "./exec-command.ts";
import { listApps } from "./list-apps.ts";
import { runApp } from "./run-app.ts";

vi.mock("./run-app.ts", () => ({ runApp: vi.fn(() => 4) }));
vi.mock("./list-apps.ts", () => ({ APPS_DIR: "/repo/apps", listApps: vi.fn(() => ["flex"]) }));

describe("main", () => {
  const argv = process.argv;

  afterEach(() => {
    process.argv = argv;
    process.exitCode = undefined;
  });

  it("runs the CLI arguments against the apps of the repo and exits with the result", async () => {
    process.argv = ["node", "main.ts", "build", "flex"];

    await import("./main.ts");

    expect(listApps).toHaveBeenCalledWith("/repo/apps");
    expect(runApp).toHaveBeenCalledWith(["build", "flex"], { apps: ["flex"], exec: execCommand });
    expect(process.exitCode).toBe(4);
  });
});
