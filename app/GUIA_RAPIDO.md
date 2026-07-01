# 🚀 Guia Rápido - solverIA

Referência rápida para trabalhar com o projeto solverIA.

---

## 📦 Instalação Rápida

```bash
# 1. Clonar
git clone https://github.com/seu-usuario/solveRIA.git
cd solveRIA

# 2. Instalar
pnpm install

# 3. Desenvolver
pnpm dev

# 4. Acessar
# http://localhost:3000
```

---

## 📁 Arquivos Principais

| Arquivo | Localização | Propósito |
|---------|-------------|----------|
| **Home.tsx** | `client/src/pages/Home.tsx` | Landing page (EDITE AQUI) |
| **index.css** | `client/src/index.css` | Cores e estilos globais |
| **App.tsx** | `client/src/App.tsx` | Rotas e tema |
| **package.json** | `./package.json` | Dependências |

---

## 🎨 Cores da Marca

```
Azul Profundo:    #0F3A7D  (Primária)
Laranja:          #F97316  (Secundária)
Verde:            #10B981  (Sucesso)
Cinza Escuro:     #1A202C  (Texto)
Off-white:        #FAFBFC  (Fundo)
```

**Usar em CSS:**
```css
color: var(--primary);           /* Azul */
color: var(--secondary);         /* Laranja */
color: var(--accent);            /* Verde */
background-color: var(--background);
```

---

## ✏️ Editar Conteúdo

### Mudar Headline

**Arquivo:** `client/src/pages/Home.tsx` (linha ~79)

```tsx
<h1>
  Economize tempo e <span className="text-primary">aumente vendas</span> com IA
</h1>
```

### Mudar Descrição

**Arquivo:** `client/src/pages/Home.tsx` (linha ~84)

```tsx
<p>
  Automação inteligente que resolve problemas reais de empresas.
  Agentes de IA, dashboards, automação de processos e muito mais.
</p>
```

### Mudar Preços

**Arquivo:** `client/src/pages/Home.tsx` (linha ~385)

```tsx
{
  name: "Starter",
  price: "R$ 1.500",      // ← EDITE AQUI
  period: "/mês",
  // ...
}
```

### Mudar Cores

**Arquivo:** `client/src/index.css` (linha ~48)

```css
:root {
  --primary: #0F3A7D;      /* ← EDITE AQUI */
  --secondary: #F97316;    /* ← EDITE AQUI */
  --accent: #10B981;       /* ← EDITE AQUI */
}
```

---

## 🔧 Scripts Úteis

```bash
pnpm dev              # Inicia desenvolvimento
pnpm build            # Build para produção
pnpm start            # Inicia servidor
pnpm preview          # Preview do build
pnpm check            # Verifica tipos
pnpm format           # Formata código
```

---

## 🚀 Deploy no Render

### 1. Preparar Git

```bash
git add .
git commit -m "Update solverIA"
git push origin main
```

### 2. Render Dashboard

1. Acesse https://dashboard.render.com
2. "New +" → "Web Service"
3. Selecione repositório
4. Build: `pnpm install && pnpm build`
5. Start: `pnpm start`
6. Deploy!

### 3. Monitorar

- Logs: Dashboard → Logs
- Metrics: Dashboard → Metrics

---

## 🎯 Estrutura das Seções

### Hero Section
```
- Headline + Subheadline
- 2 CTAs (Iniciar, Ver Vídeo)
- Social proof (avatares)
- Imagem (hero-ai-automation.png)
```

### Features (6 Soluções)
```
- Ícone emoji
- Título
- Descrição
- 3 checkmarks
- Preço/Investimento
- CTA "Saiba Mais"
```

### Pricing
```
- 3 Planos (Starter, Professional, Enterprise)
- Professional = Destaque
- Features listadas
- CTAs diferenciados
```

### Footer
```
- Logo + Descrição
- 4 Colunas (Soluções, Empresa, Contato)
- Links legais
- Copyright
```

---

## 🐛 Troubleshooting

| Problema | Solução |
|----------|---------|
| Porta 3000 em uso | `PORT=3001 pnpm dev` |
| Módulo não encontrado | `rm -rf node_modules && pnpm install` |
| Build falha | Verifique logs no Render |
| Imagens não carregam | Verifique URLs em Home.tsx |

---

## 📱 Responsive Breakpoints

```
Mobile:   < 640px
Tablet:   640px - 1024px
Desktop:  > 1024px
```

**Usar em Tailwind:**
```tsx
<div className="md:grid-cols-2">  {/* 2 colunas em tablet+ */}
<div className="hidden md:block"> {/* Esconde em mobile */}
```

---

## 🔗 Links Importantes

- **GitHub**: https://github.com/seu-usuario/solveRIA
- **Render**: https://dashboard.render.com
- **Documentação React**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com
- **shadcn/ui**: https://ui.shadcn.com

---

## 📞 Contato

- Email: contato@solveRIA.com
- Telefone: +55 11 99999-9999

---

**Última atualização:** Junho 2024
