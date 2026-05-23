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

export async function getItems({ tailor } = {}) {
  if (tailor) {
    // Tailor view goes through local Express — includes stock/visibility overrides + custom items
    const items = await localFetch('/api/items?tailor=true')
    return Array.isArray(items) ? items : items.items || []
  }
  // Guest view calls the external API directly — no local Express server required
  const items = await apiFetch(`/merchants/${MERCHANT_SLUG}/items`)
  return Array.isArray(items) ? items : items.items || []
}

export async function getItem(itemId) {
  return apiFetch(`/merchants/${MERCHANT_SLUG}/items/${itemId}`)
}

export function payOrder(orderId, reference) {
  return localFetch(`/api/orders/${orderId}/pay`, {
    method: 'PUT',
    body: JSON.stringify({ reference }),
  })
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

// ─── Orders (local API) ───────────────────────────────────────────────
async function localFetch(path, options = {}) {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    credentials: 'include',
    ...options,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    const err = new Error(body.error || `API error ${res.status}`)
    err.status = res.status
    throw err
  }
  return res.json()
}

export function getMerchantOrders() {
  return localFetch('/api/orders')
}

export function updateOrderStatus(orderId, status) {
  return localFetch(`/api/orders/${orderId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  })
}

export function createOrder(payload) {
  return localFetch('/api/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function getBasketOrder(basketId) {
  return localFetch(`/api/orders/basket/${basketId}`)
}

export function createItem(payload) {
  return localFetch('/api/items', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function toggleItemStock(itemId, inStock) {
  return localFetch(`/api/items/${itemId}/stock`, {
    method: 'PUT',
    body: JSON.stringify({ in_stock: inStock }),
  })
}

export function toggleItemVisibility(itemId, published) {
  return localFetch(`/api/items/${itemId}/visibility`, {
    method: 'PUT',
    body: JSON.stringify({ published }),
  })
}

