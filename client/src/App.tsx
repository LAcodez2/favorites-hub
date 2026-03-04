import { Link } from "react-router-dom";

export default function App() {
  return (
    <div style={{ padding: 24 }}>
      <h1>Favorites Hub</h1>

      <nav style={{ display: "flex", gap: 12 }}>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/favorites">Favorites</Link>
      </nav>
    </div>
  );
}