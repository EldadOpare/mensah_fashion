export const API_BASE = import.meta.env.VITE_API_BASE_URL || ''
export const MERCHANT_SLUG = 'amina-stitches'
export const TEAM_SLUG = 'mensah-app'

// WhatsApp number from the merchant profile — update if the number changes
export const WHATSAPP_NUMBER = '+233557654321'

export function toAbsoluteUrl(relativeUrl) {
  if (!relativeUrl) return null
  if (relativeUrl.startsWith('http')) return relativeUrl
  
  // Local static files should be loaded relative to the website host (same-origin), 
  // not prepended with the external Hackathon API host.
  if (relativeUrl.startsWith('/images/amina-stitches/') || relativeUrl.startsWith('/models/')) {
    return relativeUrl
  }
  
  return `${API_BASE}${relativeUrl}`
}

export function formatPrice(price_minor, currency = 'GHS') {
  return `${currency} ${(price_minor / 100).toFixed(2)}`
}

export function openWhatsApp(message) {
  const number = WHATSAPP_NUMBER.replace(/[^0-9]/g, '')
  window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
}
