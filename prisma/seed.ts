import { prisma } from "prisma/db";
import { Frodo } from "prisma/seed-data";

async function seedTestData() {
  await prisma.user.create({
    data: {
      firstName: Frodo.firstName,
      lastName: Frodo.lastName,
      username: Frodo.username,
      emailVerified: true,
      email: Frodo.email,
      wishlists: {
        create: {
          id: Frodo.wishlistId,
        },
      },
    },
    include: { wishlists: true },
  });

  await prisma.wish.createMany({
    data: Frodo.wishes,
  });
}

seedTestData()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async error => {
    // eslint-disable-next-line no-console
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
