// ─── Types ───────────────────────────────────────────────────────
// These match the JsonChange interface in src/client/types/index.ts.
// Later, move these to src/shared/contracts/ so both client and server import from one place.

type ChangeKind = "added" | "removed" | "changed";

interface JsonChange {
  path: string;
  kind: ChangeKind;
  oldValue?: unknown;
  newValue?: unknown;
}

// ─── Helpers ─────────────────────────────────────────────────────

/**
 * Check if two values are deeply equal.
 * First tries strict identity (Object.is), then falls back to
 * comparing their JSON text representations.
 */
function isEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch {
    return false;
  }
}

/**
 * Check if a value is a plain object (not an array, not null).
 * This is needed because typeof null === "object" and
 * typeof [] === "object" in JavaScript.
 */
function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Build a JSON Pointer path string.
 * - Object keys use slash notation:  /user/name
 * - Array indices use brackets:      /tags[0]
 * - Special characters ~ and / in keys are escaped per RFC 6901.
 */
function buildPath(parentPath: string, key: string | number): string {
  if (typeof key === "number") {
    return `${parentPath}[${key}]`;
  }
  const escaped = key.replace(/~/g, "~0").replace(/\//g, "~1");
  return `${parentPath}/${escaped}`;
}

// ─── Main Function ───────────────────────────────────────────────

/**
 * Deterministically compares two valid JSON values.
 *
 * Returns an array of changes. Each change has:
 *   - path:     where in the JSON tree the difference is (e.g. "/user/name")
 *   - kind:     "added", "removed", or "changed"
 *   - oldValue: the value in `left`  (present for "removed" and "changed")
 *   - newValue: the value in `right` (present for "added" and "changed")
 *
 * Identical documents return an empty array.
 * Results are deterministic: object keys are sorted alphabetically.
 *
 * @param left  - The first JSON value (parsed, not a string)
 * @param right - The second JSON value (parsed, not a string)
 * @returns An array of JsonChange objects
 */
export function compareJson(left: unknown, right: unknown): JsonChange[] {
  if (left === undefined || right === undefined) {
    throw new Error(
      "COMPARISON_INVALID_INPUT: Both left and right must be provided"
    );
  }

  const changes: JsonChange[] = [];

  function walk(a: unknown, b: unknown, path: string): void {
    // 1. If values are equal, no difference — stop here
    if (isEqual(a, b)) return;

    // 2. If both are arrays, compare element by element
    if (Array.isArray(a) && Array.isArray(b)) {
      const maxLength = Math.max(a.length, b.length);
      for (let i = 0; i < maxLength; i++) {
        const childPath = buildPath(path, i);
        if (i >= a.length) {
          // right has extra elements → added
          changes.push({ path: childPath, kind: "added", newValue: b[i] });
        } else if (i >= b.length) {
          // left has extra elements → removed
          changes.push({ path: childPath, kind: "removed", oldValue: a[i] });
        } else {
          // both have an element at this index → dig deeper
          walk(a[i], b[i], childPath);
        }
      }
      return;
    }

    // 3. If both are plain objects, compare key by key
    if (isObject(a) && isObject(b)) {
      // Collect all unique keys from both objects, sorted for determinism
      const allKeys = new Set([...Object.keys(a), ...Object.keys(b)]);
      const sortedKeys = [...allKeys].sort();

      for (const key of sortedKeys) {
        const childPath = buildPath(path, key);
        if (!(key in a)) {
          // key only in right → added
          changes.push({ path: childPath, kind: "added", newValue: b[key] });
        } else if (!(key in b)) {
          // key only in left → removed
          changes.push({ path: childPath, kind: "removed", oldValue: a[key] });
        } else {
          // key in both → dig deeper
          walk(a[key], b[key], childPath);
        }
      }
      return;
    }

    // 4. Everything else: primitives that differ, or type mismatches
    changes.push({
      path: path || "/",
      kind: "changed",
      oldValue: a,
      newValue: b,
    });
  }

  // Start the recursive walk from the root
  walk(left, right, "");

  return changes;
}