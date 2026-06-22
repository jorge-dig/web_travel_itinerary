import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminEmail = process.env.ADMIN_EMAIL || "admin@wayroute.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123456";

  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existing) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: "Admin",
        passwordHash,
        role: "ADMIN",
      },
    });
    console.log(`Admin user created: ${adminEmail}`);
  }

  // Set default EUR→USD exchange rate
  await prisma.exchangeRate.upsert({
    where: { fromCurrency_toCurrency: { fromCurrency: "EUR", toCurrency: "USD" } },
    update: {},
    create: { fromCurrency: "EUR", toCurrency: "USD", rate: 1.08 },
  });

  console.log("Seed completed.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
