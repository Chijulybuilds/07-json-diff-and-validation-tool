import { describe, it, expect } from "vitest";
import { compareJson } from "../../../src/services/comparison";

describe("compareJson", () => {

  // ─── IDENTICAL INPUTS ──────────────────────────────────────────
  describe("identical inputs", () => {
    it("returns empty array for identical flat objects", () => {
      const result = compareJson({ name: "Ari", age: 30 }, { name: "Ari", age: 30 });
      expect(result).toEqual([]);
    });

    it("returns empty array for identical nested objects", () => {
      const doc = { user: { address: { city: "NYC" } } };
      const result = compareJson(doc, JSON.parse(JSON.stringify(doc)));
      expect(result).toEqual([]);
    });

    it("returns empty array for identical arrays", () => {
      expect(compareJson([1, 2, 3], [1, 2, 3])).toEqual([]);
    });

    it("returns empty array for identical primitives", () => {
      expect(compareJson(42, 42)).toEqual([]);
      expect(compareJson("hello", "hello")).toEqual([]);
      expect(compareJson(true, true)).toEqual([]);
      expect(compareJson(null, null)).toEqual([]);
    });
  });

  // ─── NESTED CHANGES ────────────────────────────────────────────
  describe("nested changes", () => {
    it("detects a change deep in a nested object", () => {
      const result = compareJson(
        { user: { profile: { name: "Ari", age: 25 } } },
        { user: { profile: { name: "Ari", age: 26 } } }
      );
      expect(result).toEqual([
        { path: "/user/profile/age", kind: "changed", oldValue: 25, newValue: 26 },
      ]);
    });

    it("detects multiple changes at different depths", () => {
      const result = compareJson(
        { a: { b: { c: 1 } }, x: { y: 2 } },
        { a: { b: { c: 9 } }, x: { y: 3 } }
      );
      expect(result).toHaveLength(2);
      expect(result.map((c) => c.path).sort()).toEqual(["/a/b/c", "/x/y"]);
    });
  });

  // ─── ADDITIONS ─────────────────────────────────────────────────
  describe("additions", () => {
    it("detects a new top-level field", () => {
      const result = compareJson(
        { name: "Ari" },
        { name: "Ari", active: true }
      );
      expect(result).toEqual([
        { path: "/active", kind: "added", newValue: true },
      ]);
    });

    it("detects a new nested object", () => {
      const result = compareJson(
        { user: { name: "Ari" } },
        { user: { name: "Ari", address: { city: "NYC" } } }
      );
      expect(result).toHaveLength(1);
      expect(result[0].kind).toBe("added");
      expect(result[0].path).toBe("/user/address");
    });
  });

  // ─── REMOVALS ──────────────────────────────────────────────────
  describe("removals", () => {
    it("detects a removed top-level field", () => {
      const result = compareJson(
        { name: "Ari", phone: "555" },
        { name: "Ari" }
      );
      expect(result).toEqual([
        { path: "/phone", kind: "removed", oldValue: "555" },
      ]);
    });

    it("detects a removed nested field", () => {
      const result = compareJson(
        { user: { name: "Ari", age: 25 } },
        { user: { name: "Ari" } }
      );
      expect(result).toHaveLength(1);
      expect(result[0].path).toBe("/user/age");
      expect(result[0].kind).toBe("removed");
    });
  });

  // ─── ARRAYS ────────────────────────────────────────────────────
  describe("arrays", () => {
    it("detects a changed array element", () => {
      const result = compareJson(
        { tags: ["admin", "user"] },
        { tags: ["admin", "superuser"] }
      );
      expect(result).toEqual([
        { path: "/tags[1]", kind: "changed", oldValue: "user", newValue: "superuser" },
      ]);
    });

    it("detects added array elements", () => {
      const result = compareJson(
        { scores: [90, 85] },
        { scores: [90, 85, 92] }
      );
      expect(result).toEqual([
        { path: "/scores[2]", kind: "added", newValue: 92 },
      ]);
    });

    it("detects removed array elements", () => {
      const result = compareJson(
        { scores: [90, 85, 92] },
        { scores: [90, 85] }
      );
      expect(result).toEqual([
        { path: "/scores[2]", kind: "removed", oldValue: 92 },
      ]);
    });

    it("detects changes inside objects within arrays", () => {
      const result = compareJson(
        { users: [{ name: "Ari", age: 25 }] },
        { users: [{ name: "Ari", age: 26 }] }
      );
      expect(result).toEqual([
        { path: "/users[0]/age", kind: "changed", oldValue: 25, newValue: 26 },
      ]);
    });
  });

  // ─── ROOT-LEVEL VALUES ─────────────────────────────────────────
  describe("root-level values", () => {
    it("detects a changed root number", () => {
      expect(compareJson(42, 99)).toEqual([
        { path: "/", kind: "changed", oldValue: 42, newValue: 99 },
      ]);
    });

    it("detects a changed root string", () => {
      expect(compareJson("hello", "world")).toEqual([
        { path: "/", kind: "changed", oldValue: "hello", newValue: "world" },
      ]);
    });

    it("detects a changed root boolean", () => {
      expect(compareJson(true, false)).toEqual([
        { path: "/", kind: "changed", oldValue: true, newValue: false },
      ]);
    });
  });

  // ─── EDGE CASES ────────────────────────────────────────────────
  describe("edge cases", () => {
    it("throws on undefined input", () => {
      expect(() => compareJson(undefined, {})).toThrow("COMPARISON_INVALID_INPUT");
    });

    it("handles null vs object as a type change", () => {
      const result = compareJson({ a: null }, { a: { b: 1 } });
      expect(result).toHaveLength(1);
      expect(result[0].kind).toBe("changed");
      expect(result[0].oldValue).toBeNull();
    });

    it("handles type mismatch (number vs string)", () => {
      const result = compareJson({ age: 25 }, { age: "25" });
      expect(result).toHaveLength(1);
      expect(result[0].kind).toBe("changed");
    });

    it("is deterministic regardless of key order", () => {
      const result = compareJson(
        { z: 1, a: 2, m: 3 },
        { a: 2, m: 3, z: 1 }
      );
      expect(result).toEqual([]);
    });

    it("handles empty objects", () => {
      const result = compareJson({}, { a: 1 });
      expect(result).toHaveLength(1);
      expect(result[0].kind).toBe("added");
    });

    it("handles empty arrays", () => {
      const result = compareJson([], [1]);
      expect(result).toHaveLength(1);
      expect(result[0].kind).toBe("added");
    });
  });
});