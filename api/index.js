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
].filter(Boolean)

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowed.includes(origin)) cb(null, true)
    else cb(new Error('Not allowed by CORS'))
  },
  credentials: true,
}))

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
