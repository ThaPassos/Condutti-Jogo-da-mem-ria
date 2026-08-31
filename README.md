<div align="center">

<img src="./src/assets/logoCondutti.png" alt="Condutti Cabos Especiais" width="260"/>

# 🎴 Jogo da Memória — Condutti

**Um jogo da memória interativo, feito em React + TypeScript, criado para ativações de estande e feiras (Exposec 2026) da Condutti Cabos Especiais.**

[![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Netlify](https://img.shields.io/badge/Netlify-Functions-00C7B7?logo=netlify&logoColor=white)](https://www.netlify.com/)

</div>

---

## 📖 Sobre o projeto

Este é um **jogo da memória gamificado** desenvolvido para rodar em totens/tablets durante eventos e feiras da **Condutti Cabos Especiais**. O visitante memoriza a posição das cartas, tenta encontrar todos os pares dentro do tempo limite e, ao vencer, gira uma **roleta de brindes** — tudo isso enquanto o jogo mostra e disputa um **recorde global**, guardado em um banco de dados na nuvem.

O fluxo foi pensado para uso contínuo em estande: reinício automático das telas de vitória/derrota, QR Code de cadastro na tela inicial e efeitos sonoros/visuais para chamar atenção do público.

---

## ✨ Funcionalidades

- 🧠 **Jogo da memória com 8 pares de cartas** (16 cartas no total), embaralhadas a cada partida
- 👀 **Preview de 3 segundos**: todas as cartas viram para o jogador memorizar antes do cronômetro começar
- ⏱️ **Cronômetro regressivo de 45 segundos**, com aviso sonoro nos últimos 10s
- 🏆 **Recorde global** salvo em banco de dados (Neon/PostgreSQL via Netlify Functions), com fallback automático em `localStorage` caso a API esteja indisponível (modo offline/totem)
- 🎡 **Roleta de brindes** sorteável na tela de vitória (Boné, Caneta, Ecobag)
- 🎉 Tela de vitória com confete e comparação com o recorde global
- 😢 Tela de derrota com resumo de pares encontrados e tempo jogado
- 🔊 Efeitos sonoros (clique, virar carta, acerto, erro, tique-taque, vitória, tempo esgotado) com botão para mutar
- 📱 Layout **responsivo**, pensado tanto para celular quanto para telas de totem
- 🔁 Redirecionamento automático para a tela inicial após vitória/derrota (ideal para uso contínuo sem supervisão)
- 📸 QR Code de cadastro na tela inicial, direcionando para a landing page do evento

---

## 🕹️ Como jogar

1. Na tela inicial, toque em **JOGAR**
2. Leia o aviso e toque em **COMEÇAR**
3. Memorize a posição das 16 cartas durante os **3 segundos** de preview
4. Encontre todos os **8 pares** antes que os **45 segundos** acabem
5. Ao vencer, veja seu tempo, o recorde global e gire a **roleta de brindes**
6. Se o tempo acabar antes de encontrar todos os pares, tente novamente!

---

## 🛠️ Tecnologias utilizadas

| Categoria | Tecnologia |
|---|---|
| Front-end | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| Build tool | [Vite 8](https://vitejs.dev/) |
| Estilização | [Tailwind CSS](https://tailwindcss.com/) |
| Roteamento | [React Router DOM](https://reactrouter.com/) (`HashRouter`) |
| Ícones | [lucide-react](https://lucide.dev/) |
| Backend serverless | [Netlify Functions](https://www.netlify.com/platform/core/functions/) |
| Banco de dados | [Neon (PostgreSQL serverless)](https://neon.tech/) via `@neondatabase/serverless` |
| Lint | ESLint + typescript-eslint |

---

## 📂 Estrutura do projeto

```
Condutti-Jogo-da-mem-ria/
├── netlify/
│   └── functions/
│       └── record.ts        # API de recorde global (GET/POST) usando Neon
├── public/                  # Favicon e ícones estáticos
├── src/
│   ├── assets/               # Imagens das cartas, logo e QR Code
│   ├── components/
│   │   ├── BotaoSom.tsx       # Botão de mutar/desmutar sons
│   │   ├── Cartas.tsx         # Componente de carta (frente/verso, flip)
│   │   ├── Confetes.tsx       # Animação de confete na vitória
│   │   ├── LinhasAnimadas.tsx # Linhas animadas de fundo
│   │   └── Roleta.tsx         # Roleta de brindes (canvas)
│   ├── hooks/                # Hooks customizados
│   ├── lib/
│   │   ├── api.ts             # Comunicação com a function de recorde
│   │   ├── record.ts          # Formatação de tempo e regras de recorde
│   │   ├── sounds.ts          # Gerenciamento dos efeitos sonoros
│   │   └── utils.ts
│   ├── pages/
│   │   ├── Home.tsx           # Tela inicial
│   │   ├── Game.tsx           # Tela do jogo (lógica principal)
│   │   ├── Vitoria.tsx        # Tela de vitória
│   │   └── Derrota.tsx        # Tela de derrota (tempo esgotado)
│   ├── App.tsx                # Rotas da aplicação
│   └── main.tsx                # Ponto de entrada
├── package.json
└── vite.config.ts
```

---

## 🚀 Como rodar localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior
- npm (ou yarn/pnpm, se preferir adaptar os comandos)

### Passo a passo

```bash
# 1. Clone o repositório
git clone https://github.com/ThaPassos/Condutti-Jogo-da-mem-ria.git
cd Condutti-Jogo-da-mem-ria

# 2. Instale as dependências
npm install

# 3. Rode o projeto em modo desenvolvimento
npm run dev
```

O jogo abrirá em `http://localhost:5173` (porta padrão do Vite).

> 💡 Sem configurar o banco de dados, o recorde global simplesmente cai para o modo **offline**, salvando o melhor tempo no `localStorage` do navegador — o jogo continua 100% jogável.

### Outros scripts disponíveis

```bash
npm run build     # Gera a build de produção (tsc + vite build)
npm run preview   # Serve a build de produção localmente
npm run lint      # Roda o ESLint no projeto
```

---

## 🌐 Recorde global (backend)

O recorde global é gerenciado pela function `netlify/functions/record.ts`, que:

- **GET** `/.netlify/functions/record` → retorna o melhor tempo já registrado
- **POST** `/.netlify/functions/record` → salva um novo tempo e retorna o melhor tempo atualizado

Para usar essa funcionalidade, é necessário configurar a variável de ambiente abaixo (ex: no painel da Netlify ou em um arquivo `.env` local usando `netlify dev`):

```
DATABASE_URL=postgres://usuario:senha@host/banco
```

O banco precisa ter uma tabela `records` com, no mínimo, a coluna `time_seconds` (inteiro).

```sql
CREATE TABLE records (
  id SERIAL PRIMARY KEY,
  time_seconds INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);
```

---

## ☁️ Deploy

O projeto está preparado para deploy direto na [Netlify](https://www.netlify.com/), aproveitando as **Netlify Functions** para a API de recorde:

1. Conecte o repositório à Netlify
2. Configure o comando de build: `npm run build`
3. Configure o diretório de publicação: `dist`
4. Adicione a variável de ambiente `DATABASE_URL` com a connection string do Neon
5. Publique 🚀

---

## 📄 Licença

Este projeto foi desenvolvido para uso interno/institucional da **Condutti Cabos Especiais** em ações de marketing e eventos.

---

<div align="center">

Feito com 💙 para a **Condutti Cabos Especiais**

</div>
