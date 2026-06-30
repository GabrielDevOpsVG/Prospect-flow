"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, Filter, MessageSquare, Mail, Send } from "lucide-react"
import { Input } from "@/components/ui/input"

const mockMessages = [
  { id: 1, to: "João Silva", company: "Clínica Bella", channel: "whatsapp", status: "sent", date: "Hoje, 10:30", preview: "Olá João, vi que a Clínica Bella está expandindo..." },
  { id: 2, to: "Maria Oliveira", company: "Odonto Clean", channel: "email", status: "opened", date: "Ontem, 15:45", preview: "Assunto: Automação para a Odonto Clean" },
  { id: 3, to: "Carlos Souza", company: "Estética Avançada", channel: "whatsapp", status: "replied", date: "Ontem, 09:12", preview: "Carlos: Olá, podemos agendar uma call sim..." },
  { id: 4, to: "Ana Costa", company: "Spa Bem Estar", channel: "email", status: "bounced", date: "Segunda", preview: "Erro ao entregar para contato@spabemestar.com" },
]

export default function MessagesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Caixa de Mensagens</h1>
          <p className="text-muted-foreground mt-2">
            Acompanhe o status e as respostas dos disparos da sua campanha.
          </p>
        </div>
        <Button className="gap-2">
          <Send className="w-4 h-4" />
          Novo Disparo
        </Button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Buscar por contato ou empresa..." className="pl-9" />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          Filtros
        </Button>
      </div>

      <div className="grid gap-4">
        {mockMessages.map((msg) => (
          <Card key={msg.id} className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg \${msg.channel === 'whatsapp' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'}`}>
                  {msg.channel === 'whatsapp' ? <MessageSquare className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                </div>
                <div>
                  <CardTitle className="text-base font-bold">{msg.to}</CardTitle>
                  <CardDescription>{msg.company}</CardDescription>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-xs text-muted-foreground">{msg.date}</span>
                <Badge 
                  variant="outline" 
                  className={
                    msg.status === "sent" ? "bg-secondary text-secondary-foreground" :
                    msg.status === "opened" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                    msg.status === "replied" ? "bg-primary/10 text-primary border-primary/20" :
                    "bg-destructive/10 text-destructive border-destructive/20"
                  }
                >
                  {msg.status === "sent" && "Enviado"}
                  {msg.status === "opened" && "Visualizado"}
                  {msg.status === "replied" && "Respondido"}
                  {msg.status === "bounced" && "Falhou"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <p className="text-sm text-muted-foreground truncate">
                {msg.preview}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
