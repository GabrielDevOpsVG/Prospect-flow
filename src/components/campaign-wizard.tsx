"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, ArrowLeft, CheckCircle2, Search, Building2, UserPlus, FileText, Loader2 } from "lucide-react"

const steps = [
  { id: 1, title: "Definir Alvo", icon: TargetIcon },
  { id: 2, title: "Empresas", icon: Building2 },
  { id: 3, title: "Contatos", icon: UserPlus },
  { id: 4, title: "Mensagens", icon: FileText },
  { id: 5, title: "Revisão", icon: CheckCircle2 },
]

function TargetIcon(props: React.SVGProps<SVGSVGElement>) {
  return <Search {...props} />
}

export function CampaignWizard() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [searching, setSearching] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    niche: "",
    city: "",
    state: "",
    channel: "whatsapp",
  })

  const handleNext = async () => {
    // On step 1 → 2: trigger real search and go to results page
    if (currentStep === 1) {
      if (!formData.niche || !formData.city) return
      setSearching(true)
      const params = new URLSearchParams({
        niche: formData.niche,
        city: formData.city,
        state: formData.state,
      })
      router.push(`/campaigns/results?${params.toString()}`)
      return
    }
    setCurrentStep((prev) => Math.min(prev + 1, 5))
  }

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1))
  const canProceed = currentStep !== 1 || (!!formData.niche && !!formData.city)

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
                    isActive
                      ? "bg-background border-primary text-primary"
                      : isCompleted
                      ? "bg-primary border-primary text-primary-foreground"
                      : "bg-background border-secondary text-muted-foreground"
                  }`}
                >
                  <step.icon className="w-5 h-5" />
                </div>
                <span
                  className={`text-xs font-medium hidden sm:block ${
                    isActive || isCompleted ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
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
          {/* STEP 1 — Search Form */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label>Nome da Campanha</Label>
                  <Input
                    placeholder="Ex: Clínicas de Estética 2026"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>
                    Nicho / Segmento <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    placeholder="Ex: Clínicas de Estética"
                    value={formData.niche}
                    onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Canal Preferencial</Label>
                  <Select
                    value={formData.channel}
                    onValueChange={(v) => setFormData({ ...formData, channel: v })}
                  >
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
                  <Label>
                    Cidade <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    placeholder="Ex: Recife"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Estado (UF)</Label>
                  <Input
                    placeholder="Ex: PE"
                    maxLength={2}
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground pt-2">
                * Campos obrigatórios. A busca utilizará o Google Maps para encontrar empresas reais.
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between border-t border-border pt-6">
          <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>

          <Button onClick={handleNext} disabled={!canProceed || searching}>
            {searching ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Buscando...
              </>
            ) : (
              <>
                {currentStep === 1 ? "Buscar Empresas" : "Próxima Etapa"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
