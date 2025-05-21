import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const prisma = new PrismaClient().$extends(withAccelerate());

async function main() {
  await prisma.bank.createMany({
    data: [
      { name: "合作金庫", saving: 0 },
      { name: "台北富邦", saving: 0 },
      { name: "國泰世華", saving: 0 },
      { name: "兆豐銀行", saving: 0 },
      { name: "王道銀行", saving: 0 },
      { name: "新光銀行", saving: 0 },
      { name: "中華郵政", saving: 0 },
      { name: "玉山銀行", saving: 0 },
      { name: "台新銀行", saving: 0 },
      { name: "中國信託", saving: 0 },
    ],
  });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect(); // ❗ 拼字錯誤修正：$disconnet → $disconnect
  });
