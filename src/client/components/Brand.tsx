import { Layers3 } from "lucide-react";
export default function Brand({ onClick }: { onClick?: () => void }) {
  return <button className="brand" onClick={onClick} aria-label="Diffify home">
    <span className="brand-mark"><Layers3 size={24} strokeWidth={2.7} /></span>
    <span>diffify<span className="brand-dot">.</span></span>
  </button>;
}