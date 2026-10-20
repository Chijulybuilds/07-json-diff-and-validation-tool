import { Check, CircleAlert, GitCompareArrows, Minus, Plus, RefreshCw } from "lucide-react";
import type { JsonChange, ValidationIssue } from "../types";
const pretty = (v: unknown) => JSON.stringify(v, null, 2);
export function CompareResults({ changes, ran }: { changes: JsonChange[]; ran: boolean }) {
  if (!ran) return <div className="empty-state"><GitCompareArrows size={24} /><strong>Your diff will appear here</strong><span>Run a comparison to inspect every change, path by path.</span></div>;
  if (!changes.length) return <div className="success-state"><Check size={22} /><div><strong>Documents are identical</strong><span>No differences found between the two JSON values.</span></div></div>;
  return <div className="results-list">{changes.map((change, i) => <article className="change-row" key={`${change.path}-${i}`}>
    <span className={`change-badge ${change.kind}`}>{change.kind === "added" ? <Plus size={12} /> : change.kind === "removed" ? <Minus size={12} /> : <RefreshCw size={12} />}{change.kind}</span>
    <code className="change-path">{change.path}</code>
    <div className="change-values">
      {change.kind !== "added" && <pre className="old-value">{pretty(change.oldValue)}</pre>}
      {change.kind !== "removed" && <pre className="new-value">{pretty(change.newValue)}</pre>}
    </div>
  </article>)}</div>;
}
export function ValidationResults({ result, ran }: { result: { valid: boolean; issues: ValidationIssue[] } | null; ran: boolean }) {
  if (!ran || !result) return <div className="empty-state"><CircleAlert size={24} /><strong>Validation report</strong><span>Provide data and a JSON Schema to see whether it passes.</span></div>;
  if (result.valid) return <div className="success-state"><Check size={22} /><div><strong>Schema validation passed</strong><span>Your JSON data conforms to the supplied schema.</span></div></div>;
  return <div className="validation-issues"><div className="issue-summary"><CircleAlert size={17} /><strong>{result.issues.length} validation {result.issues.length === 1 ? "issue" : "issues"} found</strong></div>
    {result.issues.map((issue, i) => <div className="issue-row" key={i}><code>{issue.path}</code><span>{issue.message}</span><small>{issue.keyword}</small></div>)}
  </div>;
}