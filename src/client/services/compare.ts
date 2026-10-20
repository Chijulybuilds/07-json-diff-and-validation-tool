import type { JsonChange } from "../types";

const equal = (a: unknown, b: unknown) => {
  if (Object.is(a, b)) return true;
  try { return JSON.stringify(a) === JSON.stringify(b); } catch { return false; }
};
const childPath = (path: string, key: string | number) =>
  typeof key === "number" ? `${path}[${key}]` : `${path}/${key.replace(/~/g, "~0").replace(/\//g, "~1")}`;

export function compareJson(left: unknown, right: unknown): JsonChange[] {
  const changes: JsonChange[] = [];
  function walk(a: unknown, b: unknown, path: string) {
    if (equal(a, b)) return;
    if (Array.isArray(a) && Array.isArray(b)) {
      const max = Math.max(a.length, b.length);
      for (let i = 0; i < max; i++) {
        const p = childPath(path, i);
        if (i >= a.length) changes.push({ path: p, kind: "added", newValue: b[i] });
        else if (i >= b.length) changes.push({ path: p, kind: "removed", oldValue: a[i] });
        else walk(a[i], b[i], p);
      }
      return;
    }
    if (isObject(a) && isObject(b)) {
      const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
      for (const key of [...keys].sort()) {
        const p = childPath(path, key);
        if (!(key in a)) changes.push({ path: p, kind: "added", newValue: b[key] });
        else if (!(key in b)) changes.push({ path: p, kind: "removed", oldValue: a[key] });
        else walk(a[key], b[key], p);
      }
      return;
    }
    changes.push({ path: path || "/", kind: "changed", oldValue: a, newValue: b });
  }
  walk(left, right, "");
  return changes;
}
function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
export function parseJson(text: string): unknown {
  try { return JSON.parse(text); }
  catch (error) {
    const message = error instanceof Error ? error.message : "Invalid JSON.";
    throw new Error(`INVALID_JSON: ${message}`);
  }
}