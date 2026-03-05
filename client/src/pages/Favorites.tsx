import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import FavoriteForm from "../components/FavoriteForm";
import FavoriteList from "../components/FavoriteList";
import { FavoritesAPI, type Favorite } from "../lib/favorites";

export default function Favorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // search + pagination
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const data = await FavoritesAPI.list(page, limit, search);
      setFavorites(data.favorites);
      setTotalPages(data.totalPages);
    } catch (e: any) {
      setErr(e.message ?? "Failed to load favorites");
    } finally {
      setLoading(false);
    }
  }

  async function onCreate(data: { title: string; url?: string; notes?: string }) {
    setErr(null);
    await FavoritesAPI.create(data);
    setPage(1); // new item should show at top
    // reload with page 1
    const fresh = await FavoritesAPI.list(1, limit, search);
    setFavorites(fresh.favorites);
    setTotalPages(fresh.totalPages);
  }

  async function onDelete(id: string) {
    setErr(null);
    // optimistic
    const prev = favorites;
    setFavorites((xs) => xs.filter((f) => f.id !== id));
    try {
      await FavoritesAPI.delete(id);
    } catch (e: any) {
      setFavorites(prev);
      setErr(e.message ?? "Failed to delete favorite");
    }
  }

  async function onUpdate(
    id: string,
    data: { title?: string; url?: string; notes?: string },
  ) {
    setErr(null);
    try {
      const res = await FavoritesAPI.update(id, data);
      // update in place (no full reload)
      setFavorites((xs) => xs.map((f) => (f.id === id ? res.favorite : f)));
    } catch (e: any) {
      setErr(e.message ?? "Failed to update favorite");
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto", fontFamily: "system-ui" }}>
      <Navbar />

      <h1>Favorites</h1>

      <div style={{ display: "flex", gap: 8, margin: "12px 0" }}>
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search favorites..."
          style={{ flex: 1, padding: 10 }}
        />
        <button onClick={() => load()} disabled={loading}>
          Search
        </button>
      </div>

      <FavoriteForm onCreate={onCreate} disabled={loading} />

      {err ? <p style={{ color: "crimson" }}>{err}</p> : null}
      {loading ? <p>Loading...</p> : null}

      <hr style={{ margin: "16px 0" }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>Your Favorites</h2>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button disabled={page <= 1 || loading} onClick={() => setPage((p) => p - 1)}>
            Prev
          </button>
          <span>
            Page {page} / {totalPages}
          </span>
          <button disabled={page >= totalPages || loading} onClick={() => setPage((p) => p + 1)}>
            Next
          </button>
        </div>
      </div>

      {favorites.length === 0 && !loading ? <p>No favorites yet.</p> : null}

      <FavoriteList favorites={favorites} onDelete={onDelete} onUpdate={onUpdate} />
    </div>
  );
}