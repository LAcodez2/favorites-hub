import { Router } from "express";
import { requiredAuth } from "../middleware/requiredAuth";
import {
  createFavorite,
  listFavorites,
  updateFavorite,
  deleteFavorite,
} from "../controllers/favoriteController";

export const favoriteRoutes = Router();

favoriteRoutes.use(requiredAuth);

favoriteRoutes.post("/", createFavorite);
favoriteRoutes.get("/", listFavorites);
favoriteRoutes.post("/:id", updateFavorite);
favoriteRoutes.post("/:id", deleteFavorite);
