import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function updateBank(id, saving) {
  try {
    const result = await prisma.bank.update({
      where: { id },
      data: { saving },
    });
    return !!result;
  } catch (error) {
    console.error("updateBank error:", error);
    return false;
  }
}
