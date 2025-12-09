import { describe, expect, test } from "vitest";
import { getColorSupport, resolveColor } from "../src/colors.js";

describe("colors", () => {
  test("resolveColor returns undefined when no input", () => {
    expect(resolveColor()).toBeUndefined();
  });

  test("resolveColor passes through string", () => {
    expect(resolveColor("red")).toBe("red");
  });

  test("getColorSupport exposes capability fields", () => {
    const support = getColorSupport();
    expect(support).toHaveProperty("level");
    expect(support).toHaveProperty("hasBasic");
    expect(support).toHaveProperty("has256");
    expect(support).toHaveProperty("has16m");
  });
});
