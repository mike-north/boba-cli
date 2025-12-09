import { describe, expect, test } from "vitest";
import { Style } from "../src/style.js";
import { borderStyles } from "../src/borders.js";

describe("Style", () => {
  test("applies padding and alignment", () => {
    const s = new Style().padding(1).align("center").width(6);
    const out = s.render("hi");
    expect(out).toBe(["      ", "  hi  ", "      "].join("\n"));
  });

  test("adds border and preserves immutability", () => {
    const base = new Style().padding(1);
    const bordered = base.border(borderStyles.rounded);
    const out = bordered.render("ok");
    expect(base.render("ok")).not.toContain("╭"); // base unchanged
    expect(out.split("\n")[0]).toContain("╭");
  });

  test("clamps height with blank padding", () => {
    const s = new Style().padding({ top: 1, bottom: 1 }).height(2);
    const out = s.render("a");
    expect(out.split("\n")).toHaveLength(2);
  });
});
