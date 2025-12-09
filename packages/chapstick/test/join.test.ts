import { describe, expect, test } from "vitest";
import { joinHorizontal, joinVertical, place } from "../src/join.js";

describe("join helpers", () => {
  test("joinHorizontal aligns rows with spacing", () => {
    const out = joinHorizontal(1, "a", "b\nc");
    expect(out).toBe(["a b", "  c"].join("\n"));
  });

  test("joinVertical adds blank lines for spacing", () => {
    const out = joinVertical(2, "one", "two");
    expect(out).toBe(["one", "", "", "two"].join("\n"));
  });

  test("place centers content", () => {
    const out = place(6, 3, "center", "center", "x");
    expect(out).toBe(["      ", "  x   ", "      "].join("\n"));
  });
});
