"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Plus, MessageSquare } from "lucide-react"

const mockTemplates = [
  { id: 1, name: "Cold Email (Direto)", type: "email", useCount: 154, content: "Olá {{nome}},\nVi que a {{empresa}} está crescendo no setor de {{setor}}..." },
  { id: 2, name: "Abordagem Consultiva (WhatsApp)", type: "whatsapp", useCount: 302, content: "Opa {{nome}}, tudo bem? Aqui é do Prospect Flow. Vi o perfil da {{empresa}}..." },
  { id: 3, name: "Follow-up 1 (Pós envio de material)", type: "email", useCount: 89, content: "Olá {{nome}}, conseguiu dar uma olhada na apresentação que te enviei?" },
]

export default function TemplatesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Templates e Mensagens</h1>
          <p className="text-muted-foreground mt-2">
            Crie modelos reutilizáveis de e-mail e WhatsApp para suas campanhas.
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Template
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockTemplates.map((template) => (
          <Card key={template.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge variant="outline" className={
                  template.type === 'whatsapp' 
                    ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                    : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                }>
                  {template.type === 'whatsapp' ? <MessageSquare className="w-3 h-3 mr-1" /> : <FileText className="w-3 h-3 mr-1" />}
                  {template.type}
                </Badge>
                <span className="text-xs text-muted-foreground">{template.useCount} usos</span>
              </div>
              <CardTitle className="text-lg">{template.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="bg-secondary p-3 rounded-md text-sm text-muted-foreground whitespace-pre-wrap font-mono">
                {template.content}
              </div>
            </CardContent>
            <CardFooter className="pt-0 justify-between">
              <Button variant="outline" size="sm">Editar</Button>
              <Button variant="ghost" size="sm" className="text-destructive">Excluir</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
