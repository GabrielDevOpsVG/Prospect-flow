"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, ArrowLeft, CheckCircle2, Search, Building2, UserPlus, FileText, Send } from "lucide-react"

const steps = [
  { id: 1, title: "Definir Alvo", icon: Target },
  { id: 2, title: "Empresas", icon: Building2 },
  { id: 3, title: "Contatos", icon: UserPlus },
  { id: 4, title: "Mensagens", icon: FileText },
  { id: 5, title: "Revisão", icon: CheckCircle2 }
]

function Target(props: any) {
  return <Search {...props} />
}

export function CampaignWizard() {
  const [currentStep, setCurrentStep] = useState(1)

  // Mock data states
  const [formData, setFormData] = useState({
    name: "",
    niche: "",
    city: "",
    state: "",
    channel: "whatsapp"
  })

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 5))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

  return (
    <div className="space-y-8">
      {/* Progress Bar */}
      <div className="relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-secondary -translate-y-1/2 rounded-full" />
        <div 
          className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 rounded-full transition-all duration-300"
          style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
        />
        <div className="relative flex justify-between">
          {steps.map((step) => {
            const isActive = step.id === currentStep
            const isCompleted = step.id < currentStep
            return (
              <div key={step.id} className="flex flex-col items-center gap-2">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                    isActive ? "bg-background border-primary text-primary" : 
                    isCompleted ? "bg-primary border-primary text-primary-foreground" : 
                    "bg-background border-secondary text-muted-foreground"
                  }`}
                >
                  <step.icon className="w-5 h-5" />
                </div>
                <span className={`text-xs font-medium hidden sm:block ${isActive || isCompleted ? "text-foreground" : "text-muted-foreground"}`}>
                  {step.title}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Step Content */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].title}</CardTitle>
          <CardDescription>
            {currentStep === 1 && "Defina os parâmetros de busca para sua prospecção."}
            {currentStep === 2 && "Encontramos essas empresas com base no seu alvo."}
            {currentStep === 3 && "Enriquecendo contatos nas empresas selecionadas."}
            {currentStep === 4 && "Configure as mensagens e templates de abordagem."}
            {currentStep === 5 && "Revise tudo antes de iniciar a campanha."}
          </CardDescription>
        </CardHeader>
        <CardContent className="min-h-[300px]">
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label>Nome da Campanha</Label>
                  <Input 
                    placeholder="Ex: Clínicas de Estética 2026" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nicho / Segmento</Label>
                  <Input 
                    placeholder="Ex: Clínicas de Estética" 
                    value={formData.niche}
                    onChange={e => setFormData({...formData, niche: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Canal Preferencial</Label>
                  <Select value={formData.channel} onValueChange={(v) => setFormData({...formData, channel: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="email">E-mail</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="manual">Manual (Telefone)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Cidade</Label>
                  <Input 
                    placeholder="Ex: Recife" 
                    value={formData.city}
                    onChange={e => setFormData({...formData, city: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Estado (UF)</Label>
                  <Input 
                    placeholder="Ex: PE" 
                    maxLength={2}
                    value={formData.state}
                    onChange={e => setFormData({...formData, state: e.target.value})}
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="flex flex-col items-center justify-center h-[300px] text-center space-y-4">
              <Building2 className="w-16 h-16 text-primary opacity-50" />
              <div>
                <h3 className="text-xl font-bold">Buscando empresas...</h3>
                <p className="text-muted-foreground max-w-md mt-2">
                  Em ambiente de produção, faremos chamadas à API do Google Places e outras fontes para listar empresas em <b>{formData.city || "sua região"}</b> do nicho <b>{formData.niche || "informado"}</b>.
                </p>
              </div>
              <div className="p-4 bg-primary/10 text-primary rounded-lg font-medium">
                (Mockado) 47 empresas encontradas!
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="flex flex-col items-center justify-center h-[300px] text-center space-y-4">
              <UserPlus className="w-16 h-16 text-primary opacity-50" />
              <div>
                <h3 className="text-xl font-bold">Enriquecendo contatos...</h3>
                <p className="text-muted-foreground max-w-md mt-2">
                  Buscando decisores, e-mails comerciais e telefones.
                </p>
              </div>
              <div className="p-4 bg-primary/10 text-primary rounded-lg font-medium">
                (Mockado) 60 contatos validados!
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Tom da Mensagem (IA)</Label>
                <Select defaultValue="consultivo">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consultivo">Consultivo e Profissional</SelectItem>
                    <SelectItem value="direto">Direto e Objetivo</SelectItem>
                    <SelectItem value="provocativo">Provocativo (Foco na dor)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Mensagem Gerada (WhatsApp)</Label>
                <textarea 
                  className="w-full min-h-[150px] p-3 rounded-md bg-secondary border border-border text-sm"
                  defaultValue={`Olá {{nome_contato}}, vi que você é responsável pela {{nome_empresa}} em {{cidade}}. Ajudo empresas de {{segmento}} a automatizarem a prospecção B2B. Faz sentido conversarmos rapidamente sobre isso na terça?`}
                />
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm bg-secondary p-4 rounded-lg">
                <div>
                  <span className="text-muted-foreground block">Campanha:</span>
                  <span className="font-bold">{formData.name || "Sem nome"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Alvo:</span>
                  <span className="font-bold">{formData.niche || "Sem nicho"} em {formData.city || "Sem cidade"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Resultados:</span>
                  <span className="font-bold text-primary">47 empresas, 60 contatos</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Canal:</span>
                  <span className="font-bold uppercase">{formData.channel}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Revise os dados antes de iniciar o disparo. Mensagens automáticas requerem configuração na aba de integrações.
              </p>
            </div>
          )}

        </CardContent>
        <CardFooter className="flex justify-between border-t border-border pt-6">
          <Button 
            variant="outline" 
            onClick={prevStep} 
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          
          {currentStep < 5 ? (
            <Button onClick={nextStep}>
              Próxima Etapa
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button className="bg-primary text-black hover:bg-primary/90">
              <Send className="w-4 h-4 mr-2" />
              Salvar e Iniciar Campanha
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
