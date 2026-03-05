import "dotenv/config";
import express, { type Request, type Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { authRoutes } from "./routes/authRoutes";
import { favoriteRoutes } from "./routes/favoriteRoutes";

const app = express();

app.use(express.json());
app.use(cookieParser());

const isProd = process.env.NODE_ENV === "production";

const clientOrigin =
  process.env.CLIENT_ORIGIN ?? "http://localhost:5173";

app.use(
  cors({
    origin: clientOrigin,
    credentials: true,
  }),
);

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRoutes);
app.use("/favorites", favoriteRoutes);

const PORT = Number(process.env.PORT) || 4000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
