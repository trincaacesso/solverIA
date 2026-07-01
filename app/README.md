# solverIA - Landing Page

Landing page profissional para solverIA, plataforma de automação e IA para empresas.

## 🚀 Sobre o Projeto

**solverIA** é uma plataforma que oferece soluções de automação e inteligência artificial para aumentar vendas e economizar tempo. Esta é a landing page de apresentação das soluções.

### Soluções Oferecidas

- 🤖 **Agentes de IA para WhatsApp** - Atendimento 24/7 automático
- 📊 **Dashboards de Gestão** - Visualização centralizada de dados
- 🔄 **Automação de Processos** - Eliminar tarefas manuais repetitivas
- 📅 **Agendamento Automático** - Gestão de horários sem intervenção
- 📈 **IA para Marketing e Vendas** - Personalização e análise de campanhas
- 📑 **Geração Automática de Propostas** - PDFs profissionais em segundos

## 🛠️ Stack Tecnológico

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Build Tool**: Vite
- **Server**: Express.js
- **Deployment**: Render

## 📋 Requisitos

- Node.js 18+
- pnpm 10+

## 🚀 Começar Localmente

### 1. Clonar e Instalar

```bash
git clone https://github.com/seu-usuario/solveRIA.git
cd solveRIA
pnpm install
```

### 2. Desenvolvimento

```bash
pnpm dev
```

Acesse `http://localhost:3000`

### 3. Build para Produção

```bash
pnpm build
pnpm start
```

## 📁 Estrutura do Projeto

```
solveRIA/
├── client/                    # Frontend React
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx      # Landing page principal
│   │   │   └── NotFound.tsx  # Página 404
│   │   ├── components/       # Componentes reutilizáveis
│   │   ├── contexts/         # React contexts
│   │   ├── hooks/            # Custom hooks
│   │   ├── lib/              # Utilitários
│   │   ├── App.tsx           # Componente raiz
│   │   ├── main.tsx          # Entry point
│   │   └── index.css         # Estilos globais
│   └── public/               # Arquivos estáticos
├── server/                    # Backend Express
│   └── index.ts              # Servidor
├── shared/                    # Código compartilhado
├── package.json              # Dependências
├── vite.config.ts            # Configuração Vite
├── tsconfig.json             # Configuração TypeScript
└── DEPLOY_RENDER.md          # Guia de deploy
```

## 🎨 Design

### Paleta de Cores

| Cor | Hex | Uso |
|-----|-----|-----|
| Azul Profundo | #0F3A7D | Primária, CTAs |
| Laranja | #F97316 | Destaques secundários |
| Verde | #10B981 | Indicadores de sucesso |
| Cinza Escuro | #1A202C | Texto principal |
| Off-white | #FAFBFC | Fundo |

### Tipografia

- **Headings**: Poppins Bold
- **Body**: Inter Regular
- **Mono**: JetBrains Mono

## 🚀 Deploy

### Render (Recomendado)

Veja o guia completo em [DEPLOY_RENDER.md](./DEPLOY_RENDER.md)

**Resumo rápido:**
1. Envie para GitHub
2. Conecte no Render
3. Configure build: `pnpm install && pnpm build`
4. Configure start: `pnpm start`
5. Deploy automático

### Outras Plataformas

O projeto pode ser deployado em qualquer plataforma que suporte Node.js:
- Vercel
- Netlify
- Heroku
- AWS
- DigitalOcean

## 📝 Scripts Disponíveis

```bash
pnpm dev          # Inicia servidor de desenvolvimento
pnpm build        # Build para produção
pnpm start        # Inicia servidor de produção
pnpm preview      # Preview do build
pnpm check        # Verifica tipos TypeScript
pnpm format       # Formata código com Prettier
```

## 🔧 Configuração

### Variáveis de Ambiente

O projeto usa variáveis injetadas automaticamente pelo Render:
- `NODE_ENV` - Ambiente (development/production)
- `PORT` - Porta do servidor (padrão: 3000)

### Customização

Para customizar a landing page:

1. **Conteúdo**: Edite `client/src/pages/Home.tsx`
2. **Estilos**: Modifique `client/src/index.css`
3. **Componentes**: Adicione em `client/src/components/`
4. **Imagens**: Use URLs do `/manus-storage/`

## 📱 Responsividade

A landing page é totalmente responsiva:
- Mobile (320px+)
- Tablet (768px+)
- Desktop (1024px+)

## ♿ Acessibilidade

- Contraste de cores WCAG AA
- Navegação por teclado
- Semântica HTML apropriada
- ARIA labels onde necessário

## 🐛 Troubleshooting

### Erro: "Cannot find module"
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Porta 3000 já em uso
```bash
PORT=3001 pnpm dev
```

### Build falha no Render
- Verifique logs: Dashboard → Logs
- Limpe cache: Settings → Clear Build Cache
- Tente novamente

## 📄 Licença

Propriedade de solverIA. Todos os direitos reservados.

## 👥 Suporte

Para dúvidas ou sugestões:
- Email: contato@solveRIA.com
- Telefone: +55 11 99999-9999

---

**Versão**: 1.0.0  
**Última atualização**: Junho 2024  
**Status**: ✅ Pronto para produção
