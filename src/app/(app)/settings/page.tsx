"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie suas chaves de API, integrações e preferências da conta.
        </p>
      </div>

      <Tabs defaultValue="integrations" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="integrations">Integrações (APIs)</TabsTrigger>
          <TabsTrigger value="profile">Perfil da Empresa</TabsTrigger>
          <TabsTrigger value="billing">Plano e Faturamento</TabsTrigger>
        </TabsList>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Google Places API</CardTitle>
              <CardDescription>
                Necessário para buscar empresas por nicho e localização.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>API Key</Label>
                <Input type="password" placeholder="AIzaSy..." />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Salvar Chave</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Apollo.io / Hunter.io</CardTitle>
              <CardDescription>
                Usado para enriquecimento de contatos (e-mails e decisores).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>API Key</Label>
                <Input type="password" placeholder="Cole sua chave aqui..." />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Salvar Chave</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>OpenAI (ChatGPT)</CardTitle>
              <CardDescription>
                Para gerar as mensagens personalizadas com base no perfil da empresa.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>API Key</Label>
                <Input type="password" placeholder="sk-..." />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Salvar Chave</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Dados da Empresa</CardTitle>
              <CardDescription>Como sua empresa será apresentada nas prospecções.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome da Empresa</Label>
                  <Input defaultValue="Minha Agência" />
                </div>
                <div className="space-y-2">
                  <Label>Seu Cargo</Label>
                  <Input defaultValue="CEO / Founder" />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Proposta de Valor Única (Pitch em 1 frase)</Label>
                  <Input defaultValue="Ajudamos empresas a automatizarem vendas." />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Salvar Perfil</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Plano Atual: Pro</CardTitle>
              <CardDescription>Você está no plano Pro (R$ 197/mês).</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-secondary p-4 rounded-md">
                <p className="text-sm font-medium">Uso no ciclo atual:</p>
                <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                  <li>Empresas buscadas: 450 / 1000</li>
                  <li>Contatos enriquecidos: 320 / 500</li>
                  <li>Mensagens geradas (IA): 150 / Ilimitado</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Gerenciar Assinatura</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
