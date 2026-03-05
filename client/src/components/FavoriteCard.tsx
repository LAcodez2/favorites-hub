import { useState } from "react";
import type { Favorite } from "../lib/favorites";

type Props = {
  favorite: Favorite;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (
    id: string,
    data: { title?: string; url?: string; notes?: string }
  ) => Promise<void>;
};

export default function FavoriteCard({ favorite, onDelete, onUpdate }: Props) {
  const [editing, setEditing] = useState(false);

  const [title, setTitle] = useState(favorite.title);
  const [url, setUrl] = useState(favorite.url ?? "");
  const [notes, setNotes] = useState(favorite.notes ?? "");

  const [busy, setBusy] = useState(false);

  function onCancel() {
    setEditing(false);
    setTitle(favorite.title);
    setUrl(favorite.url ?? "");
    setNotes(favorite.notes ?? "");
  }

  async function onSave() {
    setBusy(true);
    try {
      await onUpdate(favorite.id, {
        title: title.trim() || undefined,
        url: url.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      setEditing(false);
    } finally {
      setBusy(false);
    }
  }

  async function onRemove() {
    setBusy(true);
    try {
      await onDelete(favorite.id);
    } finally {
      setBusy(false);
    }
  }

  return (
    <li
      style={{
        border: "1px solid #3333",
        borderRadius: 10,
        padding: 12,
      }}
    >
      {!editing ? (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
            <b>{favorite.title}</b>
            <small>{new Date(favorite.createdAt).toLocaleString()}</small>
          </div>

          {favorite.url ? (
            <div style={{ marginTop: 6 }}>
              <a href={favorite.url} target="_blank" rel="noreferrer">
                {favorite.url}
              </a>
            </div>
          ) : null}

          {favorite.notes ? <p style={{ marginTop: 8 }}>{favorite.notes}</p> : null}

          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <button onClick={() => setEditing(true)} disabled={busy}>
              Edit
            </button>
            <button onClick={onRemove} disabled={busy}>
              {busy ? "Working..." : "Delete"}
            </button>
          </div>
        </>
      ) : (
        <>
          <div style={{ display: "grid", gap: 8 }}>
            <input value={title} onChange={(e) => setTitle(e.target.value)} style={{ padding: 10 }} />
            <input value={url} onChange={(e) => setUrl(e.target.value)} style={{ padding: 10 }} />
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{ padding: 10, minHeight: 80 }}
            />
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <button onClick={onSave} disabled={busy || !title.trim()}>
              {busy ? "Saving..." : "Save"}
            </button>
            <button onClick={onCancel} disabled={busy}>
              Cancel
            </button>
          </div>
        </>
      )}
    </li>
  );
}