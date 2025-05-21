import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * 更新指定訂閱項目的費用、卡片與下次日期
 * @param {number} id - 訂閱 ID
 * @param {number} fee - 新的費用
 * @param {string} card - 使用的卡片
 * @param {Date} next - 下次收費日期
 * @returns {Promise<boolean>} 是否成功
 */
export async function updateSubscribe(id, fee, card, next) {
  try {
    const result = await prisma.subscribe.update({
      where: { id },
      data: { fee, card, next },
    });
    return !!result;
  } catch (error) {
    console.error("updateSubscribe error:", error);
    return false;
  }
}
