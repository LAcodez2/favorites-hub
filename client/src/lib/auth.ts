import { api } from "./api";

export const Auth = {
  register: (email: string, password: string) =>
    api("/auth/register", { method: "POST", json: { email, password } }),

  login: (email: string, password: string) =>
    api("/auth/login", { method: "POST", json: { email, password } }),

  me: () => api("/auth/me"),

  logout: () => api("/auth/logout", { method: "POST" }),
};