import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: {
    // Render will provide DATABASE_URL in env vars.
    // Using process.env avoids PrismaConfigEnvError during commands where DB isn't required.
    url: process.env.DATABASE_URL ?? "",
  },
});