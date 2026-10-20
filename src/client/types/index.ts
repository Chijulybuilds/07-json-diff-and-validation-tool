export type ChangeKind = "added" | "removed" | "changed";
export interface JsonChange {
  path: string;
  kind: ChangeKind;
  oldValue?: unknown;
  newValue?: unknown;
}
export interface ValidationIssue { path: string; message: string; keyword?: string }
export interface DemoUser { name: string; email: string }