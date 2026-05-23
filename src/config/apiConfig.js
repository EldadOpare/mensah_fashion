export const API_BASE = import.meta.env.VITE_API_BASE_URL || ''
export const MERCHANT_SLUG = 'amina-stitches'
export const TEAM_SLUG = 'mensah-app'

export function toAbsoluteUrl(relativeUrl) {
  if (!relativeUrl) return null
  if (relativeUrl.startsWith('http')) return relativeUrl
  return `${API_BASE}${relativeUrl}`
}

export function formatPrice(price_minor, currency = 'GHS') {
  return `${currency} ${(price_minor / 100).toFixed(2)}`
}
