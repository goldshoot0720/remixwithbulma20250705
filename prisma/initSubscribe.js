import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const prisma = new PrismaClient().$extends(withAccelerate());

async function main() {
  await prisma.subscribe.createMany({
    data: [
      {
        item: "Netflix",
        link: "https://www.netflix.com",
        fee: 290,
        card: "中信",
        next: new Date("2025-05-21"),
      },
      {
        item: "巴哈姆特動畫瘋",
        link: "https://ani.gamer.com.tw",
        fee: 99,
        card: "無",
        next: new Date("2025-11-22"),
      },
    ],
  });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect(); // ❗ 拼字錯誤修正：$disconnet → $disconnect
  });
