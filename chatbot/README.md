# SolverIA Chatbot — AI Sales Agent (produto vendável)

Chatbot de IA **embutível** e **multi-cliente**, powered by Claude. Você hospeda **um** servidor e atende **vários clientes**; cada cliente coloca uma linha de `<script>` no site dele e ganha um agente de vendas 24/7.

> ⚠️ Projeto **independente** do site da SolverIA. Não faz parte do build da landing page (Next.js) e é hospedado como um serviço separado.

## Como funciona

```
Cliente cola no site dele:
  <script src="https://SEU-HOST/widget.js" data-client="studio-fitpro" defer></script>
        │
        ▼
  widget.js  →  seu servidor Node  →  Claude (Anthropic)
  (bolha de chat)   (Express)          (respostas de venda)
```

- **`server.js`** — API Express: serve o widget e faz o streaming das respostas do Claude.
- **`clients/*.json`** — 1 arquivo por cliente (nome, cores, produtos, preços, WhatsApp, tom de voz).
- **`public/widget.js`** — o widget de chat (vanilla JS, sem dependências) que o cliente embute.

## Rodar localmente

```bash
cd chatbot
npm install
cp .env.example .env      # e coloque sua ANTHROPIC_API_KEY
npm run dev
```

Abra **http://localhost:8787/demo.html** — a bolha de chat aparece no canto. (Sem a `ANTHROPIC_API_KEY` o servidor sobe, mas o chat não responde.)

## Adicionar um novo cliente (é assim que você vende)

1. Duplique `clients/demo.json` para `clients/nome-do-cliente.json`.
2. Edite `id`, `name`, cores, `whatsapp`, `quickReplies` e principalmente **`systemPrompt`** (produtos, preços, horários, políticas, tom de voz).
3. Reinicie o servidor.
4. Entregue ao cliente o snippet:
   ```html
   <script src="https://SEU-HOST/widget.js" data-client="nome-do-cliente" defer></script>
   ```

O `systemPrompt` é o "cérebro" do agente — quanto melhor a descrição do negócio, melhor ele vende.

## Escolha do modelo (custo)

Por padrão usa **`claude-opus-4-8`** (o mais capaz). Para um chatbot de alto volume, dá pra baixar o custo por cliente no campo `"model"` do JSON:

| Modelo | Preço (entrada / saída por 1M tokens) | Quando usar |
|---|---|---|
| `claude-opus-4-8` | $5 / $25 | Máxima qualidade |
| `claude-sonnet-5` | $3 / $15 | Ótimo equilíbrio |
| `claude-haiku-4-5` | $1 / $5 | Mais barato, ideal p/ volume |

Uma conversa típica de vendas custa **centavos**. Comece no Opus e teste o Haiku 4.5 se quiser reduzir custo.

## Deploy (Render — Web Service Node, separado do site)

Crie um **novo** Web Service no Render apontando para este repositório:

| Campo | Valor |
|---|---|
| **Root Directory** | `chatbot` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Environment Variable** | `ANTHROPIC_API_KEY` = sua chave |

Depois, o `src` do widget vira a URL desse serviço (ex.: `https://solveria-chatbot.onrender.com/widget.js`).

## Segurança / produção (próximos passos)

- Restringir CORS por domínio do cliente (hoje aceita qualquer origem).
- Rate limiting por IP/cliente.
- Persistir conversas e leads (banco de dados) para o CRM.
- Handoff real para humano / WhatsApp Business API.
