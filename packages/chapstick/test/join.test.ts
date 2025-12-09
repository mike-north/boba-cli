import { describe, expect, test } from "vitest";
import { joinHorizontal, joinVertical, place } from "../src/join.js";

describe("join helpers", () => {
  describe("joinHorizontal", () => {
    test("aligns rows with spacing", () => {
      const out = joinHorizontal(1, "a", "b\nc");
      expect(out).toBe(["a b", "  c"].join("\n"));
    });

    test("works without spacing argument", () => {
      const out = joinHorizontal("a", "b");
      expect(out).toBe("ab");
    });

    test("handles empty blocks array", () => {
      const out = joinHorizontal(1);
      expect(out).toBe("");
    });

    test("pads shorter blocks to match tallest", () => {
      const out = joinHorizontal(0, "a", "b\nc\nd");
      const lines = out.split("\n");
      expect(lines).toHaveLength(3);
      expect(lines[0]).toBe("ab");
      expect(lines[1]).toBe(" c");
      expect(lines[2]).toBe(" d");
    });

    test("handles blocks with different widths", () => {
      const out = joinHorizontal(1, "abc", "x");
      expect(out).toBe("abc x");
    });

    test("preserves ANSI in width calculations", () => {
      // This test verifies ANSI sequences don't break alignment
      const colored = "\x1b[31mred\x1b[0m";
      const plain = "xxx";
      const out = joinHorizontal(1, colored, plain);
      // Should have proper spacing despite ANSI codes
      expect(out).toContain("red");
      expect(out).toContain("xxx");
    });
  });

  describe("joinVertical", () => {
    test("adds blank lines for spacing", () => {
      const out = joinVertical(2, "one", "two");
      expect(out).toBe(["one", "", "", "two"].join("\n"));
    });

    test("works without spacing argument", () => {
      const out = joinVertical("a", "b", "c");
      expect(out).toBe("a\nb\nc");
    });

    test("handles empty blocks array", () => {
      const out = joinVertical(1);
      expect(out).toBe("");
    });

    test("handles single block", () => {
      const out = joinVertical(5, "only");
      expect(out).toBe("only");
    });

    test("spacing of 0 joins with single newline", () => {
      const out = joinVertical(0, "a", "b");
      expect(out).toBe("a\nb");
    });
  });

  describe("place", () => {
    test("centers content", () => {
      const out = place(6, 3, "center", "center", "x");
      expect(out).toBe(["      ", "  x   ", "      "].join("\n"));
    });

    test("places content top-left", () => {
      const out = place(5, 3, "left", "top", "ab");
      const lines = out.split("\n");
      expect(lines[0]).toBe("ab   ");
      expect(lines[1]).toBe("     ");
      expect(lines[2]).toBe("     ");
    });

    test("places content bottom-right", () => {
      const out = place(5, 3, "right", "bottom", "ab");
      const lines = out.split("\n");
      expect(lines[0]).toBe("     ");
      expect(lines[1]).toBe("     ");
      expect(lines[2]).toBe("   ab");
    });

    test("truncates content that exceeds width", () => {
      const out = place(3, 1, "left", "top", "hello");
      expect(out).toBe("hel");
    });

    test("truncates content that exceeds height", () => {
      const out = place(5, 2, "left", "top", "a\nb\nc\nd");
      const lines = out.split("\n");
      expect(lines).toHaveLength(2);
      expect(lines[0]).toBe("a    ");
      expect(lines[1]).toBe("b    ");
    });

    test("handles multiline content with centering", () => {
      const out = place(6, 5, "center", "center", "ab\ncd");
      const lines = out.split("\n");
      expect(lines).toHaveLength(5);
      // Content should be vertically centered
      expect(lines[1]?.trim()).toBe("ab");
      expect(lines[2]?.trim()).toBe("cd");
    });

    test("handles empty content", () => {
      const out = place(3, 3, "center", "center", "");
      const lines = out.split("\n");
      expect(lines).toHaveLength(3);
      lines.forEach(line => expect(line).toBe("   "));
    });
  });
});
