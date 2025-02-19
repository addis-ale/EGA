import { PrismaClient } from "@prisma/client";

// Create a global object to store the PrismaClient instance
const globalForPrisma = global as unknown as { prisma?: PrismaClient };

// Check if a PrismaClient instance already exists in the global object.
// If it doesn't, create a new instance.
const prisma = globalForPrisma.prisma ?? new PrismaClient();

// In non-production environments, store the PrismaClient instance in the global object
// to reuse it across hot reloads.
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Export the PrismaClient instance for use in your application
export default prisma;
