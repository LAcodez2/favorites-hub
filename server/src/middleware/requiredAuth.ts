import type { RequestHandler } from "express";
import { verifyToken } from "../validators/jwt";

export const requiredAuth: RequestHandler = (req, res, next) => {
  const token = req.cookies?.token as string | undefined;

  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const payload = verifyToken(token);
    req.userId = payload.userId;
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
};
