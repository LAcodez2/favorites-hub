import { z } from "zod";

/** Express query params come in as string | string[] | undefined.
 * This helper turns arrays into the first value, and leaves strings as-is.
 */

const first = (v: unknown) => (Array.isArray(v) ? v[0] : v);

export const listFavoritesQuerySchema = z.object({
  page: z.preprocess(first, z.coerce.number().int().min(1).default(1)),
  limit: z.preprocess(first, z.coerce.number().min(1).max(50).default(10)),
  search: z.preprocess(first, z.string().trim().optional().default("")),
});

export type listFavoritesQuery = z.infer<typeof listFavoritesQuerySchema>;
