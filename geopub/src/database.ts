import { PrismaClient, Prisma } from "./generated/prisma/client.ts";

export const prisma = new PrismaClient();

// Prisma error codes
export const PrismaErrorCode = {
  UNIQUE_CONSTRAINT_VIOLATION: "P2002",
} as const;

// Re-export Prisma namespace for error types
export { Prisma };

// Graceful shutdown handler
async function shutdown(signal: string) {
  console.log(`Received ${signal}, closing server gracefully...`);

  try {
    await prisma.$disconnect();
    console.log("Prisma Client disconnected");
    Deno.exit(0);
  } catch (error) {
    console.error("Error during shutdown:", error);
    Deno.exit(1);
  }
}

Deno.addSignalListener("SIGINT", () => shutdown("SIGINT"));
Deno.addSignalListener("SIGTERM", () => shhutdown("SIGTERM"));
