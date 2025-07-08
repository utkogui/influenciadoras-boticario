import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seed() {
  try {
    // Criar tags iniciais
    const tags = [
      { name: 'Beleza', color: '#ec4899' },
      { name: 'Lifestyle', color: '#8b5cf6' },
      { name: 'Moda', color: '#06b6d4' },
      { name: 'Fitness', color: '#10b981' },
      { name: 'Culinária', color: '#f59e0b' },
      { name: 'Viagem', color: '#ef4444' },
      { name: 'Tecnologia', color: '#f97316' },
      { name: 'Maternidade', color: '#84cc16' },
      { name: 'Negócios', color: '#06b6d4' },
      { name: 'Educação', color: '#8b5cf6' }
    ]

    for (const tag of tags) {
      await prisma.tag.upsert({
        where: { name: tag.name },
        update: {},
        create: tag
      })
    }

    console.log('✅ Tags criadas com sucesso!')
  } catch (error) {
    console.error('❌ Erro ao criar tags:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seed() 