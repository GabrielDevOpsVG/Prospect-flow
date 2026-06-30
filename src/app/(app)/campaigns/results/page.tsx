"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { ProspectResultsTable } from "@/components/prospect-results-table"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2, AlertCircle, RefreshCw } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import type { Prospect } from "@/types/prospect"

export default function SearchResultsPage() {
  const searchParams = useSearchParams()
  const niche = searchParams.get("niche") || ""
  const city = searchParams.get("city") || ""
  const state = searchParams.get("state") || ""
  const campaignId = searchParams.get("campaign_id") || ""

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<Prospect[]>([])
  const [query, setQuery] = useState("")

  const fetchResults = useCallback(async () => {
    if (!niche || !city) return
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(
        `/api/prospects/search?niche=${encodeURIComponent(niche)}&city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}`
      )
      if (!res.ok) throw new Error("Falha na busca")
      const data = await res.json()
      setResults(data.results || [])
      setQuery(data.query || `${niche} em ${city}`)
    } catch (err) {
      setError("Não foi possível realizar a busca. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }, [niche, city, state])

  useEffect(() => {
    fetchResults()
  }, [fetchResults])

  const handleEnrich = useCallback(async (prospect: Prospect) => {
    // Mark as enriching
    setResults(prev =>
      prev.map(p => p.id === prospect.id ? { ...p, enriching: true } : p)
    )

    try {
      const params = new URLSearchParams()
      if (prospect.website) params.set("domain", prospect.website)
      params.set("name", prospect.name)

      const res = await fetch(`/api/prospects/enrich?${params.toString()}`)
      if (!res.ok) throw new Error("Enrich failed")

      const data = await res.json()

      setResults(prev =>
        prev.map(p =>
          p.id === prospect.id
            ? {
                ...p,
                enriching: false,
                enriched: true,
                contacts: data.contacts || [],
                email: data.email || p.email,
              }
            : p
        )
      )
    } catch {
      setResults(prev =>
        prev.map(p => p.id === prospect.id ? { ...p, enriching: false, enriched: true } : p)
      )
    }
  }, [])

  const handleAddToCrm = useCallback(async (prospect: Prospect) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Find or use the campaign_id from the URL
    let targetCampaignId = campaignId

    // If no campaign, create a default one
    if (!targetCampaignId) {
      const { data: campaign } = await supabase
        .from("campaigns")
        .insert({
          user_id: user.id,
          name: `${niche} em ${city}`,
          niche,
          city,
          state,
          status: "Ativo",
          channel: "whatsapp",
        })
        .select("id")
        .single()
      targetCampaignId = campaign?.id
    }

    if (!targetCampaignId) return

    // Insert company
    const { data: company } = await supabase
      .from("companies")
      .insert({
        campaign_id: targetCampaignId,
        name: prospect.name,
        segment: prospect.type,
        website: prospect.website,
        phone: prospect.phone,
        email: prospect.email,
        address: prospect.address,
        city: prospect.city,
        state: prospect.state,
        source: "serpapi_google_maps",
        validation_status: "pending",
      })
      .select("id")
      .single()

    if (!company) return

    // Insert contacts (sócios)
    if (prospect.contacts.length > 0) {
      await supabase.from("contacts").insert(
        prospect.contacts.map(c => ({
          company_id: company.id,
          name: c.name,
          role: c.role,
          email: c.email,
          phone: c.phone,
          source: c.source,
        }))
      )
    }

    // Create lead entry
    await supabase.from("leads").insert({
      campaign_id: targetCampaignId,
      company_id: company.id,
      status: "Novo",
    })
  }, [niche, city, state, campaignId])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/campaigns">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Resultados da Busca</h1>
          <p className="text-muted-foreground mt-1">
            Busca por <strong>{niche}</strong> em <strong>{city}{state ? `, ${state}` : ""}</strong>
          </p>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-muted-foreground">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-lg font-medium">Buscando empresas no Google Maps...</p>
          <p className="text-sm">Isso pode levar alguns segundos</p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-muted-foreground">
          <AlertCircle className="w-10 h-10 text-destructive" />
          <p className="text-lg font-medium">{error}</p>
          <Button onClick={fetchResults} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Tentar Novamente
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && results.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-muted-foreground">
          <AlertCircle className="w-10 h-10" />
          <p className="text-lg font-medium">Nenhuma empresa encontrada</p>
          <p className="text-sm">Tente um nicho ou cidade diferente</p>
          <Link href="/campaigns/new">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Nova Busca
            </Button>
          </Link>
        </div>
      )}

      {/* Results Table */}
      {!loading && !error && results.length > 0 && (
        <ProspectResultsTable
          results={results}
          query={query}
          onAddToCrm={handleAddToCrm}
          onEnrich={handleEnrich}
        />
      )}
    </div>
  )
}
