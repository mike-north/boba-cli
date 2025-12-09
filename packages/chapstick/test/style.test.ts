import { describe, expect, test } from "vitest";
import { Style } from "../src/style.js";
import { borderStyles } from "../src/borders.js";

describe("Style", () => {
  describe("basic rendering", () => {
    test("applies padding and alignment", () => {
      const s = new Style().padding(1).align("center").width(6);
      const out = s.render("hi");
      expect(out).toBe(["      ", "  hi  ", "      "].join("\n"));
    });

    test("renders plain text without options", () => {
      const s = new Style();
      expect(s.render("hello")).toBe("hello");
    });

    test("handles empty string", () => {
      const s = new Style().padding(1);
      const out = s.render("");
      expect(out.split("\n")).toHaveLength(3);
    });

    test("handles multiline input", () => {
      const s = new Style().align("right").width(10);
      const out = s.render("foo\nbar");
      expect(out).toBe("       foo\n       bar");
    });
  });

  describe("immutability", () => {
    test("adds border and preserves immutability", () => {
      const base = new Style().padding(1);
      const bordered = base.border(borderStyles.rounded);
      const out = bordered.render("ok");
      expect(base.render("ok")).not.toContain("╭"); // base unchanged
      expect(out.split("\n")[0]).toContain("╭");
    });

    test("copy creates independent instance", () => {
      const original = new Style().bold().foreground("#ff0000");
      const copied = original.copy();
      const modified = copied.italic();
      expect(original.isSet("italic")).toBe(false);
      expect(modified.isSet("italic")).toBe(true);
    });
  });

  describe("inherit", () => {
    test("inherits unset properties from other style", () => {
      const base = new Style().bold();
      const other = new Style().italic().underline();
      const inherited = base.inherit(other);
      
      expect(inherited.isSet("bold")).toBe(true);
      expect(inherited.isSet("italic")).toBe(true);
      expect(inherited.isSet("underline")).toBe(true);
    });

    test("does not override existing properties", () => {
      const base = new Style().foreground("#ff0000");
      const other = new Style().foreground("#00ff00");
      const inherited = base.inherit(other);
      
      // The base foreground should be preserved
      expect(inherited.isSet("foreground")).toBe(true);
    });

    test("does not inherit padding", () => {
      const base = new Style();
      const other = new Style().padding(5);
      const inherited = base.inherit(other);
      
      expect(inherited.isSet("padding")).toBe(false);
    });

    test("does not inherit margin", () => {
      const base = new Style();
      const other = new Style().margin(5);
      const inherited = base.inherit(other);
      
      expect(inherited.isSet("margin")).toBe(false);
    });
  });

  describe("height and vertical alignment", () => {
    test("clamps height with blank padding", () => {
      const s = new Style().padding({ top: 1, bottom: 1 }).height(2);
      const out = s.render("a");
      expect(out.split("\n")).toHaveLength(2);
    });

    test("applies vertical alignment top", () => {
      const s = new Style().height(3).alignVertical("top");
      const out = s.render("x");
      const lines = out.split("\n");
      expect(lines[0]).toBe("x");
      expect(lines[1]?.trim()).toBe("");
      expect(lines[2]?.trim()).toBe("");
    });

    test("applies vertical alignment center", () => {
      const s = new Style().height(3).alignVertical("center");
      const out = s.render("x");
      const lines = out.split("\n");
      expect(lines[0]?.trim()).toBe("");
      expect(lines[1]).toBe("x");
      expect(lines[2]?.trim()).toBe("");
    });

    test("applies vertical alignment bottom", () => {
      const s = new Style().height(3).alignVertical("bottom");
      const out = s.render("x");
      const lines = out.split("\n");
      expect(lines[0]?.trim()).toBe("");
      expect(lines[1]?.trim()).toBe("");
      expect(lines[2]).toBe("x");
    });
  });

  describe("inline mode", () => {
    test("strips newlines in inline mode", () => {
      const s = new Style().inline();
      const out = s.render("foo\nbar\nbaz");
      expect(out).toBe("foobarbaz");
    });

    test("ignores padding in inline mode", () => {
      const s = new Style().inline().padding(5);
      const out = s.render("test");
      expect(out).toBe("test");
    });

    test("ignores margin in inline mode", () => {
      const s = new Style().inline().margin(5);
      const out = s.render("test");
      expect(out).toBe("test");
    });
  });

  describe("border", () => {
    test("border(true) enables default border", () => {
      const s = new Style().border(true);
      const out = s.render("x");
      expect(out).toContain("┌");
      expect(out).toContain("└");
    });

    test("border(false) disables border", () => {
      const s = new Style().border(borderStyles.rounded).border(false);
      const out = s.render("x");
      expect(out).not.toContain("╭");
    });

    test("borderStyle sets border characters", () => {
      const s = new Style().border(true).borderStyle(borderStyles.double);
      const out = s.render("x");
      expect(out).toContain("╔");
    });
  });

  describe("spacing overloads", () => {
    test("padding(all) applies to all sides", () => {
      const s = new Style().padding(1).width(4);
      const out = s.render("ab");
      // Should have padding on all sides
      expect(out.split("\n")).toHaveLength(3);
    });

    test("padding(v, h) applies vertical and horizontal", () => {
      const s = new Style().padding(1, 2).width(6);
      const out = s.render("ab");
      // Left and right padding of 2, top and bottom of 1
      const lines = out.split("\n");
      expect(lines).toHaveLength(3);
      expect(lines[1]).toBe("  ab  ");
    });

    test("padding(t, r, b, l) applies individually", () => {
      const s = new Style().padding(0, 1, 0, 2);
      const out = s.render("x");
      expect(out).toBe("  x ");
    });
  });

  describe("width constraints", () => {
    test("width clamps content", () => {
      const s = new Style().width(5);
      const out = s.render("hello world");
      expect(out).toBe("hello");
    });

    test("maxWidth wraps content", () => {
      const s = new Style().maxWidth(5);
      const out = s.render("hello world");
      expect(out.split("\n").length).toBeGreaterThan(1);
    });

    test("maxHeight truncates lines", () => {
      const s = new Style().maxHeight(2);
      const out = s.render("a\nb\nc\nd");
      expect(out.split("\n")).toHaveLength(2);
    });
  });

  describe("edge cases", () => {
    test("handles zero width", () => {
      const s = new Style().width(0);
      const out = s.render("test");
      expect(out).toBe("test");
    });

    test("handles negative padding gracefully", () => {
      const s = new Style().padding(-1);
      // Should not throw
      expect(() => s.render("test")).not.toThrow();
    });

    test("unset removes properties", () => {
      const s = new Style().bold().italic();
      const unset = s.unset("bold");
      expect(unset.isSet("bold")).toBe(false);
      expect(unset.isSet("italic")).toBe(true);
    });
  });
});
