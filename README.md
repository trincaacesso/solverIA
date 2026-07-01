# SolverIA — AI Automation Landing Page

> **We save time and increase sales using Artificial Intelligence.**

Premium, fully responsive dark-theme landing page for an AI automation company, built with a modern component-driven stack.

## Stack

- **Next.js 14** (App Router) + **React 18**
- **TypeScript** (strict)
- **Tailwind CSS** — custom design tokens, glassmorphism, gradients
- **Framer Motion** — scroll & micro animations
- **Lucide Icons**
- SEO: metadata, Open Graph, Twitter cards, JSON-LD Organization schema

## Sections

Hero (with animated flow illustration) · What We Do · How We Help Businesses (animated flow) · Services (7 interactive detailed cards) · Our Complete Solution · Industries · Why SolverIA (comparison) · Numbers (animated counters) · Testimonials · FAQ (accordion) · Final CTA + contact form · Footer.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve production build
```

## Customize

- **WhatsApp number & demo link** → `lib/utils.ts` (`WHATSAPP_URL`, `DEMO_URL`)
- **Colors / gradients** → `tailwind.config.ts`
- **Copy & content** → each file in `components/sections/`
- **Contact form** → `components/sections/final-cta.tsx` (currently client-side validation only; wire to your backend/email service or a form provider)

## Structure

```
app/            layout, page, global styles, SEO
components/
  ui/           reusable primitives (reveal, button, heading)
  sections/     one file per landing section
  navbar.tsx, footer.tsx
lib/utils.ts    cn() helper + shared links
```
