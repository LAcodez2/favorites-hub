import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../prisma";
import {
  createFavoriteSchema,
  updateFavoriteSchema,
} from "../validators/favoriteSchema";

// Query params validator for pagination/search
const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional().default(""),
});

function paramId(req: Request): string {
  const raw = (req.params as any).id as unknown;

  if (typeof raw === "string") return raw;
  if (Array.isArray(raw)) return raw[0] ?? "";
  return "";
}

// POST /favorites
export async function createFavorite(req: Request, res: Response) {
  if (!req.userId) return res.status(401).json({ error: "Not authenticated" });

  try {
    const data = createFavoriteSchema.parse(req.body);

    const favorite = await prisma.favorite.create({
      data: {
        userId: req.userId,
        title: data.title,
        url: data.url,
        notes: data.notes,
      },
      select: {
        id: true,
        title: true,
        url: true,
        notes: true,
        createdAt: true,
      },
    });

    return res.status(201).json({ favorite });
  } catch (err: any) {
    if (err?.name === "ZodError") {
      return res
        .status(400)
        .json({ error: "Invalid input", details: err.flatten() });
    }
    return res.status(500).json({ error: "Server error" });
  }
}

// GET /favorites?page=&limit=&search=
export async function listFavorites(req: Request, res: Response) {
  if (!req.userId) return res.status(401).json({ error: "Not authenticated" });

  const parsed = listQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ error: "Invalid query", details: parsed.error.flatten() });
  }

  const { page, limit, search } = parsed.data;
  const skip = (page - 1) * limit;

  // Base ownership filter
  const where: any = { userId: req.userId };

  // Optional search filter
  const q = search.trim();
  if (q.length > 0) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { notes: { contains: q, mode: "insensitive" } },
      { url: { contains: q, mode: "insensitive" } },
    ];
  }

  try {
    const [favorites, total] = await Promise.all([
      prisma.favorite.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          url: true,
          notes: true,
          createdAt: true,
        },
      }),
      prisma.favorite.count({ where }),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return res.json({ favorites, page, limit, total, totalPages });
  } catch {
    return res.status(500).json({ error: "Server error" });
  }
}

// PATCH /favorites/:id
export async function updateFavorite(req: Request, res: Response) {
  if (!req.userId) return res.status(401).json({ error: "Not authenticated" });

  const id = paramId(req);
  if (!id) return res.status(400).json({ error: "Missing id" });

  try {
    const data = updateFavoriteSchema.parse(req.body);

    const existing = await prisma.favorite.findFirst({
      where: { id, userId: req.userId },
      select: { id: true },
    });
    if (!existing) return res.status(404).json({ error: "Favorite not found" });

    const favorite = await prisma.favorite.update({
      where: { id },
      data,
      select: {
        id: true,
        title: true,
        url: true,
        notes: true,
        createdAt: true,
      },
    });

    return res.json({ favorite });
  } catch (err: any) {
    if (err?.name === "ZodError") {
      return res
        .status(400)
        .json({ error: "Invalid input", details: err.flatten() });
    }
    return res.status(500).json({ error: "Server error" });
  }
}

// DELETE /favorites/:id
export async function deleteFavorite(req: Request, res: Response) {
  if (!req.userId) return res.status(401).json({ error: "Not authenticated" });

  const id = paramId(req);
  if (!id) return res.status(400).json({ error: "Missing id" });

  try {
    const existing = await prisma.favorite.findFirst({
      where: { id, userId: req.userId },
      select: { id: true },
    });
    if (!existing) return res.status(404).json({ error: "Favorite not found" });

    await prisma.favorite.delete({ where: { id } });
    return res.status(204).send();
  } catch {
    return res.status(500).json({ error: "Server error" });
  }
}
