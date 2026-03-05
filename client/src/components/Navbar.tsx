import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const nav = useNavigate();
  const { user, logout } = useAuth();

  async function onLogout() {
    await logout();
    nav("/login");
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 0",
      }}
    >
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <Link to="/" style={{ fontWeight: 700 }}>
          Favorites Hub
        </Link>
        <Link to="/favorites">Favorites</Link>
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        {user ? <span style={{ opacity: 0.8 }}>{user.email}</span> : null}
        {user ? <button onClick={onLogout}>Logout</button> : null}
      </div>
    </div>
  );
}