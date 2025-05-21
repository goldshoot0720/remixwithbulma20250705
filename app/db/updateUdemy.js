import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * 更新指定 Udemy 課程的排程
 * @param {string} id - 課程 ID
 * @param {string} schedule - 新的排程內容
 * @returns {Promise<boolean>} 是否成功
 */
export async function updateUdemy(id, schedule) {
  try {
    const result = await prisma.udemy.update({
      where: { id },
      data: { schedule },
    });
    return !!result;
  } catch (error) {
    console.error("updateUdemy error:", error);
    return false;
  }
}
