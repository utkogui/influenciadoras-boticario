# Sistema de Influenciadoras - O Boticário

Sistema para gerenciamento de base de dados de influenciadoras com representatividade, desenvolvido para o Grupo O Boticário.

## 🚀 Funcionalidades

- **Cadastro de Influenciadoras**: Busca automática de dados do Instagram
- **Sistema de Tags**: Categorização personalizada de influenciadoras
- **Filtros Inteligentes**: Busca por nome, bio e categorias
- **Interface Elegante**: Design moderno com micro-interações
- **Cache Inteligente**: Evita requisições excessivas à API do Instagram

## 🛠️ Tecnologias

### Backend
- **Node.js** + **Express** + **TypeScript**
- **PostgreSQL** + **Prisma ORM**
- **Axios** para requisições HTTP
- **Helmet** para segurança

### Frontend
- **React** + **TypeScript** + **Vite**
- **Tailwind CSS** para estilização
- **Framer Motion** para animações
- **React Hook Form** para formulários
- **React Hot Toast** para notificações
- **Lucide React** para ícones

## 📦 Instalação

### Pré-requisitos
- Node.js 18+
- PostgreSQL
- npm ou yarn

### 1. Clone o repositório
```bash
git clone <repository-url>
cd influenciadoras_local
```

### 2. Instale as dependências
```bash
npm run install:all
```

### 3. Configure o banco de dados
```bash
# Copie o arquivo de exemplo
cp backend/env.example backend/.env

# Edite as variáveis de ambiente
# DATABASE_URL="postgresql://username:password@localhost:5432/influenciadoras_db"
```

### 4. Configure o banco PostgreSQL
```bash
# Crie o banco de dados
createdb influenciadoras_db

# Execute as migrações
cd backend
npm run db:push
```

### 5. Inicie o desenvolvimento
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 🎨 Paleta de Cores

O projeto utiliza uma paleta inspirada na identidade do Grupo O Boticário:

- **Primary**: Tons de rosa (#ec4899)
- **Secondary**: Tons de azul (#0ea5e9)
- **Accent**: Tons de amarelo (#eab308)

## 📱 Funcionalidades Principais

### Home
- Lista todas as influenciadoras cadastradas
- Filtros por nome e categorias
- Exibição de dados do Instagram
- Layout responsivo com cards elegantes

### Cadastro
- Busca automática de dados do Instagram
- Preenchimento automático de campos
- Seleção de tags/categorias
- Validação de formulários

### Tags
- Criação e edição de categorias
- Seleção de cores personalizadas
- Contagem de influenciadoras por tag
- Interface intuitiva

## 🔧 API Endpoints

### Influenciadoras
- `GET /api/influencers` - Listar todas
- `GET /api/influencers/:id` - Buscar por ID
- `POST /api/influencers` - Criar nova
- `PUT /api/influencers/:id` - Atualizar
- `DELETE /api/influencers/:id` - Deletar
- `POST /api/influencers/search-instagram` - Buscar dados do Instagram

### Tags
- `GET /api/tags` - Listar todas
- `GET /api/tags/:id` - Buscar por ID
- `POST /api/tags` - Criar nova
- `PUT /api/tags/:id` - Atualizar
- `DELETE /api/tags/:id` - Deletar

## 🚀 Deploy

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
# Servir arquivos estáticos
```

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia frontend e backend
npm run dev:frontend     # Apenas frontend
npm run dev:backend      # Apenas backend

# Build
npm run build            # Build completo
npm run build:frontend   # Build frontend
npm run build:backend    # Build backend

# Banco de dados
npm run db:generate      # Gerar cliente Prisma
npm run db:push          # Sincronizar schema
npm run db:migrate       # Executar migrações
npm run db:studio        # Abrir Prisma Studio
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👥 Equipe

Desenvolvido para o **Grupo O Boticário** - Sistema de Base de Dados de Influenciadoras. 