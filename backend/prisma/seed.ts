import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Criar algumas influenciadoras de teste
  const influencers = [
    {
      username: "marimaria",
      fullName: "Mari Maria",
      profilePic: "https://instagram.fbfh23-1.fna.fbcdn.net/v/t51.2885-19/499882859_18517038829063592_2049782773428799746_n.jpg",
      bio: "Beauty and Makeup - Founder @marimariamakeup & @marimariahair",
      followers: 21921591
    },
    {
      username: "bianca",
      fullName: "BIANCA BOCA ROSA",
      profilePic: "https://instagram.fbfh23-1.fna.fbcdn.net/v/t51.2885-19/503612411_18529743355037643_3423264034589024763_n.jpg",
      bio: "COMPRE O STICK COR",
      followers: 19464929
    }
  ];

  for (const influencer of influencers) {
    await prisma.influencer.upsert({
      where: { username: influencer.username },
      update: influencer,
      create: influencer
    });
  }

  console.log("Dados de seed inseridos com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
