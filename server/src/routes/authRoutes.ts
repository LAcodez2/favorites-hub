import { Router } from "express";
import { requiredAuth } from "../middleware/requiredAuth";
import { register, login, me, logout } from "../controllers/authController";

export const authRoutes = Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.get("/me", requiredAuth, me);
authRoutes.post("/logout", logout);