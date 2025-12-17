# 🌟 Acompanhantes VIP - Web App de Anúncios

Uma plataforma moderna e responsiva para anúncios de acompanhantes, construída com as melhores tecnologias do mercado. Sistema completo com painel administrativo intuitivo e experiência otimizada para usuários.

## ✨ Funcionalidades

### 👤 Área do Usuário
- **Seleção de Cidade** - Interface intuitiva para escolher localização
- **Exibição Responsiva** - Layout adaptativo para mobile e desktop
- **Sistema de Destaques** - Anúncios em destaque com visual diferenciado
- **Avaliação por Estrelas** - Sistema de classificação visual
- **Contato Direto** - Integração com WhatsApp e telefone
- **Filtros Inteligentes** - Visualização por cidade e status

### 🛠️ Painel Administrativo
- **Autenticação Segura** - Login protegido com JWT
- **Gerenciamento de Anúncios** - Criar, editar, pausar e excluir
- **Controle de Cidades** - Adicionar e gerenciar localidades
- **Configurações do Site** - Personalizar cores e informações
- **Dashboard Analítico** - Estatísticas em tempo real
- **Interface Intuitiva** - Design moderno e fácil de usar

## 🚀 Tecnologias Utilizadas

### Framework Frontend
- **⚡ Next.js 15** - Framework React com App Router
- **📘 TypeScript 5** - Tipagem segura e melhor DX
- **🎨 Tailwind CSS 4** - CSS utility-first para design rápido
- **🧩 shadcn/ui** - Componentes acessíveis e modernos

### Backend & Database
- **🗄️ Prisma ORM** - TypeScript ORM para banco de dados
- **💾 SQLite** - Banco de dados leve e performático
- **🔐 JWT Authentication** - Autenticação stateless segura
- **🌐 REST APIs** - API RESTful bem estruturada

### UI/UX Features
- **📱 Mobile-First** - Design responsivo prioritário
- **🌈 Temas** - Suporte a dark/light mode
- **✨ Animações** - Micro-interações suaves com Framer Motion
- **🎯 Componentes** - Biblioteca completa de UI components

## 📱 Layout Responsivo

### Mobile (📱)
- 1 anúncio em destaque na primeira linha
- Grid 2x2 para anúncios normais (4 por página)
- Navegação otimizada para toque

### Desktop (🖥️)
- 2 anúncios em destaque na primeira linha  
- Grid 6xN para anúncios normais (6 por linha)
- Interface otimizada para mouse

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js 18+ ou Bun
- Git

### Passo 1: Clonar o Projeto
```bash
git clone <seu-repositorio>
cd acompanhantes-vip
```

### Passo 2: Instalar Dependências
```bash
bun install
# ou
npm install
```

### Passo 3: Configurar Variáveis de Ambiente
Crie o arquivo `.env.local`:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="seu-secret-aqui-muito-seguro"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Passo 4: Configurar Banco de Dados
```bash
# Aplicar schema do Prisma
bun run db:push

# Popular com dados de exemplo
bun run seed.ts
```

### Passo 5: Iniciar Servidor de Desenvolvimento
```bash
bun run dev
```

Acesse [http://localhost:3000](http://localhost:3000) para ver o aplicativo.

## 🔐 Acesso Administrativo

### Login Demo
- **URL**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **Email**: `admin@acompanhantes.com`
- **Senha**: `admin123`

### Funcionalidades do Admin
- Dashboard com estatísticas em tempo real
- Gerenciamento completo de anúncios
- Controle de cidades ativas
- Configurações do site
- Visualização de dados analíticos

## 📁 Estrutura do Projeto

```
src/
├── app/                    # Páginas Next.js App Router
│   ├── admin/             # Área administrativa
│   │   ├── page.tsx       # Login do admin
│   │   └── dashboard/     # Dashboard principal
│   ├── api/               # APIs REST
│   │   ├── admin/         # APIs admin protegidas
│   │   ├── anuncios/      # APIs de anúncios
│   │   └── cidades/       # APIs de cidades
│   ├── globals.css        # Estilos globais
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Home pública
├── components/            # Componentes React
│   ├── home-page.tsx      # Página principal
│   └── ui/               # Componentes shadcn/ui
├── hooks/                # Hooks personalizados
├── lib/                  # Utilitários
│   ├── db.ts             # Cliente Prisma
│   └── utils.ts          # Funções auxiliares
└── types/                # Tipos TypeScript

prisma/
├── schema.prisma         # Schema do banco
└── migrations/          # Migrações do DB

public/                  # Arquivos estáticos
└── images/             # Imagens e uploads
```

## 🎨 Personalização

### Cores do Site
As cores podem ser configuradas pelo painel admin:
- **Cor Primária** - Elementos principais e CTAs
- **Cor Secundária** - Elementos secundários  
- **Cor de Destaque** - Anúncios em destaque

### Tema
- Suporte completo a dark/light mode
- Cores adaptativas baseadas no tema
- Transições suaves entre temas

## 🚀 Deploy na Vercel

### Passo 1: Preparar para Deploy
```bash
# Build para produção
bun run build

# Testar build localmente
bun run start
```

### Passo 2: Configurar Vercel
1. Conecte seu repositório no Vercel
2. Configure as variáveis de ambiente:
   - `DATABASE_URL` (para PostgreSQL em produção)
   - `JWT_SECRET`
   - `NEXT_PUBLIC_APP_URL`

### Passo 3: Deploy Automático
- Push para `main` → Deploy automático
- Preview deployments para cada PR
- Deploy contínuo integrado

### Variáveis de Ambiente na Vercel
```env
DATABASE_URL="postgresql://user:pass@host:5432/dbname"
JWT_SECRET="seu-secret-producao"
NEXT_PUBLIC_APP_URL="https://seu-dominio.vercel.app"
```

## 📊 Recursos Avançados

### Performance
- **Image Optimization** - Otimização automática de imagens
- **Code Splitting** - Divisão inteligente de código
- **Lazy Loading** - Carregamento sob demanda
- **Cache Strategy** - Cache inteligente de APIs

### SEO
- **Meta Tags** - Otimização para buscadores
- **Structured Data** - Dados estruturados
- **Sitemap** - Mapa do site automático
- **Open Graph** - Compartilhamento social

### Segurança
- **JWT Authentication** - Tokens seguros e expiráveis
- **Input Validation** - Validação de dados com Zod
- **SQL Injection Protection** - Proteção via Prisma
- **XSS Protection** - Sanitização automática

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
bun run dev          # Servidor de desenvolvimento
bun run lint         # Análise de código ESLint

# Banco de Dados
bun run db:push      # Aplicar schema sem migração
bun run db:studio    # Interface visual do Prisma
bun run seed.ts      # Popular dados de exemplo

# Produção
bun run build        # Build otimizado
bun run start        # Servidor produção
bun run analyze      # Análise de bundle
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Add nova funcionalidade'`)
4. Push para o branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🆘 Suporte

- **Issues** - Reporte bugs e sugira melhorias
- **Discussions** - Tire dúvidas e compartilhe ideias
- **Email** - contato@seu-dominio.com

---

🚀 **Desenvolvido com as melhores práticas e tecnologias modernas**  
💜 **Construído para ser escalável, seguro e de fácil manutenção**
