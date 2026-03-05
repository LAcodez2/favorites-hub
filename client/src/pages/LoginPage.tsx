import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../lib/api";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    try {
      await api("/auth/login", {
        method: "POST",
        json: { email, password },
      });

      navigate("/favorites");
    } catch (e: any) {
      setErr(e.message ?? "Login failed");
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Login</h1>

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

        <button type="submit">Login</button>
      </form>

      {err && <p style={{ color: "red" }}>{err}</p>}

      <p>
        No account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}