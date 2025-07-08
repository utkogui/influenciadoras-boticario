import express from 'express';
import axios from 'axios';

const router = express.Router();

// Proxy para imagens do Instagram (evita problemas de CORS)
router.get('/proxy-image', async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'URL da imagem não fornecida' });
    }

    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Referer': 'https://www.instagram.com/',
      }
    });

    // Retorna a imagem com os headers corretos
    res.set({
      'Content-Type': response.headers['content-type'] || 'image/jpeg',
      'Cache-Control': 'public, max-age=31536000',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
    });

    res.send(response.data);
  } catch (error) {
    console.error('Erro ao fazer proxy da imagem:', error);
    res.status(500).json({ error: 'Erro ao carregar imagem' });
  }
});

export default router; 