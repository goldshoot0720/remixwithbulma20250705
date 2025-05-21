import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getSubscribe() {
  try {
    return await prisma.subscribe.findMany();
  } catch (error) {
    console.log("unexpected error", error);
    return [];
  }
}
