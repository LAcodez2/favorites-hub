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

favoriteRoutes.post("/", createFavorite);     // create
favoriteRoutes.get("/", listFavorites);       // read
favoriteRoutes.patch("/:id", updateFavorite); // update
favoriteRoutes.delete("/:id", deleteFavorite); // delete