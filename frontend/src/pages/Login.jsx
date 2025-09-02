import { useState } from "react";
import api from "../api";

export default function Login() {
  const [email, setEmail] = useState("tech@oralvis.com");
  const [password, setPassword] = useState("tech123");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("email", data.email);
      window.location.href = data.role === "Technician" ? "/upload" : "/scans";
    } catch (e) {
      setErr(e?.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} style={{ display: "grid", gap: 12, maxWidth: 420 }}>
      <h3>Login</h3>
      {err && <div style={{ color: "crimson" }}>{err}</div>}
      <label>Email <input value={email} onChange={e=>setEmail(e.target.value)} required /></label>
      <label>Password <input value={password} onChange={e=>setPassword(e.target.value)} type="password" required /></label>
      <button disabled={loading}>{loading ? "…" : "Sign in"}</button>

      <div style={{ fontSize: 12, opacity: .7, marginTop: 8 }}>
        Demo users:<br/>
        Technician — tech@oralvis.com / tech123<br/>
        Dentist — dentist@oralvis.com / dentist123
      </div>
    </form>
  );
}
