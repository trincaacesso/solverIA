# Guia de Deploy - solverIA no Render

Este documento explica como fazer o deploy da landing page solverIA no Render.

## Pré-requisitos

- Conta no Render (https://render.com)
- Repositório Git (GitHub, GitLab ou Gitea)
- Este projeto pronto para ser enviado

## Passo 1: Preparar o Repositório Git

### 1.1 Inicializar Git (se ainda não fez)
```bash
cd /home/ubuntu/solveRIA
git init
git add .
git commit -m "Initial commit: solverIA landing page"
```

### 1.2 Enviar para GitHub (ou outro Git provider)

1. Crie um novo repositório no GitHub (https://github.com/new)
2. Copie a URL do repositório
3. Execute:
```bash
git remote add origin https://github.com/seu-usuario/solveRIA.git
git branch -M main
git push -u origin main
```

## Passo 2: Criar Serviço no Render

### 2.1 Acessar Render Dashboard
1. Acesse https://dashboard.render.com
2. Clique em "New +" → "Web Service"

### 2.2 Conectar Repositório
1. Selecione seu Git provider (GitHub, GitLab, etc)
2. Autorize o Render a acessar seus repositórios
3. Selecione o repositório "solveRIA"

### 2.3 Configurar Build e Deploy

| Campo | Valor |
|-------|-------|
| **Name** | solveRIA |
| **Environment** | Node |
| **Region** | São Paulo (sa-east-1) |
| **Branch** | main |
| **Build Command** | `pnpm install && pnpm build` |
| **Start Command** | `pnpm start` |

### 2.4 Configurar Variáveis de Ambiente

Deixe as variáveis padrão. Se precisar adicionar, clique em "Advanced" e adicione:

```
NODE_ENV=production
```

### 2.5 Plano de Hospedagem

- **Free**: Sem custo, mas a aplicação hiberna após 15 min de inatividade
- **Starter**: $7/mês, sempre ativa

Recomendamos **Starter** para produção.

## Passo 3: Deploy

1. Clique em "Create Web Service"
2. O Render iniciará o build automaticamente
3. Aguarde até ver "Live" no dashboard (2-5 minutos)
4. Acesse sua URL: `https://solveRIA.onrender.com`

## Passo 4: Configurar Domínio Personalizado (Opcional)

### 4.1 Adicionar Domínio
1. No dashboard do Render, vá para "Settings"
2. Clique em "Custom Domains"
3. Digite seu domínio (ex: solveRIA.com.br)

### 4.2 Configurar DNS
1. Acesse seu provedor de domínio (GoDaddy, Namecheap, etc)
2. Adicione um registro CNAME apontando para: `solveRIA.onrender.com`
3. Aguarde 24h para propagação

## Passo 5: Monitorar e Manter

### Logs
- Acesse "Logs" no dashboard para ver erros
- Monitore performance em "Metrics"

### Atualizações
- Faça push para main: `git push origin main`
- Render fará rebuild automaticamente

### Problemas Comuns

**Build falha com erro de dependências:**
```bash
# Limpe cache e tente novamente
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

**Aplicação lenta:**
- Upgrade para plano Starter ou Pro
- Verifique logs para gargalos

**Domínio não funciona:**
- Aguarde propagação DNS (até 48h)
- Verifique registros CNAME no seu provedor

## Estrutura do Projeto

```
solveRIA/
├── client/              # Frontend React
│   ├── src/
│   │   ├── pages/      # Páginas (Home.tsx)
│   │   ├── components/ # Componentes reutilizáveis
│   │   └── index.css   # Estilos globais
│   └── public/         # Arquivos estáticos
├── server/             # Servidor Express
├── package.json        # Dependências
├── vite.config.ts      # Configuração Vite
└── tsconfig.json       # Configuração TypeScript
```

## Tecnologias Utilizadas

- **Frontend**: React 19 + Tailwind CSS 4
- **Build**: Vite
- **Server**: Express.js
- **Styling**: Tailwind CSS com customizações
- **Tipagem**: TypeScript

## Suporte

Para problemas com Render, consulte:
- Documentação: https://render.com/docs
- Status: https://status.render.com
- Suporte: https://support.render.com

---

**Versão**: 1.0
**Última atualização**: Junho 2024
