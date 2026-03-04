import type { Request, Response } from "express";
import { prisma } from "../prisma";
import { createFavoriteSchema } from "../validators/favoriteSchema";
import { updateFavoriteSchema } from "../validators/favoriteSchema";
import { ZodError } from "zod";
import { listFavoritesQuerySchema } from "../validators/favoriteQuery";
import { error } from "node:console";

export async function createFavorite(req: Request, res: Response) {
  if (!req.userId) return res.status(401).json({ error: "Not authenticated" });

  try {
    const data = createFavoriteSchema.parse(req.body); // ✅ guaranteed object

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
  } catch (err) {
    if (err instanceof ZodError) {
      return res
        .status(400)
        .json({ error: "Invalid input", details: err.flatten() });
    }

    // unexpected error
    return res.status(500).json({ error: "Server error" });
  }
}

// list favorites
export async function listFavorites(req: Request, res: Response) {
  if (!req.userId) return res.status(401).json({ error: "Not authenticated" });

  const parsed = listFavoritesQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid query params",
      details: parsed.error.flatten(),
    });
  }

  const { page, limit, search } = parsed.data;

  const where = {
    userId: req.userId,
    ...(search
      ? { title: { contains: search, mode: "insensitive" as const } }
      : {}),
  };

  const skip = (page - 1) * limit;

  const [total, favorites] = await Promise.all([
    prisma.favorite.count({ where }),
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
  ]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return res.json({
    page,
    limit,
    total,
    totalPages,
    favorites,
  });
}

// Update favorite
export async function updateFavorite(
  req: Request<{ id: string }>,
  res: Response,
) {
  if (!req.userId) return res.status(401).json({ error: "Not authenticated" });

  const { id } = req.params;

  try {
    const data = updateFavoriteSchema.parse(req.body);

    const owned = await prisma.favorite.findFirst({
      where: { id, userId: req.userId },
      select: { id: true },
    });
    if (!owned) return res.status(404).json({ error: "Favorite not found" });

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

// Delete favorite
export async function deleteFavorite(
  req: Request<{ id: string }>,
  res: Response,
) {
  if (!req.userId) return res.status(401).json({ error: "Not authenticated" });

  const { id } = req.params;

  const owned = await prisma.favorite.findFirst({
    where: { id, userId: req.userId },
    select: { id: true },
  });
  if (!owned) return res.status(404).json({ error: "Favorite not found" });

  await prisma.favorite.delete({ where: { id } });
  return res.status(204).send();
}
