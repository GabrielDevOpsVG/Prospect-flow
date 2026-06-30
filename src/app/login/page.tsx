import { LoginForm } from "@/components/login-form"
import { ShieldCheck } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Left side - branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 bg-card border-r border-border">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
              P
            </div>
            <span className="text-2xl font-bold text-foreground">Prospect Flow</span>
          </div>
          <h1 className="text-4xl font-bold leading-tight mb-4 text-foreground">
            A forma inteligente de encontrar e converter <span className="text-primary">clientes B2B</span>.
          </h1>
          <p className="text-muted-foreground text-lg max-w-md">
            Do nicho ao cliente. Descubra contatos qualificados e inicie campanhas em poucos minutos.
          </p>
        </div>
        
        <div className="flex items-center gap-3 text-muted-foreground">
          <ShieldCheck className="w-5 h-5 text-primary" />
          <span className="text-sm">Ambiente seguro e aderente à LGPD</span>
        </div>
      </div>

      {/* Right side - form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Bem-vindo de volta</h2>
            <p className="text-muted-foreground">Insira suas credenciais para acessar sua conta</p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
