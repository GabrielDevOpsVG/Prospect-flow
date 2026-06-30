import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const niche = searchParams.get('niche')
  const city = searchParams.get('city')
  const state = searchParams.get('state') || ''

  if (!niche || !city) {
    return NextResponse.json({ error: 'niche and city are required' }, { status: 400 })
  }

  const apiKey = process.env.SERPAPI_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'SERPAPI_KEY not configured' }, { status: 500 })
  }

  const query = `${niche} em ${city}${state ? ` ${state}` : ''}`

  try {
    // Fetch up to 60 results using pagination (SerpAPI returns 20 per page)
    const allResults: SerpApiResult[] = []
    const starts = [0, 20, 40]

    await Promise.all(
      starts.map(async (start) => {
        const url = new URL('https://serpapi.com/search.json')
        url.searchParams.set('engine', 'google_maps')
        url.searchParams.set('q', query)
        url.searchParams.set('hl', 'pt')
        url.searchParams.set('gl', 'br')
        url.searchParams.set('start', String(start))
        url.searchParams.set('api_key', apiKey)

        const res = await fetch(url.toString())
        if (!res.ok) return

        const data = await res.json()
        if (data.local_results) {
          allResults.push(...data.local_results)
        }
      })
    )

    const prospects = allResults.map((item) => {
      const phone = item.phone?.replace(/\s+/g, '') || null
      const hasWhatsapp = isLikelyWhatsapp(phone)

      return {
        id: item.place_id || item.data_id,
        name: item.title,
        address: item.address || null,
        city: city,
        state: state,
        phone: formatPhone(phone),
        raw_phone: phone,
        whatsapp: hasWhatsapp ? formatPhone(phone) : null,
        website: sanitizeWebsite(item.website),
        email: null, // enriched separately
        type: item.type || null,
        rating: item.rating || null,
        reviews: item.reviews || null,
        contacts: [], // enriched separately
        source: 'google_maps',
        place_id: item.place_id,
        data_id: item.data_id,
      }
    })

    return NextResponse.json({ results: prospects, total: prospects.length, query })
  } catch (err) {
    console.error('[search] error:', err)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}

// --- Helpers ---

interface SerpApiResult {
  place_id?: string
  data_id?: string
  title: string
  address?: string
  phone?: string
  website?: string
  type?: string
  rating?: number
  reviews?: number
}

function isLikelyWhatsapp(raw: string | null): boolean {
  if (!raw) return false
  const digits = raw.replace(/\D/g, '')
  // Brazilian mobile: 11 digits with DDD and 9 prefix, or 13 starting with +55
  if (digits.length === 11 && digits[2] === '9') return true
  if (digits.length === 13 && digits.startsWith('55') && digits[4] === '9') return true
  return false
}

function formatPhone(raw: string | null): string | null {
  if (!raw) return null
  return raw.replace(/[^\d+\-() ]/g, '').trim()
}

function sanitizeWebsite(url: string | undefined): string | null {
  if (!url) return null
  // Remove tracking shorteners that aren't real sites
  if (url.includes('bit.ly') || url.includes('goo.gl')) return url
  return url
}
