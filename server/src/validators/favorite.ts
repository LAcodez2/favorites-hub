import { z } from "zod";

export const createFavoriteSchema = z.object({
  title: z.string().min(1),
  url: z.string().url().optional(),
  notes: z.string().max(1000).optional(),
});
