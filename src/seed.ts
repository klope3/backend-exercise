import { prisma } from "../prisma/db.setup.js";
import { hashPassword } from "./auth-utils.js";

async function clearDb() {
  await prisma.user.deleteMany();
}

async function seed() {
  console.log("Seeding");
  await clearDb();

  const jack = await prisma.user.create({
    data: {
      name: "Jack",
      passwordHash: await hashPassword("password123"),
      age: 24,
      email: "jack@jack.com",
      motto: "I love beanstalks",
    },
  });
  const jill = await prisma.user.create({
    data: {
      name: "Jill",
      passwordHash: await hashPassword("bucketsRock"),
      age: 25,
      email: "jill@jill.com",
      motto: "I love buckets",
    },
  });
}

seed()
  .then(() => console.log("Seeded"))
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
