import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.Udemy.create(){
data:{
    id:id,
name:"合作金庫",
saving:"0",
  };
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnet();
  });
