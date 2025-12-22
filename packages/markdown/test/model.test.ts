import { describe, it, expect } from "vitest";
import { MarkdownModel } from "../src/model.js";

describe("MarkdownModel", () => {
  it("should create a new model", () => {
    const model = MarkdownModel.new({ active: true });
    expect(model).toBeDefined();
    expect(model.active).toBe(true);
    expect(model.fileName).toBe("");
  });

  it("should set active state", () => {
    const model = MarkdownModel.new({ active: false });
    expect(model.active).toBe(false);
    
    const activeModel = model.setIsActive(true);
    expect(activeModel.active).toBe(true);
  });

  it("should set size", () => {
    const model = MarkdownModel.new();
    const [updated] = model.setSize(80, 24);
    expect(updated.viewport.width).toBe(80);
    expect(updated.viewport.height).toBe(24);
  });

  it("should go to top", () => {
    const model = MarkdownModel.new({ width: 80, height: 24 });
    const scrolledModel = model.gotoTop();
    expect(scrolledModel.viewport.yOffset).toBe(0);
  });

  it("should init with no command", () => {
    const model = MarkdownModel.new();
    const cmd = model.init();
    expect(cmd).toBeNull();
  });
});
