import { useState } from "react";

type Props = {
  onCreate: (data: { title: string; url?: string; notes?: string }) => Promise<void>;
  disabled?: boolean;
};

export default function FavoriteForm({ onCreate, disabled }: Props) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    setSaving(true);
    try {
      await onCreate({
        title: title.trim(),
        url: url.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      setTitle("");
      setUrl("");
      setNotes("");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: 8 }}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title (required)"
        style={{ padding: 10 }}
        disabled={disabled || saving}
      />
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="URL (optional)"
        style={{ padding: 10 }}
        disabled={disabled || saving}
      />
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notes (optional)"
        style={{ padding: 10, minHeight: 80 }}
        disabled={disabled || saving}
      />
      <button type="submit" disabled={disabled || saving || !title.trim()}>
        {saving ? "Adding..." : "Add Favorite"}
      </button>
    </form>
  );
}