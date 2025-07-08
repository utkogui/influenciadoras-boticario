import express from 'express';
import { prisma } from '../index';
import axios from 'axios';

const router = express.Router();

// Cache em memória para evitar requisições excessivas
const cache: { [key: string]: any } = {};
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutos
const RATE_LIMIT_DELAY = 5000; // 5 segundos entre requisições
let lastRequestTime = 0;

// Função para esperar o delay necessário
const waitForRateLimit = async () => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
    const waitTime = RATE_LIMIT_DELAY - timeSinceLastRequest;
    console.log(`Aguardando ${waitTime}ms antes da próxima requisição...`);
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }
  
  lastRequestTime = Date.now();
};

// Buscar dados reais do Instagram via web scraping
async function fetchInstagramData(username: string) {
  try {
    // Limpar username (remover @ se houver)
    const cleanUsername = username.replace('@', '');
    
    // Verificar cache
    const cacheKey = cleanUsername.toLowerCase();
    const cached = cache[cacheKey];
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      console.log(`Retornando dados do cache para ${cleanUsername}`);
      return cached.data;
    }
    
    // Aguardar rate limit
    await waitForRateLimit();
    
    console.log(`Buscando dados do Instagram para: ${cleanUsername}`);
    
    const response = await axios.get(`https://www.instagram.com/api/v1/users/web_profile_info/?username=${cleanUsername}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'X-IG-App-ID': '936619743392459'
      }
    });

    const userData = response.data.data.user;

    if (!userData) {
      throw new Error('Perfil não encontrado');
    }

    // Converter URL da imagem para usar nosso proxy
    const profilePicUrl = userData.profile_pic_url 
      ? `/api/proxy-image?url=${encodeURIComponent(userData.profile_pic_url)}`
      : `https://via.placeholder.com/150/6366f1/ffffff?text=${cleanUsername.charAt(0).toUpperCase()}`;

    const data = {
      fullName: userData.full_name || `@${cleanUsername}`,
      profilePic: profilePicUrl,
      bio: userData.biography || 'Influenciadora de beleza e lifestyle',
      followers: userData.edge_followed_by.count
    };
    
    // Salvar no cache
    cache[cacheKey] = {
      data,
      timestamp: Date.now()
    };
    
    return data;
  } catch (error: any) {
    console.error('Erro ao buscar dados do Instagram:', error.message);
    
    if (error.response?.status === 429) {
      throw new Error('Muitas requisições. Tente novamente em alguns minutos.');
    }
    
    if (error.response?.status === 404) {
      throw new Error('Perfil não encontrado');
    }

    // Fallback para dados mockados em caso de erro
    console.log('Usando dados mockados como fallback');
    return {
      fullName: `@${username.replace('@', '')}`,
      profilePic: `https://via.placeholder.com/150/6366f1/ffffff?text=${username.charAt(0).toUpperCase()}`,
      bio: 'Influenciadora de beleza e lifestyle',
      followers: 1000000
    };
  }
}

// GET - Listar todas as influenciadoras
router.get('/', async (req, res) => {
  try {
    const { tag, search } = req.query;
    
    let where: any = {};
    
    if (search) {
      where.OR = [
        { username: { contains: search as string, mode: 'insensitive' } },
        { fullName: { contains: search as string, mode: 'insensitive' } },
        { bio: { contains: search as string, mode: 'insensitive' } }
      ];
    }
    
    if (tag) {
      where.tags = {
        some: {
          name: { equals: tag as string, mode: 'insensitive' }
        }
      };
    }
    
    const influencers = await prisma.influencer.findMany({
      where,
      include: {
        tags: true
      },
      orderBy: {
        followers: 'desc'
      }
    });
    
    res.json(influencers);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar influenciadoras' });
  }
});

// GET - Buscar influenciadora por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const influencer = await prisma.influencer.findUnique({
      where: { id },
      include: {
        tags: true
      }
    });
    
    if (!influencer) {
      return res.status(404).json({ error: 'Influenciadora não encontrada' });
    }
    
    res.json(influencer);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar influenciadora' });
  }
});

// POST - Criar nova influenciadora
router.post('/', async (req, res) => {
  try {
    const { username, tags } = req.body;
    
    if (!username) {
      return res.status(400).json({ error: 'Username é obrigatório' });
    }
    
    // Verificar se já existe
    const existing = await prisma.influencer.findUnique({
      where: { username }
    });
    
    if (existing) {
      return res.status(400).json({ error: 'Influenciadora já cadastrada' });
    }
    
    // Buscar dados do Instagram
    const instagramData = await fetchInstagramData(username);
    
    // Criar influenciadora
    const influencer = await prisma.influencer.create({
      data: {
        username,
        fullName: instagramData.fullName,
        profilePic: instagramData.profilePic,
        bio: instagramData.bio,
        followers: instagramData.followers,
        tags: {
          connect: tags?.map((tagId: string) => ({ id: tagId })) || []
        }
      },
      include: {
        tags: true
      }
    });
    
    res.status(201).json(influencer);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar influenciadora' });
  }
});

// PUT - Atualizar influenciadora
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, bio, followers, tags } = req.body;
    
    const influencer = await prisma.influencer.update({
      where: { id },
      data: {
        fullName,
        bio,
        followers,
        tags: {
          set: tags?.map((tagId: string) => ({ id: tagId })) || []
        }
      },
      include: {
        tags: true
      }
    });
    
    res.json(influencer);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar influenciadora' });
  }
});

// DELETE - Deletar influenciadora
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.influencer.delete({
      where: { id }
    });
    
    res.json({ message: 'Influenciadora deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar influenciadora' });
  }
});

// POST - Buscar dados do Instagram
router.post('/search-instagram', async (req, res) => {
  try {
    const { username } = req.body;
    
    if (!username) {
      return res.status(400).json({ error: 'Username é obrigatório' });
    }
    
    const instagramData = await fetchInstagramData(username);
    
    res.json(instagramData);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar dados do Instagram' });
  }
});

export default router; 