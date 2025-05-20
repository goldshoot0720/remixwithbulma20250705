import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getBank() {
  try {
    return await prisma.bank.findMany();
  } catch (error) {
    console.log("unexpected error", error);
    return [];
  }
}
