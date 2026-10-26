import { describe, expect, it, vi } from "vite-plus/test";

import type { Command } from "./app-commands.ts";
import { runApp } from "./run-app.ts";

const apps = ["flex", "tierlist"];

const line = ({ args, command }: Command): string => [command, ...args].join(" ");

describe("runApp", () => {
  it("runs the commands of the action for the given app, in order", () => {
    const exec = vi.fn((_command: Command): number => 0);

    expect(runApp(["build", "flex"], { apps, exec })).toBe(0);
    expect(exec.mock.calls.map(([command]) => line(command))).toEqual([
      "vp check",
      "vp run -F @osmoz/flex... validate",
      "vp run -F @osmoz/flex build",
    ]);
  });

  it("runs the action on every workspace without an app", () => {
    const exec = vi.fn((_command: Command): number => 0);

    expect(runApp(["dev"], { apps, exec })).toBe(0);
    expect(exec.mock.calls.map(([command]) => line(command))).toEqual(["vp run -F !osmoz dev"]);
  });

  it("stops at the first failing command and returns its exit code", () => {
    const exec = vi.fn((command: Command): number => (command.args.includes("validate") ? 2 : 0));

    expect(runApp(["build", "flex"], { apps, exec })).toBe(2);
    expect(exec).toHaveBeenCalledTimes(2);
  });

  it("rejects an unknown action", () => {
    const error = vi.spyOn(console, "error").mockReturnValue();
    const exec = vi.fn((_command: Command): number => 0);

    expect(runApp(["deploy"], { apps, exec })).toBe(1);
    expect(error).toHaveBeenCalledWith(
      'Unknown action "deploy". Use one of: dev, build, validate.',
    );
    expect(exec).not.toHaveBeenCalled();

    error.mockRestore();
  });

  it("rejects a missing action", () => {
    const error = vi.spyOn(console, "error").mockReturnValue();

    expect(runApp([], { apps, exec: () => 0 })).toBe(1);
    expect(error).toHaveBeenCalledWith('Unknown action "". Use one of: dev, build, validate.');

    error.mockRestore();
  });

  it("rejects an unknown app and lists the existing ones", () => {
    const error = vi.spyOn(console, "error").mockReturnValue();
    const exec = vi.fn((_command: Command): number => 0);

    expect(runApp(["build", "grid"], { apps, exec })).toBe(1);
    expect(error).toHaveBeenCalledWith('Unknown app "grid". Apps: flex, tierlist.');
    expect(exec).not.toHaveBeenCalled();

    error.mockRestore();
  });

  it("says when there is no app at all", () => {
    const error = vi.spyOn(console, "error").mockReturnValue();

    expect(runApp(["build", "grid"], { apps: [], exec: () => 0 })).toBe(1);
    expect(error).toHaveBeenCalledWith('Unknown app "grid". Apps: none.');

    error.mockRestore();
  });
});
