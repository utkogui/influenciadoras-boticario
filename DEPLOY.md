# 🚀 Guia de Deploy - Sistema de Influenciadoras

## Opção 1: Render + Vercel + Supabase (Recomendado)

### 1. Banco de Dados (Supabase)
1. Acesse [supabase.com](https://supabase.com)
2. Crie conta gratuita
3. Crie novo projeto
4. Vá em **Settings > Database**
5. Copie a **Connection string**
6. Execute o SQL do arquivo `database-migration.sql` no **SQL Editor**

### 2. Backend (Render)
1. Acesse [render.com](https://render.com)
2. Crie conta e conecte com GitHub
3. Clique em **New > Web Service**
4. Selecione seu repositório
5. Configure:
   - **Name**: `influenciadoras-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install && npm run build`
   - **Start Command**: `cd backend && npm start`
   - **Root Directory**: deixe vazio

#### Variáveis de Ambiente (Environment Variables):
```
DATABASE_URL=sua_url_do_supabase
PORT=10000
```

### 3. Frontend (Vercel)
1. Acesse [vercel.com](https://vercel.com)
2. Conecte com GitHub
3. Importe o repositório
4. Configure:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

#### Variáveis de Ambiente:
```
NEXT_PUBLIC_API_URL=https://seu-backend.onrender.com
```

## Opção 2: Railway (Mais Simples)

1. Acesse [railway.app](https://railway.app)
2. Conecte com GitHub
3. Clique em **New Project > Deploy from GitHub repo**
4. Selecione seu repositório
5. Adicione as variáveis de ambiente:
   ```
   DATABASE_URL=sua_url_do_supabase
   PORT=3000
   ```

## Opção 3: Vercel (Tudo Junto)

1. Acesse [vercel.com](https://vercel.com)
2. Importe o repositório
3. Configure:
   - **Framework Preset**: `Node.js`
   - **Root Directory**: `.`
   - **Build Command**: `npm run build`
   - **Output Directory**: `frontend/dist`

## 📋 Checklist de Deploy

### Antes do Deploy:
- [ ] Banco de dados configurado (Supabase)
- [ ] Variáveis de ambiente definidas
- [ ] Código testado localmente
- [ ] Repositório no GitHub

### Durante o Deploy:
- [ ] Backend funcionando
- [ ] Frontend conectando com backend
- [ ] Banco de dados acessível
- [ ] Imagens carregando

### Após o Deploy:
- [ ] Testar cadastro de influenciadora
- [ ] Testar busca do Instagram
- [ ] Testar sistema de tags
- [ ] Verificar responsividade

## 🔧 Troubleshooting

### Erro de CORS:
- Verifique se o frontend está usando a URL correta do backend
- Adicione headers CORS no backend

### Erro de Banco:
- Verifique a DATABASE_URL
- Execute as migrações: `npx prisma db push`

### Erro de Build:
- Verifique se todas as dependências estão instaladas
- Verifique se o TypeScript está compilando

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs do deploy
2. Teste localmente primeiro
3. Verifique as variáveis de ambiente
4. Consulte a documentação das plataformas

---

**Recomendação**: Use **Render + Vercel + Supabase** para melhor performance e controle. 