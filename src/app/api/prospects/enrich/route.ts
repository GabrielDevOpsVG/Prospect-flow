import { NextResponse, type NextRequest } from 'next/server'

// Enriches a single company with CNPJ data (partners/employees) via BrasilAPI
// and validates/finds emails via Hunter.io

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const domain = searchParams.get('domain')
  const companyName = searchParams.get('name')

  if (!domain && !companyName) {
    return NextResponse.json({ error: 'domain or name required' }, { status: 400 })
  }

  const hunterKey = process.env.HUNTER_API_KEY

  try {
    let cnpjData = null
    let cleanDomain = domain
      ? domain.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]
      : null

    // ---- Step 1: Find CNPJ via BrasilAPI ----
    const searchTerm = cleanDomain || companyName?.slice(0, 40) || ''
    if (searchTerm) {
      const searchRes = await fetch(
        `https://brasilapi.com.br/api/cnpj/v1/search?term=${encodeURIComponent(searchTerm)}&size=1`,
        { headers: { Accept: 'application/json' } }
      )
      if (searchRes.ok) {
        const data = await searchRes.json()
        if (data?.length > 0) {
          cnpjData = await fetchCnpjDetails(data[0].cnpj)
        }
      }
    }

    // ---- Step 2: Hunter.io Domain Search ----
    // Find all emails associated with the domain
    let hunterEmails: HunterEmail[] = []
    let companyEmail: string | null = cnpjData?.email?.toLowerCase() || null

    if (hunterKey && cleanDomain) {
      const hunterRes = await fetch(
        `https://api.hunter.io/v2/domain-search?domain=${encodeURIComponent(cleanDomain)}&api_key=${hunterKey}&limit=10`
      )
      if (hunterRes.ok) {
        const hunterData = await hunterRes.json()
        if (hunterData?.data?.emails) {
          hunterEmails = hunterData.data.emails
          // Pick the best general email (generic pattern or first result)
          const generic = hunterEmails.find(
            (e) => e.type === 'generic' || e.pattern
          )
          if (generic && !companyEmail) {
            companyEmail = generic.value
          }
        }
      }
    }

    // ---- Step 3: Build contacts list ----
    const contacts: Contact[] = []

    // Contacts from CNPJ sócios
    if (cnpjData?.qsa?.length) {
      for (const member of cnpjData.qsa.slice(0, 5)) {
        if (!member.nome_socio) continue

        const name = toTitleCase(member.nome_socio)
        const role = member.qualificacao_socio?.descricao || 'Sócio'

        // Try to find their email on Hunter
        let email = null
        if (hunterKey && cleanDomain) {
          email = await findEmailOnHunter(name, cleanDomain, hunterKey, hunterEmails)
        }

        // Fallback: estimate from domain
        if (!email && cleanDomain) {
          email = estimateEmail(member.nome_socio, cleanDomain)
        }

        contacts.push({
          name,
          role,
          email,
          phone: null,
          source: 'brasilapi_cnpj',
        })
      }
    }

    // Add emails found by Hunter that don't belong to a known contact
    for (const he of hunterEmails.slice(0, 3)) {
      if (!he.first_name && !he.last_name) continue
      const name = [he.first_name, he.last_name].filter(Boolean).join(' ')
      const alreadyIn = contacts.find(
        (c) => c.name.toLowerCase() === name.toLowerCase()
      )
      if (!alreadyIn) {
        contacts.push({
          name,
          role: he.position || 'Contato',
          email: he.value,
          phone: null,
          source: 'hunter_io',
        })
      }
    }

    return NextResponse.json({
      cnpj: cnpjData?.cnpj || null,
      email: companyEmail,
      contacts,
      company_official_name: cnpjData?.razao_social || null,
    })
  } catch (err) {
    console.error('[enrich] error:', err)
    return NextResponse.json({ contacts: [], email: null, cnpj: null })
  }
}

// --- Helpers ---

async function fetchCnpjDetails(cnpj: string): Promise<CnpjData | null> {
  const cleanCnpj = cnpj.replace(/\D/g, '')
  try {
    const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleanCnpj}`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 86400 },
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

async function findEmailOnHunter(
  fullName: string,
  domain: string,
  apiKey: string,
  cachedEmails: HunterEmail[]
): Promise<string | null> {
  // First check in already-fetched emails
  const parts = fullName.toLowerCase().split(' ')
  const firstName = parts[0]
  const lastName = parts[parts.length - 1]

  const found = cachedEmails.find(
    (e) =>
      e.first_name?.toLowerCase() === firstName &&
      e.last_name?.toLowerCase() === lastName
  )
  if (found) return found.value

  // Try Hunter email finder
  try {
    const url = new URL('https://api.hunter.io/v2/email-finder')
    url.searchParams.set('domain', domain)
    url.searchParams.set('first_name', parts[0])
    url.searchParams.set('last_name', parts[parts.length - 1])
    url.searchParams.set('api_key', apiKey)

    const res = await fetch(url.toString())
    if (!res.ok) return null

    const data = await res.json()
    if (data?.data?.email && data?.data?.score > 30) {
      return data.data.email
    }
  } catch {
    // best-effort
  }
  return null
}

function estimateEmail(name: string, domain: string): string | null {
  const parts = name.toLowerCase().split(' ')
  if (parts.length < 2) return null
  const first = parts[0].replace(/[^a-z]/g, '')
  const last = parts[parts.length - 1].replace(/[^a-z]/g, '')
  if (!first || !last) return null
  return `${first}.${last}@${domain}`
}

function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

// --- Types ---

interface HunterEmail {
  value: string
  type?: string
  pattern?: string
  first_name?: string
  last_name?: string
  position?: string
  confidence?: number
}

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
