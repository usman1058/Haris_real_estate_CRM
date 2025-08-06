import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("test1234", 10);

  await prisma.user.upsert({
    where: { email: "admin@crm.com" },
    update: {},
    create: {
      email: "admin@crm.com",
      password: hashedPassword,
      name: "CRM Admin",
    },
  });

  console.log("✅ User seeded");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
