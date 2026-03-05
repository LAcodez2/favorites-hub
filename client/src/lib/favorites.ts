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
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
};

export const FavoritesAPI = {
  list: (page = 1, limit = 20, search = "") =>
    api(
      `/favorites?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`,
    ) as Promise<ListFavoritesResponse>,

  create: (data: { title: string; url?: string; notes?: string }) =>
    api("/favorites", { method: "POST", json: data }) as Promise<{
      favorite: Favorite;
    }>,
};