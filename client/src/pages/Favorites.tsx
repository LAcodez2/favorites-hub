import { useEffect, useState } from "react";
import { FavoritesAPI } from "../lib/favorites";

type Favorite = {
  id: string;
  title: string;
  url: string | null;
  notes: string | null;
  createdAt: string;
};

export default function Favorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [title, setTitle] = useState("");
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setErr(null);
    try {
      const data = await FavoritesAPI.list(1, 20, "");
      setFavorites(data.favorites);
    } catch (e: any) {
      setErr(e.message ?? "Failed to load favorites");
    }
  }

  async function onAdd(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    try {
      await FavoritesAPI.create({ title });
      setTitle("");
      await load();
    } catch (e: any) {
      setErr(e.message ?? "Failed to create favorite");
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div style={{ padding: 24, maxWidth: 700 }}>
      <h1>Favorites</h1>

      <form onSubmit={onAdd} style={{ display: "flex", gap: 8 }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Favorite title"
          style={{ flex: 1, padding: 8 }}
        />
        <button type="submit">Add</button>
      </form>

      {err ? <p style={{ color: "crimson" }}>{err}</p> : null}

      <ul style={{ marginTop: 16 }}>
        {favorites.map((f) => (
          <li key={f.id}>
            <b>{f.title}</b>{" "}
            {f.url ? (
              <a href={f.url} target="_blank" rel="noreferrer">
                (link)
              </a>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}