import { PrismaClient } from "./generated/prisma/client.ts";

export const prisma = new PrismaClient();

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
