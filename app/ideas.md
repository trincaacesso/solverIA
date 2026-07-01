# Estratégia de Design - solverIA

## Filosofia de Design Escolhida: **Tech-Forward Minimalism**

A solverIA é uma empresa de **automação + IA + marketing** que resolve problemas de clientes. A filosofia de design reflete isso: **moderna, confiável, inteligente e acessível**.

---

## Design Movement
**Contemporary Tech Minimalism** com influências de **SaaS premium** (Stripe, Notion, Vercel). Foco em clareza, hierarquia visual forte e confiança através da simplicidade.

---

## Core Principles

1. **Clareza Radical**: Cada elemento comunica propósito imediato. Sem decoração desnecessária.
2. **Hierarquia de Confiança**: Tipografia e espaçamento criam progressão visual que guia o usuário.
3. **Movimento Proposital**: Animações sutis reforçam interatividade, nunca distraem.
4. **Densidade Inteligente**: Informação densa mas respirável, com whitespace estratégico.

---

## Color Philosophy

**Paleta Principal:**
- **Azul Profundo** (`#0F3A7D`): Confiança, tecnologia, autoridade. Cor primária para CTAs e destaques.
- **Branco/Off-white** (`#FAFBFC`): Fundo limpo, respirável, profissional.
- **Cinza Escuro** (`#1A202C`): Texto principal, hierarquia.
- **Cinza Médio** (`#64748B`): Texto secundário, descrições.
- **Verde Sucesso** (`#10B981`): Indicadores de sucesso, checkmarks.
- **Laranja Accent** (`#F97316`): Destaques secundários, call-to-action alternativo.

**Raciocínio**: Azul evoca tecnologia e confiança (essencial para IA). Verde reforça "solução bem-sucedida". Laranja adiciona energia sem ser agressivo.

---

## Layout Paradigm

**Estrutura Assimétrica com Ritmo**:
- Hero: Imagem grande + texto à esquerda (não centralizado)
- Seções de features: Alternância entre texto-esquerda/imagem-direita e imagem-esquerda/texto-direita
- Testimonials/CTA: Blocos com grid 2-3 colunas, não simétrico
- Footer: Minimal, 3 colunas com links

**Evita**: Layouts centralizados genéricos, grids uniformes demais.

---

## Signature Elements

1. **Ícones + Badges**: Cada feature tem ícone emoji grande + badge de categoria (ex: "🤖 Automação"). Cria identidade visual forte.
2. **Gradient Accents**: Gradientes sutis (azul → roxo) em CTAs e seções destaque. Não excessivo.
3. **Dividers Orgânicos**: SVG wave dividers entre seções para fluidez visual.

---

## Interaction Philosophy

- **Hover States**: Botões escurecem levemente, cards ganham sombra suave.
- **Scroll Reveals**: Elementos entram com fade + slide suave ao scrollar.
- **Micro-interactions**: Checkmarks animados em listas, números que "contam" ao entrar em viewport.

---

## Animation Guidelines

- **Entrance**: 300-400ms ease-out para seções ao scroll
- **Hover**: 150-200ms ease-in-out para botões e cards
- **Transitions**: Suave, nunca abrupt. Respeita `prefers-reduced-motion`.
- **Velocidade**: Rápido o suficiente para sentir responsivo, lento o suficiente para ser elegante.

---

## Typography System

- **Display Font**: `Poppins Bold` (headings h1, h2) - moderno, amigável, tech-forward
- **Body Font**: `Inter Regular/Medium` (paragrafos, descrições) - legível, neutro
- **Mono Font**: `JetBrains Mono` (código, números) - técnico, confiável

**Hierarquia**:
- H1: 48px, bold, azul profundo
- H2: 32px, bold, cinza escuro
- H3: 24px, medium, cinza escuro
- Body: 16px, regular, cinza escuro
- Small: 14px, regular, cinza médio

---

## Brand Essence

**One-liner**: *Automação inteligente que economiza tempo e aumenta vendas para empresas que querem crescer rápido.*

**Personality**: Confiável, Inovador, Prático

---

## Brand Voice

**Tom**: Direto, sem jargão desnecessário, focado em resultados.

**Exemplos de copy**:
- ❌ "Bem-vindo ao nosso site"
- ✅ "Economize 40 horas por mês com automação inteligente"

- ❌ "Clique aqui para começar"
- ✅ "Comece sua automação grátis"

---

## Wordmark & Logo

**Conceito**: Símbolo de engrenagem + IA (dois círculos interconectados formando uma engrenagem estilizada) + texto "solverIA" em Poppins Bold.

**Cor**: Azul profundo (`#0F3A7D`)
**Estilo**: Geométrico, moderno, tech-forward
**Uso**: Header, favicon, social media

---

## Signature Brand Color

**Azul Profundo** (`#0F3A7D`) - Imediatamente reconhecível, evoca confiança tecnológica.

---

## Estrutura da Landing Page

1. **Header/Nav**: Logo + Links (Features, Soluções, Contato) + CTA "Começar Grátis"
2. **Hero**: Headline grande + subheadline + CTA + Imagem/Ilustração
3. **Problem Section**: "Por que solverIA?" - problemas que resolve
4. **Features Grid**: 7 soluções com ícones, descrição, exemplo
5. **How It Works**: Passo a passo visual
6. **Pricing/Packages**: Planos disponíveis
7. **Testimonials**: Cases de sucesso (se houver)
8. **CTA Final**: "Comece sua transformação digital"
9. **Footer**: Links, social, contato

---

## Notas de Implementação

- Usar Tailwind 4 com tokens de cor customizados
- Componentes shadcn/ui para consistência
- Animações com Framer Motion
- Responsive design mobile-first
- Acessibilidade WCAG AA mínimo
