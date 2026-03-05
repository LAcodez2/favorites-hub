import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";

export default function App() {
  const nav = useNavigate();
  const { user, loading, logout } = useAuth();

  async function onLogout() {
    await logout();
    nav("/login");
  }

  return (
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>Favorites Hub</h1>

      {loading ? (
        <p>Loading session...</p>
      ) : user ? (
        <>
          <p>
            Logged in as <b>{user.email}</b>
          </p>

          <div style={{ display: "flex", gap: 12 }}>
            <Link to="/favorites">Favorites</Link>
            <button onClick={onLogout}>Logout</button>
          </div>
        </>
      ) : (
        <div style={{ display: "flex", gap: 12 }}>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      )}
    </div>
  );
}