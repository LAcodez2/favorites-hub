import { api } from "./api";

export type Favorite = {
  id: string;
  title: string;
  url: string | null;
  notes: string | null;
  createdAt: string;
};

export type ListFavoritesResponse = {
  favorites: Favorite[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type CreateFavoriteInput = {
  title: string;
  url?: string;
  notes?: string;
};

export type UpdateFavoriteInput = Partial<CreateFavoriteInput>;

export const FavoritesAPI = {
  list: (page = 1, limit = 20, search = "") =>
    api(
      `/favorites?page=${page}&limit=${limit}&search=${encodeURIComponent(
        search,
      )}`,
    ) as Promise<ListFavoritesResponse>,

  create: (data: CreateFavoriteInput) =>
    api("/favorites", { method: "POST", json: data }) as Promise<{
      favorite: Favorite;
    }>,

  update: (id: string, data: UpdateFavoriteInput) =>
    api(`/favorites/${id}`, { method: "PATCH", json: data }) as Promise<{
      favorite: Favorite;
    }>,

  delete: (id: string) =>
    api(`/favorites/${id}`, { method: "DELETE" }) as Promise<void>,
};