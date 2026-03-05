import type { Favorite } from "../lib/favorites";
import FavoriteCard from "./FavoriteCard";

type Props = {
  favorites: Favorite[];
  onDelete: (id: string) => Promise<void>;
  onUpdate: (
    id: string,
    data: { title?: string; url?: string; notes?: string }
  ) => Promise<void>;
};

export default function FavoriteList({ favorites, onDelete, onUpdate }: Props) {
  return (
    <ul style={{ display: "grid", gap: 10, padding: 0, listStyle: "none" }}>
      {favorites.map((f) => (
        <FavoriteCard key={f.id} favorite={f} onDelete={onDelete} onUpdate={onUpdate} />
      ))}
    </ul>
  );
}