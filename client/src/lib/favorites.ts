import { api } from "./api";

export const FavoritesAPI = {
  list: (page = 1, limit = 10, search = "") =>
    api(`/favorites?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`),

  create: (data: { title: string; url?: string; notes?: string }) =>
    api("/favorites", { method: "POST", json: data }),
};