import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import authMiddleware from './authMiddleware.js'

dotenv.config()

const app = express()

app.use(helmet())

const allowed = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
  'https://mensah-fashion.vercel.app',
].filter(Boolean)

const corsOptions = {
  origin: (origin, cb) => {
    // Allow all origins in development for easier testing
    if (process.env.NODE_ENV !== 'production') {
      cb(null, true)
      return
    }
    // Production: restrict to allowed list and Vercel subdomains
    let isVercel = false
    try {
      if (origin) {
        const url = new URL(origin)
        isVercel = url.hostname.endsWith('.vercel.app')
      }
    } catch (e) {}

    if (!origin || allowed.includes(origin) || isVercel) {
      cb(null, true)
    } else {
      cb(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
}
app.use(cors(corsOptions))

app.use(express.json())
app.use(cookieParser())

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: 'Too many login attempts' })
app.use('/api/auth/login', authLimiter)

// Health
app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

// Auth: Login
app.post('/api/auth/login', (req, res) => {
  const { pin } = req.body
  if (!pin) return res.status(400).json({ error: 'PIN is required' })

  const submitted = Buffer.from(pin.padEnd(64))
  const expected = Buffer.from((process.env.TAILOR_PIN || '').padEnd(64))
  const isValid = crypto.timingSafeEqual(submitted, expected)

  if (!isValid) return res.status(401).json({ error: 'Invalid PIN' })

  const token = jwt.sign({ role: 'tailor' }, process.env.JWT_SECRET, { expiresIn: '8h' })
  res.cookie('fv_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 8 * 60 * 60 * 1000,
  })
  res.json({ success: true })
})

// Auth: Logout
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('fv_token')
  res.json({ success: true })
})

// Auth: Verify (used by tailor pages to check session)
app.get('/api/auth/verify', authMiddleware, (req, res) => {
  res.json({ authenticated: true })
})

// ─── Orders (in-memory store, persists per server restart) ───────────
const orders = [
  {
    id: 'ORD-0001',
    basket_id: 'BSK-5931',
    customer_name: 'Ekow Mensah',
    customer_phone: '+233 24 411 2233',
    customer_note: 'Delivery: East Legon, Accra | Measurements: chest: 40 in, length: 34 in',
    items: [
      { name: 'Kente Cocktail Dress', qty: 1, price_minor: 68000, currency: 'GHS' }
    ],
    total_minor: 68000,
    currency: 'GHS',
    status: 'delivered',
    payment_status: 'paid',
    paystack_reference: 'PSTK-927A8F6C2E11',
    created_at: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'ORD-0002',
    basket_id: 'BSK-4819',
    customer_name: 'Abena Osei',
    customer_phone: '+233 50 123 4567',
    customer_note: 'Delivery: Kumasi | Notes: Standard fit, medium',
    items: [
      { name: 'Ankara Midi Dress', qty: 2, price_minor: 42000, currency: 'GHS' },
      { name: 'Peplum Blouse', qty: 1, price_minor: 28000, currency: 'GHS' }
    ],
    total_minor: 112000,
    currency: 'GHS',
    status: 'in_progress',
    payment_status: 'paid',
    paystack_reference: 'PSTK-834B7D2F1B00',
    created_at: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'ORD-0003',
    basket_id: 'BSK-8291',
    customer_name: 'Kofi Boateng',
    customer_phone: '+233 20 987 6543',
    customer_note: 'Delivery: Tema Community 6',
    items: [
      { name: 'Flowing Maxi Skirt', qty: 1, price_minor: 32000, currency: 'GHS' }
    ],
    total_minor: 32000,
    currency: 'GHS',
    status: 'received',
    payment_status: 'unpaid',
    paystack_reference: null,
    created_at: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
  }
]
let orderSeq = 4

// GET  /api/orders  — tailor sees all orders (auth required)
app.get('/api/orders', authMiddleware, (req, res) => {
  // Sort newest first
  const sorted = [...orders].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  res.json(sorted)
})

// POST /api/orders  — customer creates an order (no auth — public)
app.post('/api/orders', (req, res) => {
  const { customer_name, customer_phone, customer_note, items, total_minor, currency, basket_id } = req.body
  if (!customer_name || !items?.length) {
    return res.status(400).json({ error: 'customer_name and items are required' })
  }
  const order = {
    id: `ORD-${String(orderSeq++).padStart(4, '0')}`,
    basket_id: basket_id || null,
    customer_name,
    customer_phone: customer_phone || null,
    customer_note: customer_note || null,
    items,
    total_minor: total_minor || 0,
    currency: currency || 'GHS',
    status: 'received',
    created_at: new Date().toISOString(),
  }
  orders.push(order)
  res.status(201).json(order)
})

// PUT  /api/orders/:id/status  — tailor updates status (auth required)
app.put('/api/orders/:id/status', authMiddleware, (req, res) => {
  const order = orders.find(o => o.id === req.params.id)
  if (!order) return res.status(404).json({ error: 'Order not found' })
  const VALID = ['received', 'cut', 'in_progress', 'ready', 'delivered']
  const { status } = req.body
  if (!VALID.includes(status)) return res.status(400).json({ error: 'Invalid status' })
  order.status = status
  res.json(order)
})

// PUT  /api/orders/:id/pay  — customer pays for order via Paystack (public)
app.put('/api/orders/:id/pay', (req, res) => {
  const order = orders.find(o => o.id === req.params.id || o.basket_id === req.params.id)
  if (!order) return res.status(404).json({ error: 'Order not found' })
  
  const { reference } = req.body
  order.payment_status = 'paid'
  order.paystack_reference = reference || `PSTK-${crypto.randomBytes(6).toString('hex').toUpperCase()}`
  
  // Advance status slightly once paid!
  if (order.status === 'received') {
    order.status = 'cut'
  }
  
  res.json(order)
})

// GET /api/orders/basket/:basketId — get payment status of an order for a customer (public)
app.get('/api/orders/basket/:basketId', (req, res) => {
  const order = orders.find(o => o.basket_id === req.params.basketId)
  if (!order) return res.status(404).json({ error: 'Order not found' })
  res.json({
    id: order.id,
    payment_status: order.payment_status || 'unpaid',
    paystack_reference: order.paystack_reference || null,
    status: order.status,
  })
})
// ─────────────────────────────────────────────────────────────────────

// ─── Custom Items & Overrides ───────────────────────────────────────
const customItems = [
  {
    id: 'custom-seed-1',
    name: 'Royal Kente Kaftan',
    price_minor: 85000,
    currency: 'GHS',
    image_urls: ['/images/amina-stitches/kente.jpg'],
    in_stock: true, // IN STOCK dummy item for checkout demo!
    displayMode: '3d',
    garmentId: 'kaftan',
    published: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'custom-seed-2',
    name: 'Modern Ankara Blazer',
    price_minor: 62000,
    currency: 'GHS',
    image_urls: ['/images/amina-stitches/blazer.jpg'],
    in_stock: false, // SOLD OUT
    displayMode: '3d',
    garmentId: 'business_suit',
    published: true,
    created_at: new Date().toISOString(),
  }
]
let customItemSeq = 3

const stockOverrides = {}       // Map of itemId -> boolean
const visibilityOverrides = {}  // Map of itemId -> boolean

const imageMap = {
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

function formatExternalItem(item) {
  const stock = stockOverrides[item.id] !== undefined ? stockOverrides[item.id] : false
  const visible = visibilityOverrides[item.id] !== undefined ? visibilityOverrides[item.id] : true
  
  let mappedUrls = item.image_urls || []
  const mapped = imageMap[item.id]
  if (mapped) {
    mappedUrls = [mapped]
  }
  
  return {
    ...item,
    in_stock: stock,
    published: visible,
    image_urls: mappedUrls,
  }
}

// GET /api/items  —  unified catalogue (public)
app.get('/api/items', async (req, res) => {
  try {
    const apiBase = process.env.VITE_API_BASE_URL || 'https://api-hackathon.codedematrixtech.com'
    const merchantSlug = 'amina-stitches'
    
    // Fetch external pre-seeded items
    const extRes = await fetch(`${apiBase}/merchants/${merchantSlug}/items`)
    let extItems = []
    if (extRes.ok) {
      extItems = await extRes.json()
    }
    
    // Format external items to ensure standard shape and apply overrides
    const formattedExt = extItems.map(formatExternalItem)
    
    // Merge custom items
    const merged = [...customItems, ...formattedExt]
    
    // Filter to only published items unless the request comes from the tailor dashboard
    const isTailor = req.query.tailor === 'true'
    const result = isTailor ? merged : merged.filter(i => i.published !== false)
    
    res.json(result)
  } catch (err) {
    console.error('Failed to merge items catalogue:', err)
    // Fallback to custom items if external API is down
    res.json(customItems)
  }
})

// POST /api/items  —  tailor creates custom garment (auth required)
app.post('/api/items', authMiddleware, (req, res) => {
  const { name, price_minor, currency, image_urls, in_stock, displayMode, garmentId } = req.body
  if (!name || price_minor === undefined) {
    return res.status(400).json({ error: 'name and price_minor are required' })
  }
  
  const newItem = {
    id: `custom-${customItemSeq++}`,
    name,
    price_minor: Number(price_minor),
    currency: currency || 'GHS',
    image_urls: image_urls || [],
    in_stock: in_stock !== false,
    displayMode: displayMode || 'photo',
    garmentId: garmentId || null,
    published: true,
    created_at: new Date().toISOString(),
  }
  
  customItems.push(newItem)
  res.status(201).json(newItem)
})

// PUT /api/items/:id/stock  —  toggle stock status (auth required)
app.put('/api/items/:id/stock', authMiddleware, (req, res) => {
  const { id } = req.params
  const { in_stock } = req.body
  
  if (in_stock === undefined) {
    return res.status(400).json({ error: 'in_stock is required' })
  }
  
  const isCustom = id.startsWith('custom-')
  if (isCustom) {
    const item = customItems.find(i => i.id === id)
    if (!item) return res.status(404).json({ error: 'Custom item not found' })
    item.in_stock = !!in_stock
    return res.json(item)
  } else {
    // External item: override properties locally
    stockOverrides[id] = !!in_stock
    return res.json({ id, in_stock: !!in_stock })
  }
})

// PUT /api/items/:id/visibility  —  toggle public/private (auth required)
app.put('/api/items/:id/visibility', authMiddleware, (req, res) => {
  const { id } = req.params
  const { published } = req.body
  
  if (published === undefined) {
    return res.status(400).json({ error: 'published is required' })
  }
  
  const isCustom = id.startsWith('custom-')
  if (isCustom) {
    const item = customItems.find(i => i.id === id)
    if (!item) return res.status(404).json({ error: 'Custom item not found' })
    item.published = !!published
    return res.json(item)
  } else {
    // External item: override properties locally
    visibilityOverrides[id] = !!published
    return res.json({ id, published: !!published })
  }
})

// GET /api/items/:id  —  fetch single item (custom or external) with local overrides (public)
app.get('/api/items/:id', async (req, res) => {
  const { id } = req.params
  
  if (id.startsWith('custom-')) {
    const item = customItems.find(i => i.id === id)
    if (!item) return res.status(404).json({ error: 'Custom item not found' })
    return res.json(item)
  }
  
  try {
    const apiBase = process.env.VITE_API_BASE_URL || 'https://api-hackathon.codedematrixtech.com'
    const merchantSlug = 'amina-stitches'
    
    const extRes = await fetch(`${apiBase}/items/${id}`)
    if (!extRes.ok) {
      return res.status(extRes.status).json({ error: 'Item not found in external registry' })
    }
    const item = await extRes.json()
    const formatted = formatExternalItem(item)
    
    return res.json(formatted)
  } catch (err) {
    console.error('Failed to retrieve item details:', err)
    return res.status(500).json({ error: 'Failed to retrieve item details' })
  }
})
// ─────────────────────────────────────────────────────────────────────

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message,
  })
})

export default app

import { fileURLToPath } from 'url'
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = process.env.PORT || 3000
  app.listen(port, () => console.log(`Auth server running on http://localhost:${port}`))
}
