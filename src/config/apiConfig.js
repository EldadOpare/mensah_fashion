export const API_BASE = import.meta.env.VITE_API_BASE_URL || ''
export const MERCHANT_SLUG = 'amina-stitches'
export const TEAM_SLUG = 'mensah-app'

// WhatsApp number from the merchant profile — update if the number changes
export const WHATSAPP_NUMBER = '+233557654321'

export function toAbsoluteUrl(relativeUrl) {
  if (!relativeUrl) return null
  if (relativeUrl.startsWith('http')) return relativeUrl
  
  // Local static files and models must always be loaded relatively from the website origin (same-origin).
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

export const LOCAL_IMAGE_MAP = {
  'custom-seed-1': '/images/amina-stitches/kente.jpg',
  'custom-seed-2': '/images/amina-stitches/blazer.jpg',
  'as-dress-ankara': '/images/amina-stitches/ankara.webp',
  'as-dress-kente': '/images/amina-stitches/kente.jpg',
  'as-skirt-pencil': '/images/amina-stitches/pencil.avif',
  'as-skirt-maxi': '/images/amina-stitches/ankara.webp',
  'as-top-peplum': '/images/amina-stitches/blouse.avif',
  'as-bag-tote': '/images/amina-stitches/tote_bag.avif',
  'as-blazer-print': '/images/amina-stitches/blazer.jpg',
  'as-coord-set': '/images/amina-stitches/2_peice.webp',
  'as-kimono-cover': '/images/amina-stitches/cover_up.webp',
  'as-wrap-dress': '/images/amina-stitches/2_peice.webp',
  'as-gown-wedding': '/images/amina-stitches/kente.jpg',
  'as-eid-dress': '/images/amina-stitches/ankara.webp',
  'as-child-dress': '/images/amina-stitches/ankara.webp',
  'as-jumpsuit-wide': '/images/amina-stitches/2_peice.webp',
  'as-shorts-high': '/images/amina-stitches/pencil.avif',
  'as-top-crop': '/images/amina-stitches/blouse.avif',
  'as-headwrap-set': '/images/amina-stitches/pencil.avif',
  'as-mask-set': '/images/amina-stitches/pencil.avif',
  'as-earrings-fabric': '/images/amina-stitches/pencil.avif',
  'as-scrunchie-pack': '/images/amina-stitches/pencil.avif',
}

export function getItemLocalImage(itemId, fallbackUrl) {
  if (!itemId) return fallbackUrl
  return LOCAL_IMAGE_MAP[itemId] || fallbackUrl
}
