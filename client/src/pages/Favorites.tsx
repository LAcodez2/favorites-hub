import { useEffect, useState } from "react";
import { FavoritesAPI, type Favorite } from "../lib/favorites";
import { Link } from "react-router-dom";

export default function Favorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const data = await FavoritesAPI.list(1, 20, "");
      setFavorites(data.favorites);
    } catch (e: any) {
      setErr(e.message ?? "Failed to load favorites");
    } finally {
      setLoading(false);
    }
  }

  async function onAdd(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    try {
      await FavoritesAPI.create({
        title,
        url: url || undefined,
        notes: notes || undefined,
      });

      // reset form + reload list
      setTitle("");
      setUrl("");
      setNotes("");
      await load();
    } catch (e: any) {
      setErr(e.message ?? "Failed to create favorite");
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div style={{ padding: 24, maxWidth: 800, fontFamily: "system-ui" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Favorites</h1>
        <Link to="/">Home</Link>
      </div>

      <form onSubmit={onAdd} style={{ display: "grid", gap: 8 }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title (required)"
          style={{ padding: 10 }}
        />
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="URL (optional)"
          style={{ padding: 10 }}
        />
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes (optional)"
          style={{ padding: 10, minHeight: 80 }}
        />
        <button type="submit" disabled={!title || loading}>
          Add Favorite
        </button>
      </form>

      {err ? <p style={{ color: "crimson" }}>{err}</p> : null}
      {loading ? <p>Loading...</p> : null}

      <hr style={{ margin: "16px 0" }} />

      <h2>Your Favorites</h2>

      {favorites.length === 0 && !loading ? <p>No favorites yet.</p> : null}

      <ul style={{ display: "grid", gap: 10, padding: 0, listStyle: "none" }}>
        {favorites.map((f) => (
          <li
            key={f.id}
            style={{
              border: "1px solid #3333",
              borderRadius: 10,
              padding: 12,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <b>{f.title}</b>
              <small>{new Date(f.createdAt).toLocaleString()}</small>
            </div>

            {f.url ? (
              <div>
                <a href={f.url} target="_blank" rel="noreferrer">
                  {f.url}
                </a>
              </div>
            ) : null}

            {f.notes ? <p style={{ marginTop: 8 }}>{f.notes}</p> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}