import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const adminHash = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@wristwerks.com" },
    update: {},
    create: {
      email: "admin@wristwerks.com",
      passwordHash: adminHash,
      firstName: "Admin",
      lastName: "User",
      role: "ADMIN",
    },
  });
  console.log(`Admin user: ${admin.email} (password: admin123)`);

  // Create sample products
  const sampleProducts = [
    {
      name: "Classic Black Paracord Bracelet",
      description: "Durable 550 paracord bracelet in classic black. Features a side-release buckle and adjustable fit.",
      price: 15.99,
      stock: 25,
      category: "pre-made",
      images: [],
    },
    {
      name: "Camo Green Survival Bracelet",
      description: "Military-style camo paracord bracelet. Unravels to over 10 feet of usable cord in emergencies.",
      price: 18.99,
      stock: 20,
      category: "pre-made",
      images: [],
    },
    {
      name: "Red & Black Cobra Weave",
      description: "Eye-catching red and black cobra weave pattern. Comfortable for everyday wear.",
      price: 22.99,
      stock: 15,
      category: "pre-made",
      images: [],
    },
    {
      name: "OD Green Paracord Lanyard",
      description: "OD green paracord lanyard with carabiner clip. Perfect for keys, tools, or gear.",
      price: 12.99,
      stock: 30,
      category: "pre-made",
      images: [],
    },
    {
      name: "Tiger Stripe Paracord Bracelet",
      description: "Bold tiger stripe pattern in orange and black. Stand out from the crowd.",
      price: 19.99,
      stock: 12,
      category: "pre-made",
      images: [],
    },
    {
      name: "Navy Blue & Gray Survival Bracelet",
      description: "Subtle navy blue and gray combination. Professional look with tactical function.",
      price: 17.99,
      stock: 18,
      category: "pre-made",
      images: [],
    },
  ];

  for (const product of sampleProducts) {
    await prisma.product.upsert({
      where: { id: product.name.toLowerCase().replace(/[^a-z0-9]/g, "-") },
      update: {},
      create: product,
    });
  }
  console.log(`Created ${sampleProducts.length} sample products`);

  // Create custom paracord options reference data (stored as a product category)
  await prisma.product.upsert({
    where: { id: "custom-bracelet-builder" },
    update: {},
    create: {
      id: "custom-bracelet-builder",
      name: "Custom Bracelet",
      description: "Build your own custom paracord bracelet. Choose your colors, weave style, and charms.",
      price: 0,
      stock: 9999,
      category: "custom",
      images: [],
    },
  });
  console.log("Created custom bracelet builder product");

  console.log("Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
