"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Mail, Phone, Calendar } from "lucide-react"

const columns = [
  { id: "novo", title: "Novos", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  { id: "contato", title: "Em Contato", color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
  { id: "negociando", title: "Negociação", color: "bg-orange-500/10 text-orange-500 border-orange-500/20" },
  { id: "convertido", title: "Convertido", color: "bg-primary/10 text-primary border-primary/20" },
  { id: "perdido", title: "Perdido", color: "bg-destructive/10 text-destructive border-destructive/20" },
]

const mockLeads = [
  { id: 1, name: "João Silva", company: "Clínica Estética Bella", status: "novo", phone: "+55 11 9999-9999", date: "Hoje" },
  { id: 2, name: "Maria Oliveira", company: "Odonto Clean", status: "contato", phone: "+55 11 8888-8888", date: "Ontem" },
  { id: 3, name: "Carlos Souza", company: "Estética Avançada", status: "negociando", phone: "+55 11 7777-7777", date: "3 dias atrás" },
  { id: 4, name: "Ana Costa", company: "Spa Bem Estar", status: "convertido", phone: "+55 11 6666-6666", date: "1 semana atrás" },
]

export default function LeadsPage() {
  return (
    <div className="space-y-6 h-[calc(100vh-120px)] flex flex-col">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Leads (CRM)</h1>
        <p className="text-muted-foreground mt-2">
          Acompanhe e gerencie o status das suas negociações (Kanban).
        </p>
      </div>

      <div className="flex-1 flex gap-6 overflow-x-auto pb-4">
        {columns.map(col => (
          <div key={col.id} className="w-80 shrink-0 flex flex-col bg-secondary/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <Badge variant="outline" className={col.color}>
                {col.title}
              </Badge>
              <span className="text-sm font-medium text-muted-foreground">
                {mockLeads.filter(l => l.status === col.id).length}
              </span>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto">
              {mockLeads
                .filter(l => l.status === col.id)
                .map(lead => (
                  <Card key={lead.id} className="cursor-pointer hover:border-primary/50 transition-colors">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-base font-bold">{lead.name}</CardTitle>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <Building2 className="w-3 h-3 mr-1" />
                        {lead.company}
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <div className="space-y-2 text-xs text-muted-foreground">
                        <div className="flex items-center">
                          <Phone className="w-3 h-3 mr-2" />
                          {lead.phone}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-2" />
                          Atualizado: {lead.date}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
