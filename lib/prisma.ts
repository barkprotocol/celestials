import { PrismaClient } from '@prisma/client';

// Initialize Prisma Client
const prisma = new PrismaClient();

// Handle graceful shutdown of Prisma client
export const shutdownPrismaClient = async () => {
  await prisma.$disconnect();
};

export default prisma;