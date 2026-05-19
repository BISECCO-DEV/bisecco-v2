import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn()", () => {
  it("merge classes", () => {
    expect(cn("a", "b")).toBe("a b");
  });
  it("dedup tailwind", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });
  it("conditional", () => {
    expect(cn("a", false && "b", "c")).toBe("a c");
  });
});
