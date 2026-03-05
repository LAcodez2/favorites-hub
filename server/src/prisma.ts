import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Neon/Render often require SSL; many hosted Postgres URLs already include sslmode=require.
  // If yours doesn't, we can add ssl here later.
});

export const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
});