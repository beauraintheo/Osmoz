import { describe, expect, it, vi } from "vite-plus/test";

import { preventClick, resolveButtonBehavior, resolveButtonClick } from "./button-behavior.ts";

describe("resolveButtonBehavior", () => {
  it("leaves a plain button active", () => {
    expect(
      resolveButtonBehavior({
        disabled: undefined,
        focusableWhenDisabled: undefined,
        pending: undefined,
      }),
    ).toEqual({ disabled: undefined, inert: false });
  });

  it("disables a disabled button natively", () => {
    expect(
      resolveButtonBehavior({ disabled: true, focusableWhenDisabled: false, pending: false }),
    ).toEqual({ disabled: true, inert: false });
  });

  it("keeps a disabled button focusable when asked", () => {
    expect(
      resolveButtonBehavior({ disabled: true, focusableWhenDisabled: true, pending: false }),
    ).toEqual({ disabled: undefined, inert: true });
  });

  it("keeps a pending button focusable and inert", () => {
    expect(
      resolveButtonBehavior({
        disabled: undefined,
        focusableWhenDisabled: undefined,
        pending: true,
      }),
    ).toEqual({ disabled: undefined, inert: true });
  });

  it("keeps a pending disabled button focusable", () => {
    expect(
      resolveButtonBehavior({ disabled: true, focusableWhenDisabled: false, pending: true }),
    ).toEqual({ disabled: undefined, inert: true });
  });

  it("ignores focusableWhenDisabled on an enabled button", () => {
    expect(
      resolveButtonBehavior({ disabled: false, focusableWhenDisabled: true, pending: false }),
    ).toEqual({ disabled: undefined, inert: false });
  });
});

describe("resolveButtonClick", () => {
  it("keeps the handler of an active button", () => {
    const onClick = vi.fn();

    expect(resolveButtonClick(false, onClick)).toBe(onClick);
  });

  it("replaces the handler of an inert button", () => {
    expect(resolveButtonClick(true, vi.fn())).toBe(preventClick);
  });
});

describe("preventClick", () => {
  it("cancels the default action and stops the click from reaching the parents", () => {
    const preventDefault = vi.fn();
    const stopPropagation = vi.fn();

    preventClick({ preventDefault, stopPropagation });

    expect(preventDefault).toHaveBeenCalledOnce();
    expect(stopPropagation).toHaveBeenCalledOnce();
  });
});
