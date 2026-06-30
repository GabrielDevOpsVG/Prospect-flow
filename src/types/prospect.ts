// Shared types for the prospect search/enrichment pipeline

export interface ProspectContact {
  name: string
  role: string
  email: string | null
  phone: string | null
  source?: string
}

export interface Prospect {
  id: string
  name: string
  address: string | null
  city: string
  state: string
  phone: string | null
  raw_phone: string | null
  whatsapp: string | null
  website: string | null
  email: string | null
  type: string | null
  rating: number | null
  contacts: ProspectContact[]
  source: string
  place_id?: string
  data_id?: string
  enriching?: boolean
  enriched?: boolean
}
