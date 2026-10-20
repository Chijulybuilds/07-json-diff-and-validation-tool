import { useState } from "react";
import { ArrowLeft, ArrowRight, Eye, EyeOff, ShieldCheck } from "lucide-react";
import Brand from "../components/Brand";
import type { DemoUser } from "../types";
type Props = { mode: "login" | "signup"; onMode: (m: "login" | "signup") => void; onBack: () => void; onSuccess: (user: DemoUser) => void };
export default function AuthPage({ mode, onMode, onBack, onSuccess }: Props) {
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); const [error, setError] = useState("");
  const signup = mode === "signup";
  function submit(e: React.FormEvent) {
    e.preventDefault(); setError("");
    if (!email.includes("@") || password.length < 6) { setError("Enter a valid email and a password with at least 6 characters."); return; }
    const stored = localStorage.getItem("diffify-demo-user");
    if (!signup) {
      if (!stored) { setError("No demo account found. Create one first."); return; }
      const user = JSON.parse(stored) as DemoUser & { password: string };
      if (user.email.toLowerCase() !== email.toLowerCase() || user.password !== password) { setError("Email or password does not match this demo account."); return; }
      onSuccess({ name: user.name, email: user.email }); return;
    }
    if (!name.trim()) { setError("Please enter your name."); return; }
    localStorage.setItem("diffify-demo-user", JSON.stringify({ name: name.trim(), email, password }));
    onSuccess({ name: name.trim(), email });
  }
  return <main className="auth-layout">
    <div className="auth-art"><div className="auth-art-grid" /><Brand onClick={onBack} /><div className="auth-art-copy"><span className="eyebrow"><span className="status-dot" /> JSON WORKFLOW, REIMAGINED</span><h1>Make every<br />change <span>clear.</span></h1><p>Compare with confidence. Validate with precision. Keep your data workflow moving.</p></div><div className="auth-art-foot"><span>DIFFIFY / SECURE BY DESIGN</span><span>01 — 02</span></div></div>
    <section className="auth-form-side"><button className="back-link" onClick={onBack}><ArrowLeft size={15} /> Back to home</button><div className="auth-form-wrap">
      <div className="auth-icon"><ShieldCheck size={23} /></div><span className="eyebrow">{signup ? "START YOUR WORKSPACE" : "WELCOME BACK"}</span>
      <h2>{signup ? "Create your account" : "Sign in to Diffify"}</h2><p className="muted">{signup ? "A clearer view of your JSON starts here." : "Pick up where your data work left off."}</p>
      <form onSubmit={submit} className="auth-form">
        {signup && <label>Full name<input autoComplete="name" value={name} onChange={e => setName(e.target.value)} placeholder="Alex Morgan" /></label>}
        <label>Email address<input type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" /></label>
        <label>Password<div className="password-field"><input type={showPassword ? "text" : "password"} autoComplete={signup ? "new-password" : "current-password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 6 characters" /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password visibility">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></label>
        {error && <div className="form-error">{error}</div>}
        <button className="button button-primary full-width" type="submit">{signup ? "Create account" : "Sign in"} <ArrowRight size={16} /></button>
      </form>
      <p className="auth-switch">{signup ? "Already have an account?" : "New to Diffify?"} <button onClick={() => { setError(""); onMode(signup ? "login" : "signup"); }}>{signup ? "Sign in" : "Create an account"}</button></p>
      <p className="demo-note">Demo mode only: credentials stay in this browser. Do not use a real password.</p>
    </div></section>
  </main>;
}