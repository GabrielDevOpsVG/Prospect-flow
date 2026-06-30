import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2, Target, Users, Zap, LayoutDashboard } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navbar */}
      <header className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
              P
            </div>
            <span className="text-xl font-bold text-foreground">Prospect Flow</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
              Entrar
            </Link>
            <Link href="/login">
              <Button>Começar Grátis</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-24 px-4 text-center relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl -z-10" />
          
          <div className="container mx-auto max-w-4xl relative z-10">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
              Do nicho ao cliente.<br/>
              <span className="text-primary glow-text">Prospecção Inteligente.</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Prospecção inteligente que encontra empresas, organiza contatos e ajuda você a iniciar campanhas comerciais em poucos minutos.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8">
                  Criar minha primeira campanha
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="#demo">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8">
                  Ver demonstração
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Como Funciona */}
        <section className="py-24 bg-card/30 border-y border-border">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Como funciona</h2>
              <p className="text-muted-foreground">Em apenas 4 passos, você terá uma máquina de vendas rodando.</p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                { icon: Target, title: "1. Defina o alvo", desc: "Escolha o nicho, cidade e perfil ideal de empresa." },
                { icon: Users, title: "2. Encontre empresas", desc: "O sistema localiza negócios compatíveis com sua campanha." },
                { icon: LayoutDashboard, title: "3. Organize contatos", desc: "Centralize e qualifique leads comerciais em um só lugar." },
                { icon: Zap, title: "4. Inicie abordagens", desc: "Crie mensagens personalizadas para e-mail, WhatsApp ou prospecção manual." },
              ].map((step, i) => (
                <div key={i} className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefícios */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-8">Tudo o que você precisa para prospectar melhor</h2>
                <div className="space-y-6">
                  {[
                    "Menos tempo pesquisando empresas e contatos",
                    "Mais previsibilidade comercial no fim do mês",
                    "Leads organizados por campanha no Kanban",
                    "Mensagens personalizadas e padronizadas",
                    "Dashboard com status e métricas de conversão"
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                      <span className="text-lg">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div id="demo" className="relative rounded-2xl border border-border bg-card p-2 shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-50"></div>
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border/50 bg-[#0a0a0a] flex items-center justify-center">
                  {/* Placeholder for Dashboard Screenshot */}
                  <div className="text-center p-8">
                    <div className="w-16 h-16 rounded bg-primary/20 flex items-center justify-center mx-auto mb-4">
                      <LayoutDashboard className="w-8 h-8 text-primary" />
                    </div>
                    <p className="text-lg font-medium text-muted-foreground">Interface Premium do Dashboard</p>
                    <p className="text-sm text-muted-foreground mt-2">Visão geral de campanhas, gráficos de resposta e atividades recentes.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-primary text-primary-foreground text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold mb-6 text-black">Pronto para acelerar suas vendas?</h2>
            <p className="text-xl mb-10 max-w-2xl mx-auto text-black/80">
              Crie sua conta agora mesmo e comece a gerar oportunidades reais de negócio para a sua empresa.
            </p>
            <Link href="/login">
              <Button size="lg" variant="secondary" className="text-lg px-12 bg-black text-primary hover:bg-black/90">
                Criar conta gratuita
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t border-border bg-card text-center text-muted-foreground">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} Prospect Flow. Todos os direitos reservados.</p>
          <p className="text-sm mt-2">Construído para profissionais de vendas B2B respeitando a LGPD.</p>
        </div>
      </footer>
    </div>
  )
}
