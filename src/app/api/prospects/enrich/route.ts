import { NextResponse, type NextRequest } from 'next/server'

// Enriches a single company with CNPJ data (partners/employees, email, etc.)
// Uses BrasilAPI (free, unlimited) as primary source

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const domain = searchParams.get('domain')
  const companyName = searchParams.get('name')

  if (!domain && !companyName) {
    return NextResponse.json({ error: 'domain or name required' }, { status: 400 })
  }

  try {
    let cnpjData = null

    // Step 1: Try to find CNPJ via domain name search on BrasilAPI
    if (domain) {
      const cleanDomain = domain
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '')
        .split('/')[0]

      const searchRes = await fetch(
        `https://brasilapi.com.br/api/cnpj/v1/search?term=${encodeURIComponent(cleanDomain)}&size=1`,
        { headers: { 'Accept': 'application/json' } }
      )

      if (searchRes.ok) {
        const data = await searchRes.json()
        if (data?.length > 0) {
          cnpjData = await fetchCnpjDetails(data[0].cnpj)
        }
      }
    }

    // Step 2: Fallback - search by company name
    if (!cnpjData && companyName) {
      const nameEncoded = encodeURIComponent(companyName.slice(0, 40))
      const searchRes = await fetch(
        `https://brasilapi.com.br/api/cnpj/v1/search?term=${nameEncoded}&size=1`,
        { headers: { 'Accept': 'application/json' } }
      )

      if (searchRes.ok) {
        const data = await searchRes.json()
        if (data?.length > 0) {
          cnpjData = await fetchCnpjDetails(data[0].cnpj)
        }
      }
    }

    if (!cnpjData) {
      return NextResponse.json({ contacts: [], email: null, cnpj: null })
    }

    // Extract partners/contacts from CNPJ data
    const contacts = extractContacts(cnpjData, domain)
    const email = cnpjData.email || null

    return NextResponse.json({
      cnpj: cnpjData.cnpj,
      email: email?.toLowerCase() || null,
      contacts,
      company_official_name: cnpjData.razao_social,
    })
  } catch (err) {
    console.error('[enrich] error:', err)
    // Return empty gracefully - enrichment is best-effort
    return NextResponse.json({ contacts: [], email: null, cnpj: null })
  }
}

// --- Helpers ---

async function fetchCnpjDetails(cnpj: string) {
  const cleanCnpj = cnpj.replace(/\D/g, '')
  const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleanCnpj}`, {
    headers: { 'Accept': 'application/json' },
    next: { revalidate: 86400 }, // cache for 24h
  })
  if (!res.ok) return null
  return res.json()
}

function extractContacts(cnpjData: CnpjData, domain?: string | null): Contact[] {
  if (!cnpjData.qsa || cnpjData.qsa.length === 0) return []

  return cnpjData.qsa
    .filter((member) => member.nome_socio)
    .map((member) => {
      const fullName = member.nome_socio
      const role = member.qualificacao_socio?.descricao || 'Sócio'
      const estimatedEmail = domain ? estimateEmail(fullName, domain) : null

      return {
        name: toTitleCase(fullName),
        role,
        email: estimatedEmail,
        phone: null, // Not available from CNPJ
        source: 'brasilapi_cnpj',
      }
    })
    .slice(0, 5) // Cap at 5 contacts
}

function estimateEmail(name: string, domain: string): string | null {
  if (!name || !domain) return null
  const cleanDomain = domain
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .split('/')[0]

  const parts = name.toLowerCase().split(' ')
  if (parts.length < 2) return null

  const firstName = parts[0].replace(/[^a-z]/g, '')
  const lastName = parts[parts.length - 1].replace(/[^a-z]/g, '')

  if (!firstName || !lastName) return null
  return `${firstName}.${lastName}@${cleanDomain}`
}

function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

// --- Types ---

interface CnpjQsa {
  nome_socio: string
  qualificacao_socio?: { descricao?: string }
}

interface CnpjData {
  cnpj: string
  razao_social: string
  email?: string
  qsa?: CnpjQsa[]
}

interface Contact {
  name: string
  role: string
  email: string | null
  phone: string | null
  source: string
}
