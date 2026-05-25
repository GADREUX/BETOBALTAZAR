# Beto Baltazar Corretor — Web App

Sistema completo de gestão imobiliária para o corretor Beto Baltazar (Capão Bonito/SP).
Inclui site público para captação de imóveis e painel administrativo completo.

**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Supabase (PostgreSQL + Auth + Storage) · EmailJS

---

## 📦 O que está pronto (Fase 1)

### ✅ Site público (sem necessidade de login)
- **Homepage** com hero editorial, destaques e CTA de cadastro
- **Listagem de imóveis** com filtros (finalidade, tipo, busca)
- **Página de detalhe** estilo Airbnb com galeria de fotos
- **Página "Anuncie seu Imóvel"** — formulário que envia o cadastro direto para o painel + email automático para o Beto
- **Páginas Sobre e Contato**

### ✅ Painel administrativo (1 usuário — só o Beto)
- **Login** com Supabase Auth
- **Dashboard** com KPIs (imóveis, contratos, receita, boletos, leads, carteira), funil de vendas e atalho de submissões
- **Gestão de Imóveis** completa:
  - Listagem com busca/filtros, ações rápidas (ver, compartilhar, editar, excluir)
  - Formulário de cadastro/edição com upload de fotos (drag & drop, reorder)
  - **Trigger de banco impede passar de 50 imóveis cadastrados**
- **Inbox de Solicitações** do site público com botão "Converter em Lead"
- **WhatsApp Templates** para compartilhar imóveis, cobranças e follow-ups
- **PIX BR Code** gerador (padrão Bacen, sem precisar de conta integrada)

### 🚧 Em desenvolvimento (Fase 2)
Páginas placeholder já criadas para:
- Proprietários e Inquilinos (CRUD)
- Contratos de Locação com PDF
- Boletos PIX com QR Code
- CRM Kanban
- Vistorias com wizard
- Portais (status de sincronização)
- Relatórios com gráficos

---

## 🚀 Como rodar localmente

### 1. Pré-requisitos
- Node.js 18+ instalado
- Conta no [Supabase](https://supabase.com) (gratuita)
- Conta no [EmailJS](https://www.emailjs.com) (gratuita — opcional, para notificações)

### 2. Instalação

```bash
# Extraia o ZIP, entre na pasta
cd beto-baltazar

# Instale as dependências
npm install

# Copie o template de variáveis de ambiente
cp .env.local.example .env.local
```

### 3. Configurar o Supabase

#### 3.1. Criar projeto

1. Acesse https://app.supabase.com e crie um novo projeto
2. Escolha região "South America (São Paulo)" para menor latência
3. Anote a senha do banco — você vai precisar

#### 3.2. Executar o SQL schema

1. No painel do Supabase, vá em **SQL Editor** → **New query**
2. Abra o arquivo `supabase/schema.sql` deste projeto
3. Cole TODO o conteúdo no editor e clique em **Run**
4. Verifique se criou as 11 tabelas em **Table Editor**

#### 3.3. Criar o usuário admin (Beto)

1. Vá em **Authentication** → **Users** → **Add user** → **Create new user**
2. Email: `betobaltazar@gmail.com` (ou outro de preferência)
3. Senha: defina uma segura
4. Marque "Auto Confirm User" para evitar verificação por email
5. Clique em **Create user**

#### 3.4. Pegar as chaves de API

1. Vá em **Settings** → **API**
2. Copie:
   - **Project URL** → vai em `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → vai em `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** (secret) → vai em `SUPABASE_SERVICE_ROLE_KEY`

3. Cole os valores no seu arquivo `.env.local`

### 4. Configurar o EmailJS (opcional, para receber emails de novas solicitações)

1. Crie conta em https://www.emailjs.com
2. Adicione um **Service** (Gmail/Outlook/etc) conectado ao email do Beto
3. Crie um **Template** com as seguintes variáveis no corpo:
   - `{{from_name}}`, `{{phone}}`, `{{email}}`, `{{property_type}}`, `{{purpose}}`, `{{address}}`, `{{details}}`, `{{type}}`

   **Sugestão de template do email:**
   ```
   Olá Beto!

   Você recebeu uma nova solicitação no site:

   👤 Nome: {{from_name}}
   📞 Telefone: {{phone}}
   📧 Email: {{email}}

   🏠 Tipo: {{property_type}}
   📍 Finalidade: {{purpose}}
   📌 Endereço: {{address}}

   Detalhes:
   {{details}}

   Tipo de solicitação: {{type}}
   ```

4. Copie o **Service ID**, **Template ID** e **Public Key** para o `.env.local`

### 5. Rodar a aplicação

```bash
npm run dev
```

Abra http://localhost:3000

- **Site público:** http://localhost:3000
- **Login admin:** http://localhost:3000/admin/login

---

## 🚢 Deploy

### Opção A: Vercel (recomendado — gratuito)

1. Suba o código para um repositório no GitHub
2. Acesse https://vercel.com e clique em **New Project**
3. Importe o repositório
4. Em **Environment Variables**, adicione TODAS as variáveis do `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_EMAILJS_*`
   - `NEXT_PUBLIC_CORRETOR_*`
   - `NEXT_PUBLIC_PIX_*`
5. Clique em **Deploy**

Sua URL ficará tipo `betobaltazar.vercel.app`. Você pode conectar um domínio próprio em **Settings → Domains**.

### Opção B: Hostinger VPS

1. Acesse seu VPS via SSH
2. Instale Node.js 20:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```
3. Clone o repositório
4. Configure o `.env.local` no servidor
5. Build e start:
   ```bash
   npm install
   npm run build
   npm start
   ```
6. Use PM2 para manter rodando:
   ```bash
   npm install -g pm2
   pm2 start npm --name "betobaltazar" -- start
   pm2 save
   pm2 startup
   ```
7. Configure nginx como proxy reverso apontando para `localhost:3000`

---

## 🛠 Estrutura do projeto

```
beto-baltazar/
├── supabase/
│   └── schema.sql              ← Schema completo do banco (rodar 1x)
├── src/
│   ├── app/
│   │   ├── (public)/           ← Site público
│   │   │   ├── page.tsx        ← Homepage
│   │   │   ├── imoveis/        ← Listagem e detalhes
│   │   │   ├── anuncie/        ← Form de cadastro de imóvel
│   │   │   ├── sobre/
│   │   │   └── contato/
│   │   └── admin/              ← Painel (auth obrigatório)
│   │       ├── login/
│   │       ├── page.tsx        ← Dashboard
│   │       ├── imoveis/        ← CRUD completo
│   │       └── submissoes/     ← Inbox de leads do site
│   ├── components/
│   │   ├── photo-uploader.tsx
│   │   ├── property-form.tsx
│   │   └── coming-soon.tsx
│   ├── lib/
│   │   ├── supabase/{client,server}.ts
│   │   ├── pix.ts              ← Gerador PIX BR Code
│   │   ├── whatsapp.ts         ← Templates de mensagem
│   │   └── utils.ts
│   ├── types/database.ts
│   └── middleware.ts           ← Proteção das rotas /admin
└── .env.local                  ← Suas chaves (NÃO commitar)
```

---

## 🔑 Variáveis de ambiente

Veja `.env.local.example` — todas as variáveis estão documentadas lá.

**Importante:** o arquivo `.env.local` NUNCA vai pro Git (já está no `.gitignore`).

---

## 📱 Funcionalidades chave já funcionando

1. **Cliente acessa o site** → vê os imóveis publicados → preenche formulário em /anuncie
2. **Formulário salva no Supabase** + envia email para o Beto via EmailJS
3. **Beto faz login no /admin** → vê alerta de nova solicitação no Dashboard
4. **Abre a inbox** → vê os detalhes → pode contatar via WhatsApp com mensagem pronta
5. **Converte a solicitação em Lead** com 1 clique → entra no CRM (Fase 2)
6. **Para cada imóvel**: upload de fotos com drag/drop, marcar como destaque, publicar/despublicar
7. **Compartilhar imóvel via WhatsApp** com mensagem formatada incluindo todos os dados

---

## 🐛 Solução de problemas

### "Erro ao carregar imóveis" no site
- Verifique se rodou o `schema.sql` no Supabase
- Confira se `NEXT_PUBLIC_SUPABASE_URL` está correto

### Não consigo fazer login no admin
- Verifique se criou o usuário em **Authentication → Users**
- Confirme que o usuário está marcado como "Confirmed"

### Upload de fotos não funciona
- Verifique se os buckets `property-photos`, `inspection-photos`, etc foram criados (o schema já cria automaticamente)
- Em **Storage → Policies**, confirme que as policies foram criadas

### EmailJS não envia
- A app funciona MESMO se o EmailJS falhar (não é crítico)
- Configure as 3 variáveis do EmailJS no `.env.local` e refaça o deploy

---

## 📈 Próximos passos (Fase 2)

Próximos módulos a desenvolver:
1. Cadastro de Proprietários e Inquilinos
2. Geração de Contratos em PDF
3. Boletos PIX com QR Code
4. CRM Kanban com drag & drop
5. Wizard de Vistorias
6. Relatórios com gráficos

---

## 👤 Cliente

**Beto Baltazar** — Corretor de Imóveis
- CRECI 318284-F
- WhatsApp: (15) 99689-7738
- Email: betobaltazar@gmail.com
- Endereço: Rua Bernardino de Campos, 736 - Centro, Capão Bonito/SP
