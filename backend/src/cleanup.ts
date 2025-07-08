import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanup() {
  try {
    console.log('🧹 Iniciando limpeza do banco de dados...')
    
    // Listar todas as influenciadoras
    const allInfluencers = await prisma.influencer.findMany({
      select: {
        id: true,
        username: true,
        fullName: true
      }
    })
    
    console.log('📋 Influenciadoras encontradas:')
    allInfluencers.forEach(inf => {
      console.log(`- ${inf.username} (${inf.fullName})`)
    })
    
    // Deletar mariamaria e bianca
    const usernamesToDelete = ['mariamaria', 'bianca']
    
    for (const username of usernamesToDelete) {
      const influencer = await prisma.influencer.findUnique({
        where: { username }
      })
      
      if (influencer) {
        await prisma.influencer.delete({
          where: { username }
        })
        console.log(`✅ Deletada: ${username}`)
      } else {
        console.log(`⚠️  Não encontrada: ${username}`)
      }
    }
    
    // Listar influenciadoras restantes
    const remainingInfluencers = await prisma.influencer.findMany({
      select: {
        id: true,
        username: true,
        fullName: true
      }
    })
    
    console.log('\n📋 Influenciadoras restantes:')
    remainingInfluencers.forEach(inf => {
      console.log(`- ${inf.username} (${inf.fullName})`)
    })
    
    console.log('\n✅ Limpeza concluída!')
  } catch (error) {
    console.error('❌ Erro durante a limpeza:', error)
  } finally {
    await prisma.$disconnect()
  }
}

cleanup() 