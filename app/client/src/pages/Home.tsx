import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronDown, Mail, Phone, Zap, TrendingUp, Workflow, Calendar, BarChart3, MessageSquare, FileText, Headphones } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * solverIA Landing Page
 * Design Philosophy: Tech-Forward Minimalism
 * - Azul Profundo (#0F3A7D) como cor primária
 * - Tipografia Poppins para headings, Inter para body
 * - Layouts assimétricos, sem centralização genérica
 * - Animações sutis e proposital
 */

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header/Navigation */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/80 backdrop-blur-md shadow-sm border-b border-border"
            : "bg-transparent"
        }`}
      >
        <div className="container flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img
              src="/manus-storage/solveRIA-logo_a04f28de.png"
              alt="solverIA Logo"
              className="h-8 w-8"
            />
            <span className="font-bold text-xl text-primary" style={{ fontFamily: 'Poppins, sans-serif' }}>
              solverIA
            </span>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              Soluções
            </a>
            <a href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
              Como Funciona
            </a>
            <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
              Planos
            </a>
            <a href="#contact" className="text-sm font-medium hover:text-primary transition-colors">
              Contato
            </a>
          </nav>

          {/* CTA Button */}
          <Button className="bg-primary hover:bg-primary/90 text-white">
            Começar Grátis
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 md:px-0">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Economize tempo e{" "}
                  <span className="text-primary">aumente vendas</span> com IA
                </h1>
                <p className="text-lg text-muted-foreground max-w-md">
                  Automação inteligente que resolve problemas reais de empresas.
                  Agentes de IA, dashboards, automação de processos e muito mais.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                  Iniciar Demonstração
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/5"
                >
                  Ver Vídeo
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold border-2 border-white"
                    >
                      {i}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Confiado por 100+ empresas
                </p>
              </div>
            </div>

            {/* Right Image */}
            <div className="hidden md:block">
              <img
                src="/manus-storage/hero-ai-automation_f0c18391.png"
                alt="AI Automation Illustration"
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Por que solverIA?</h2>
            <p className="text-lg text-muted-foreground">
              Empresas perdem horas em tarefas repetitivas e deixam oportunidades
              de venda passar. Nós resolvemos isso com IA inteligente.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "⏱️",
                title: "Economize 40+ horas/mês",
                desc: "Automação de processos que funcionam 24/7",
              },
              {
                icon: "📈",
                title: "Aumente vendas em 30%",
                desc: "Agentes de IA qualificam clientes automaticamente",
              },
              {
                icon: "💰",
                title: "Reduza custos operacionais",
                desc: "Menos funcionários em tarefas manuais",
              },
            ].map((item, i) => (
              <Card key={i} className="p-6 border-border hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Nossas Soluções</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tudo que você precisa para automatizar, vender e crescer
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Feature 1: WhatsApp Agents */}
            <div className="group">
              <Card className="p-8 h-full hover:shadow-lg transition-shadow border-border">
                <div className="text-5xl mb-4">🤖</div>
                <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>Agentes de IA para WhatsApp</h3>
                <p className="text-muted-foreground mb-6">
                  Funcionário virtual que responde clientes 24/7. Responde dúvidas,
                  explica produtos, agenda horários e qualifica leads automaticamente.
                </p>
                <div className="space-y-2 mb-6">
                  <p className="text-sm flex items-center gap-2">
                    <span className="text-accent">✓</span> Responde 90% das perguntas
                  </p>
                  <p className="text-sm flex items-center gap-2">
                    <span className="text-accent">✓</span> Encaminha casos complexos
                  </p>
                  <p className="text-sm flex items-center gap-2">
                    <span className="text-accent">✓</span> Qualifica leads
                  </p>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  <strong>Investimento:</strong> R$ 500-3.000/mês
                </p>
                <Button variant="outline" className="w-full border-primary text-primary">
                  Saiba Mais
                </Button>
              </Card>
            </div>

            {/* Feature 2: Dashboards */}
            <div className="group">
              <Card className="p-8 h-full hover:shadow-lg transition-shadow border-border">
                <div className="text-5xl mb-4">📊</div>
                <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>Dashboards de Gestão</h3>
                <p className="text-muted-foreground mb-6">
                  Painel centralizado com todos os seus dados em tempo real. Visualize
                  faturamento, vendas, estoque, campanhas e ROI em um só lugar.
                </p>
                <div className="space-y-2 mb-6">
                  <p className="text-sm flex items-center gap-2">
                    <span className="text-accent">✓</span> Métricas em tempo real
                  </p>
                  <p className="text-sm flex items-center gap-2">
                    <span className="text-accent">✓</span> Integração com múltiplos sistemas
                  </p>
                  <p className="text-sm flex items-center gap-2">
                    <span className="text-accent">✓</span> Relatórios automáticos
                  </p>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  <strong>Para:</strong> Lojas, restaurantes, clínicas, academias
                </p>
                <Button variant="outline" className="w-full border-primary text-primary">
                  Saiba Mais
                </Button>
              </Card>
            </div>

            {/* Feature 3: Automation */}
            <div className="group">
              <Card className="p-8 h-full hover:shadow-lg transition-shadow border-border">
                <div className="text-5xl mb-4">🔄</div>
                <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>Automação de Processos</h3>
                <p className="text-muted-foreground mb-6">
                  Elimine tarefas manuais repetitivas. Quando cliente compra, tudo
                  acontece automaticamente: contrato, cadastro, e-mail, financeiro.
                </p>
                <div className="space-y-2 mb-6">
                  <p className="text-sm flex items-center gap-2">
                    <span className="text-accent">✓</span> Emissão de nota fiscal
                  </p>
                  <p className="text-sm flex items-center gap-2">
                    <span className="text-accent">✓</span> Integração entre sistemas
                  </p>
                  <p className="text-sm flex items-center gap-2">
                    <span className="text-accent">✓</span> Economiza 100+ horas/mês
                  </p>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  <strong>ROI:</strong> Retorno em 2-3 meses
                </p>
                <Button variant="outline" className="w-full border-primary text-primary">
                  Saiba Mais
                </Button>
              </Card>
            </div>

            {/* Feature 4: Scheduling */}
            <div className="group">
              <Card className="p-8 h-full hover:shadow-lg transition-shadow border-border">
                <div className="text-5xl mb-4">📅</div>
                <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>Agendamento Automático</h3>
                <p className="text-muted-foreground mb-6">
                  Cliente escreve "quero agendar", IA verifica agenda, encontra horário,
                  confirma e envia lembrete. Sem ninguém tocar no celular.
                </p>
                <div className="space-y-2 mb-6">
                  <p className="text-sm flex items-center gap-2">
                    <span className="text-accent">✓</span> Verificação automática de agenda
                  </p>
                  <p className="text-sm flex items-center gap-2">
                    <span className="text-accent">✓</span> Lembretes automáticos
                  </p>
                  <p className="text-sm flex items-center gap-2">
                    <span className="text-accent">✓</span> Remarcação inteligente
                  </p>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  <strong>Para:</strong> Dentistas, médicos, salões, clínicas
                </p>
                <Button variant="outline" className="w-full border-primary text-primary">
                  Saiba Mais
                </Button>
              </Card>
            </div>

            {/* Feature 5: Marketing AI */}
            <div className="group">
              <Card className="p-8 h-full hover:shadow-lg transition-shadow border-border">
                <div className="text-5xl mb-4">📈</div>
                <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>IA para Marketing e Vendas</h3>
                <p className="text-muted-foreground mb-6">
                  IA identifica automaticamente quais 800 dos seus 10 mil clientes têm
                  maior chance de comprar. Personaliza ofertas e aumenta conversão.
                </p>
                <div className="space-y-2 mb-6">
                  <p className="text-sm flex items-center gap-2">
                    <span className="text-accent">✓</span> Criação de anúncios
                  </p>
                  <p className="text-sm flex items-center gap-2">
                    <span className="text-accent">✓</span> Análise de campanhas
                  </p>
                  <p className="text-sm flex items-center gap-2">
                    <span className="text-accent">✓</span> Personalização de ofertas
                  </p>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  <strong>Resultado:</strong> Aumento de 30-50% em vendas
                </p>
                <Button variant="outline" className="w-full border-primary text-primary">
                  Saiba Mais
                </Button>
              </Card>
            </div>

            {/* Feature 6: Proposals */}
            <div className="group">
              <Card className="p-8 h-full hover:shadow-lg transition-shadow border-border">
                <div className="text-5xl mb-4">📑</div>
                <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>Geração Automática de Propostas</h3>
                <p className="text-muted-foreground mb-6">
                  Vendedor informa nome, serviço e preço. IA gera PDF profissional em
                  segundos com logo, cronograma, escopo e assinatura digital.
                </p>
                <div className="space-y-2 mb-6">
                  <p className="text-sm flex items-center gap-2">
                    <span className="text-accent">✓</span> Geração em segundos
                  </p>
                  <p className="text-sm flex items-center gap-2">
                    <span className="text-accent">✓</span> Assinatura digital
                  </p>
                  <p className="text-sm flex items-center gap-2">
                    <span className="text-accent">✓</span> Branding profissional
                  </p>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  <strong>Para:</strong> Construtoras, agências, consultorias
                </p>
                <Button variant="outline" className="w-full border-primary text-primary">
                  Saiba Mais
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Como Funciona</h2>
            <p className="text-lg text-muted-foreground">
              Três passos simples para começar
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Consultoria Inicial",
                desc: "Entendemos seus processos e desafios",
              },
              {
                step: "2",
                title: "Implementação",
                desc: "Configuramos e integramos com seus sistemas",
              },
              {
                step: "3",
                title: "Acompanhamento",
                desc: "Monitoramos resultados e otimizamos continuamente",
              },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Planos e Preços</h2>
            <p className="text-lg text-muted-foreground">
              Escolha o plano ideal para seu negócio
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Starter",
                price: "R$ 1.500",
                period: "/mês",
                features: [
                  "Agente WhatsApp básico",
                  "Dashboard simples",
                  "Até 1.000 mensagens/mês",
                  "Suporte por email",
                ],
                cta: "Começar",
              },
              {
                name: "Professional",
                price: "R$ 4.500",
                period: "/mês",
                features: [
                  "Agente WhatsApp avançado",
                  "Dashboard completo",
                  "Automação de processos",
                  "Agendamento automático",
                  "Suporte prioritário",
                ],
                cta: "Começar",
                highlight: true,
              },
              {
                name: "Enterprise",
                price: "Custom",
                period: "",
                features: [
                  "Todas as soluções",
                  "Integrações customizadas",
                  "IA para marketing",
                  "Geração de propostas",
                  "Suporte 24/7 dedicado",
                ],
                cta: "Falar com Vendedor",
              },
            ].map((plan, i) => (
              <Card
                key={i}
                className={`p-8 flex flex-col ${
                  plan.highlight
                    ? "border-primary border-2 shadow-lg relative"
                    : "border-border"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-bold">
                    Mais Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <span className="text-accent mt-1">✓</span>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full ${
                    plan.highlight
                      ? "bg-primary hover:bg-primary/90 text-white"
                      : "border-primary text-primary hover:bg-primary/5"
                  }`}
                  variant={plan.highlight ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-white">
        <div className="container text-center">
          <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Pronto para transformar seu negócio?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Comece com uma consultoria gratuita. Entenderemos seus desafios e
            mostraremos como economizar tempo e aumentar vendas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90">
              Agendar Consultoria
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              Falar com Vendedor
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-white py-16">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img
                  src="/manus-storage/solveRIA-logo_a04f28de.png"
                  alt="solverIA Logo"
                  className="h-6 w-6 invert"
                />
                <span className="font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>solverIA</span>
              </div>
              <p className="text-sm text-gray-400">
                Automação + IA + Marketing para empresas que querem crescer.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Soluções</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Agentes WhatsApp
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Dashboards
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Automação
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Sobre
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Contato
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Contato</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <a href="mailto:contato@solveRIA.com" className="hover:text-white transition">
                    contato@solveRIA.com
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <a href="tel:+5511999999999" className="hover:text-white transition">
                    +55 11 99999-9999
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>&copy; 2024 solverIA. Todos os direitos reservados.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition">
                Privacidade
              </a>
              <a href="#" className="hover:text-white transition">
                Termos
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
