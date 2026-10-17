import { describe, expect, it, vi } from "vite-plus/test";

import { execCommand } from "./exec-command.ts";

const node = process.execPath;

describe("execCommand", () => {
  it("prints the command, then returns its exit code", () => {
    const write = vi.spyOn(process.stdout, "write").mockReturnValue(true);

    expect(execCommand({ command: node, args: ["-e", "process.exit(3)"] })).toBe(3);
    expect(write).toHaveBeenCalledWith(`\n› ${node} -e process.exit(3)\n`);

    write.mockRestore();
  });

  it("returns 0 when the command succeeds", () => {
    const write = vi.spyOn(process.stdout, "write").mockReturnValue(true);

    expect(execCommand({ command: node, args: ["-e", ""] })).toBe(0);

    write.mockRestore();
  });

  it("returns 1 when the command is killed by a signal", () => {
    const write = vi.spyOn(process.stdout, "write").mockReturnValue(true);

    expect(
      execCommand({ command: node, args: ["-e", "process.kill(process.pid, 'SIGTERM')"] }),
    ).toBe(1);

    write.mockRestore();
  });

  it("reports why a command cannot start, and returns 1", () => {
    const write = vi.spyOn(process.stdout, "write").mockReturnValue(true);
    const error = vi.spyOn(console, "error").mockReturnValue();

    expect(execCommand({ command: "osmoz-missing-command", args: [] })).toBe(1);
    expect(error).toHaveBeenCalledWith(
      'Cannot run "osmoz-missing-command": spawnSync osmoz-missing-command ENOENT',
    );

    write.mockRestore();
    error.mockRestore();
  });
});
