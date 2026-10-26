import { afterEach, describe, expect, it, vi } from "vite-plus/test";

import { safeStorage } from "./safe-storage.ts";

const failStorage = (): void => {
  vi.spyOn(window, "localStorage", "get").mockImplementation(() => {
    throw new DOMException("denied", "SecurityError");
  });
};

describe("safeStorage", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it("reads, writes and removes in the local storage", () => {
    safeStorage.setItem("demo:locale", "en");

    expect(safeStorage.getItem("demo:locale")).toBe("en");

    safeStorage.removeItem("demo:locale");

    expect(localStorage.getItem("demo:locale")).toBeNull();
  });

  it("reads nothing and never throws when the storage is unavailable", () => {
    failStorage();

    expect(safeStorage.getItem("demo:locale")).toBeNull();
    expect(() => {
      safeStorage.setItem("demo:locale", "en");
      safeStorage.removeItem("demo:locale");
    }).not.toThrow();
  });
});
