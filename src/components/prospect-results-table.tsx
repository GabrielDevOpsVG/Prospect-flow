"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Building2, Phone, Globe, Mail, Users, ChevronDown, ChevronUp,
  Download, PlusCircle, Loader2, CheckCircle2, MessageSquare,
  Search, AlertCircle
} from "lucide-react"

interface Contact {
  name: string
  role: string
  email: string | null
  phone: string | null
}

interface Prospect {
  id: string
  name: string
  address: string | null
  city: string
  state?: string
  phone: string | null
  raw_phone?: string | null
  whatsapp: string | null
  website: string | null
  email: string | null
  type: string | null
  rating: number | null
  contacts: Contact[]
  source: string
  place_id?: string
  data_id?: string
  enriching?: boolean
  enriched?: boolean
}

interface ResultsTableProps {
  results: Prospect[]
  query: string
  onAddToCrm: (prospect: Prospect) => void
  onEnrich: (prospect: Prospect) => void
}

export function ProspectResultsTable({ results, query, onAddToCrm, onEnrich }: ResultsTableProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [addedToCrm, setAddedToCrm] = useState<Set<string>>(new Set())

  const toggle = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleAdd = (p: Prospect) => {
    setAddedToCrm(prev => new Set(prev).add(p.id))
    onAddToCrm(p)
  }

  const exportCsv = () => {
    const rows = [
      ["Empresa", "Telefone", "WhatsApp", "Site", "Email", "Tipo", "Cidade", "Funcionários"],
      ...results.map(p => [
        p.name,
        p.phone || "",
        p.whatsapp || "",
        p.website || "",
        p.email || "",
        p.type || "",
        p.city || "",
        p.contacts.map(c => `${c.name} (${c.role})`).join(" | ")
      ])
    ]
    const csv = rows.map(r => r.map(c => `"${c}"`).join(",")).join("\n")
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `prospects-${query.replace(/\s+/g, "-")}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-1">
            <Search className="w-3 h-3 mr-1" />
            {results.length} empresas encontradas
          </Badge>
          <span className="text-sm text-muted-foreground">para "{query}"</span>
        </div>
        <Button variant="outline" size="sm" onClick={exportCsv}>
          <Download className="w-4 h-4 mr-2" />
          Exportar CSV
        </Button>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 px-4 py-3 bg-secondary/60 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border">
          <span>Empresa</span>
          <span>Telefone / WhatsApp</span>
          <span>Site / Email</span>
          <span>Tipo</span>
          <span>Funcionários</span>
          <span>Ações</span>
        </div>

        {/* Table Rows */}
        {results.map((p) => (
          <div key={p.id} className="border-b border-border last:border-0">
            {/* Main Row */}
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 px-4 py-4 items-center hover:bg-secondary/30 transition-colors">
              {/* Name */}
              <div>
                <p className="font-semibold text-sm text-foreground leading-snug">{p.name}</p>
                {p.address && (
                  <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[200px]">{p.address}</p>
                )}
                {p.rating && (
                  <span className="text-xs text-yellow-500">★ {p.rating}</span>
                )}
              </div>

              {/* Phone / WhatsApp */}
              <div className="space-y-1">
                {p.phone ? (
                  <div className="flex items-center gap-1.5 text-sm">
                    <Phone className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span>{p.phone}</span>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
                {p.whatsapp && (
                  <div className="flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-green-500 shrink-0" />
                    <Badge variant="outline" className="text-xs text-green-600 border-green-500/30 bg-green-500/10 py-0">
                      WhatsApp
                    </Badge>
                  </div>
                )}
              </div>

              {/* Site / Email */}
              <div className="space-y-1">
                {p.website ? (
                  <div className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <a
                      href={p.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline truncate max-w-[100px] block"
                    >
                      {p.website.replace(/^https?:\/\//, '').split('/')[0]}
                    </a>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
                {p.email && (
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span className="text-xs truncate max-w-[100px]">{p.email}</span>
                  </div>
                )}
              </div>

              {/* Type */}
              <div>
                {p.type ? (
                  <Badge variant="outline" className="text-xs">
                    {p.type.split(' ').slice(0, 3).join(' ')}
                  </Badge>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </div>

              {/* Contacts */}
              <div>
                {p.contacts.length > 0 ? (
                  <button
                    onClick={() => toggle(p.id)}
                    className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    <Users className="w-4 h-4" />
                    {p.contacts.length} contato{p.contacts.length > 1 ? 's' : ''}
                    {expanded.has(p.id) ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                ) : p.enriching ? (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Enriquecendo...
                  </div>
                ) : (
                  <button
                    onClick={() => onEnrich(p)}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Users className="w-3.5 h-3.5" />
                    Buscar
                  </button>
                )}
              </div>

              {/* Actions */}
              <div>
                {addedToCrm.has(p.id) ? (
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <CheckCircle2 className="w-4 h-4" />
                    Adicionado
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs"
                    onClick={() => handleAdd(p)}
                  >
                    <PlusCircle className="w-3.5 h-3.5 mr-1" />
                    CRM
                  </Button>
                )}
              </div>
            </div>

            {/* Expanded Contacts Row */}
            {expanded.has(p.id) && p.contacts.length > 0 && (
              <div className="px-4 pb-4 bg-secondary/20">
                <div className="rounded-lg border border-border overflow-hidden">
                  <div className="grid grid-cols-[2fr_1fr_2fr_1fr] gap-3 px-3 py-2 bg-secondary/60 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <span>Nome</span>
                    <span>Cargo</span>
                    <span>E-mail</span>
                    <span>Telefone</span>
                  </div>
                  {p.contacts.map((c, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-[2fr_1fr_2fr_1fr] gap-3 px-3 py-2.5 border-t border-border text-sm items-center"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                          {c.name.charAt(0)}
                        </div>
                        <span className="font-medium">{c.name}</span>
                      </div>
                      <span className="text-muted-foreground text-xs">{c.role}</span>
                      <div>
                        {c.email ? (
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="text-xs">{c.email}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </div>
                      <div>
                        {c.phone ? (
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="text-xs">{c.phone}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
