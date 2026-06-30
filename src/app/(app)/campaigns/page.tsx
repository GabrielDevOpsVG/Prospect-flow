"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Target, Search, Users, Play, Pause, MoreVertical } from "lucide-react"

const mockCampaigns = [
  { id: 1, name: "Clínicas de Estética SP", status: "active", progress: 65, leads: 120, conversions: 12, date: "28 Jun 2026" },
  { id: 2, name: "Escritórios de Advocacia PE", status: "paused", progress: 30, leads: 45, conversions: 3, date: "15 Jun 2026" },
  { id: 3, name: "Agências de Marketing RJ", status: "completed", progress: 100, leads: 300, conversions: 45, date: "01 Jun 2026" },
]

export default function CampaignsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campanhas</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie e acompanhe a performance de suas campanhas ativas.
          </p>
        </div>
        <Link href="/campaigns/new">
          <Button className="gap-2">
            <Target className="w-4 h-4" />
            Nova Campanha
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Campanhas</CardTitle>
          <CardDescription>Você tem {mockCampaigns.length} campanhas criadas no total.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome da Campanha</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progresso</TableHead>
                <TableHead>Leads</TableHead>
                <TableHead>Convertidos</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCampaigns.map((camp) => (
                <TableRow key={camp.id}>
                  <TableCell className="font-medium">{camp.name}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={
                        camp.status === "active" ? "bg-primary/10 text-primary border-primary/20" :
                        camp.status === "paused" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" :
                        "bg-muted text-muted-foreground"
                      }
                    >
                      {camp.status === "active" && "Ativa"}
                      {camp.status === "paused" && "Pausada"}
                      {camp.status === "completed" && "Concluída"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-secondary rounded-full h-2 max-w-[100px]">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${camp.progress}%` }} 
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{camp.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{camp.leads}</TableCell>
                  <TableCell>{camp.conversions}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {camp.status === "active" ? (
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                          <Pause className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
