import { API_BASE, MERCHANT_SLUG, TEAM_SLUG } from '../config/apiConfig'

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    const err = new Error(body.message || `API error ${res.status}`)
    err.status = res.status
    err.code = body.error
    throw err
  }
  return res.json()
}

export function getMerchant() {
  return apiFetch(`/merchants/${MERCHANT_SLUG}`)
}

export function getItems() {
  return apiFetch(`/merchants/${MERCHANT_SLUG}/items`)
}

export function getItem(itemId) {
  return apiFetch(`/items/${itemId}`)
}

export function getMerchantCampaigns() {
  return apiFetch(`/merchants/${MERCHANT_SLUG}/campaigns?team_slug=${TEAM_SLUG}`)
}

export function createBasket(payload) {
  return apiFetch('/baskets', {
    method: 'POST',
    body: JSON.stringify({ ...payload, merchant_id: MERCHANT_SLUG, team_slug: TEAM_SLUG }),
  })
}

export function getBasket(basketId) {
  return apiFetch(`/baskets/${basketId}`)
}

export function createCampaign(payload) {
  return apiFetch('/campaigns', {
    method: 'POST',
    body: JSON.stringify({ ...payload, merchant_id: MERCHANT_SLUG, team_slug: TEAM_SLUG }),
  })
}

export function getCampaign(campaignId) {
  return apiFetch(`/campaigns/${campaignId}`)
}

export async function uploadImage(file) {
  const formData = new FormData()
  formData.append('file', file)
  const res = await fetch(`${API_BASE}/uploads`, { method: 'POST', body: formData })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message || 'Upload failed')
  }
  return res.json()
}

export async function registerTeam({ name, contact } = {}) {
  try {
    return await apiFetch('/teams', {
      method: 'POST',
      body: JSON.stringify({ slug: TEAM_SLUG, name: name || 'Mensah', merchant_id: MERCHANT_SLUG, contact }),
    })
  } catch (err) {
    if (err.status === 409) return { slug: TEAM_SLUG, already_registered: true }
    throw err
  }
}
