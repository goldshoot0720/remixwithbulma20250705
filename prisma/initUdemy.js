import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const prisma = new PrismaClient().$extends(withAccelerate());

async function main() {
  await prisma.udemy.createMany({
    data: [
      {
        course: "Remix v2 complete masterclass - Build Full-stack AI apps",
        teacher: "Soumya Sahu",
        schedule: "57/81",
      },
      {
        course: "Master Bulma CSS framework and code 4 projects with 14 pages",
        teacher: "Jeppe Schaumburg Jensen",
        schedule: "29/172",
      },
    ],
  });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect(); // ❗ 拼字錯誤修正：$disconnet → $disconnect
  });
