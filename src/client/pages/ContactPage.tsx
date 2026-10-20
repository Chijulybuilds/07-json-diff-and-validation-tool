import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Mail, MessageSquare, Send } from "lucide-react";
import Brand from "../components/Brand";
export default function ContactPage({ onBack }: { onBack: () => void }) {
  const [sent, setSent] = useState(false); const [form, setForm] = useState({ name: "", email: "", topic: "Product feedback", message: "" });
  const update = (key: keyof typeof form, value: string) => setForm(old => ({ ...old, [key]: value }));
  return <main className="contact-page"><nav className="top-nav contact-nav"><Brand onClick={onBack} /><button className="back-link" onClick={onBack}><ArrowLeft size={15} /> Back to Diffify</button></nav>
    <div className="contact-hero"><span className="eyebrow">WE’RE LISTENING</span><h1>Let’s make data<br /><span>make sense.</span></h1><p>Questions, feedback, or an idea for Diffify? Send us a note.</p></div>
    <div className="contact-grid"><aside className="contact-aside"><div className="contact-detail"><span className="detail-icon"><Mail size={19} /></span><div><strong>Product & support</strong><p>Tell us what you’re building and where you’re stuck.</p></div></div><div className="contact-detail"><span className="detail-icon"><MessageSquare size={19} /></span><div><strong>Share feedback</strong><p>Your feedback helps shape a more useful JSON workflow.</p></div></div><div className="contact-note"><span className="status-dot" /> Demo environment <p>Messages are not sent to a live inbox in this prototype.</p></div></aside>
      <form className="contact-form" onSubmit={e => { e.preventDefault(); setSent(true); }}><h2>{sent ? "Thanks for reaching out." : "Send us a message"}</h2><p className="muted">{sent ? "Your demo submission has been recorded on this screen." : "We’ll make sure your message has all the context it needs."}</p>
        {sent ? <div className="contact-success"><CheckCircle2 size={30} /><strong>Message ready</strong><span>This is a frontend demo. No email has been sent.</span><button className="button button-secondary" type="button" onClick={() => { setSent(false); setForm({ name: "", email: "", topic: "Product feedback", message: "" }); }}>Send another message</button></div> : <>
          <div className="form-two"><label>Name<input required value={form.name} onChange={e => update("name", e.target.value)} placeholder="Your name" /></label><label>Email<input required type="email" value={form.email} onChange={e => update("email", e.target.value)} placeholder="you@example.com" /></label></div>
          <label>What’s this about?<select value={form.topic} onChange={e => update("topic", e.target.value)}><option>Product feedback</option><option>Technical question</option><option>Bug report</option><option>Partnership</option><option>Other</option></select></label>
          <label>Message<textarea required rows={5} value={form.message} onChange={e => update("message", e.target.value)} placeholder="Tell us a little about it..." /></label>
          <button className="button button-primary" type="submit">Submit message <Send size={15} /></button>
        </>}</form></div><footer className="site-footer"><Brand onClick={onBack} /><span>© {new Date().getFullYear()} Diffify. Built for clarity.</span></footer>
  </main>;
}