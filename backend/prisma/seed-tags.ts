import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const tags = [
    { name: "Beleza", color: "#ec4899" },
    { name: "Cabelo", color: "#f59e0b" },
    { name: "Make", color: "#8b5cf6" },
    { name: "Skincare", color: "#06b6d4" },
    { name: "Estilo", color: "#10b981" },
    { name: "Looks", color: "#ef4444" },
    { name: "Autocuidado", color: "#f97316" },
    { name: "Tendências", color: "#6366f1" }
  ];

  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { name: tag.name },
      update: tag,
      create: tag
    });
  }

  console.log("Tags criadas com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
