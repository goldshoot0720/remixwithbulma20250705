import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getUdemy() {
  try {
    return await prisma.udemy.findMany();
  } catch (error) {
    console.log("unexpected error", error);
    return [];
  }
}
