import { Braces, Clipboard, RotateCcw } from "lucide-react";
type Props = { title: string; subtitle: string; value: string; onChange: (v: string) => void; tint?: string; onSample?: () => void };
export default function JsonEditor({ title, subtitle, value, onChange, tint = "violet", onSample }: Props) {
  const copy = async () => { try { await navigator.clipboard.writeText(value); } catch { /* clipboard permission can be unavailable */ } };
  return <section className={`editor-card editor-${tint}`}>
    <div className="editor-heading">
      <div className="editor-title-icon"><Braces size={17} /></div>
      <div><h3>{title}</h3><p>{subtitle}</p></div>
      <div className="editor-actions">
        {onSample && <button className="tiny-action" onClick={onSample}><RotateCcw size={13} /> Sample</button>}
        <button className="tiny-action" onClick={copy} title="Copy JSON"><Clipboard size={13} /> Copy</button>
      </div>
    </div>
    <textarea spellCheck={false} value={value} onChange={e => onChange(e.target.value)} aria-label={title} />
    <div className="editor-foot"><span className="status-dot" /> JSON input <span className="editor-foot-right">{value.split("\n").length} lines</span></div>
  </section>;
}