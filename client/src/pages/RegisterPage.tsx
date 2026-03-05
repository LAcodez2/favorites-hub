import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../lib/api";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    try {
      await api("/auth/register", {
        method: "POST",
        json: { email, password },
      });

      navigate("/login");
    } catch (e: any) {
      setErr(e.message ?? "Register failed");
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Register</h1>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Register</button>
      </form>

      {err && <p style={{ color: "red" }}>{err}</p>}

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}