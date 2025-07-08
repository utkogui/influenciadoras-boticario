import express from 'express';
import { prisma } from '../index';

const router = express.Router();

// GET - Listar todas as tags
router.get('/', async (req: express.Request, res: express.Response) => {
  try {
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: {
            influencers: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });
    
    res.json(tags);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar tags' });
  }
});

// GET - Buscar tag por ID
router.get('/:id', async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    
    const tag = await prisma.tag.findUnique({
      where: { id },
      include: {
        influencers: true
      }
    });
    
    if (!tag) {
      return res.status(404).json({ error: 'Tag não encontrada' });
    }
    
    res.json(tag);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar tag' });
  }
});

// POST - Criar nova tag
router.post('/', async (req: express.Request, res: express.Response) => {
  try {
    const { name, color } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Nome da tag é obrigatório' });
    }
    
    // Verificar se já existe
    const existing = await prisma.tag.findUnique({
      where: { name }
    });
    
    if (existing) {
      return res.status(400).json({ error: 'Tag já existe' });
    }
    
    const tag = await prisma.tag.create({
      data: {
        name,
        color: color || '#6366f1'
      }
    });
    
    res.status(201).json(tag);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar tag' });
  }
});

// PUT - Atualizar tag
router.put('/:id', async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const { name, color } = req.body;
    
    const tag = await prisma.tag.update({
      where: { id },
      data: {
        name,
        color
      }
    });
    
    res.json(tag);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar tag' });
  }
});

// DELETE - Deletar tag
router.delete('/:id', async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    
    await prisma.tag.delete({
      where: { id }
    });
    
    res.json({ message: 'Tag deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar tag' });
  }
});

export default router; 