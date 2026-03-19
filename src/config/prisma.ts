import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

// Create a reusable PG pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
   max: 10,                // max connections
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

// Create the Prisma adapter
// Cast the pool to unknown/any to work around duplicate @types/pg type incompatibilities
const adapter = new PrismaPg(pool as unknown as any);

// Reuse Prisma client in dev (prevents too many connections)
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter, // 👈 Required when using engine type "client"
    log: process.env.NODE_ENV === "development"
    ? ["warn", "error"]
    : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
