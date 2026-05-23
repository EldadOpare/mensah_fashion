import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
const mensahLogo = '/icons/Mensah_Logo.png'
import PageTransition from '../components/ui/PageTransition'

const CSS = `
.tl-shell {
  min-height: 100vh;
  display: flex;
  background: #FFFFFF;
}

/* ── Left panel ──────────────────────────────────────────── */
.tl-left {
  flex: 1;
  background: #0D1E2C;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 40px 48px;
  position: relative;
  overflow: hidden;
  min-height: 100vh;
}

@media (max-width: 768px) { .tl-left { display: none; } }

/* Grid pattern on left panel */
.tl-left::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
}

.tl-left-logo {
  position: relative;
  z-index: 1;
}

.tl-left-logo img {
  height: 30px;
  width: auto;
  display: block;
  filter: brightness(0) invert(1);
  opacity: 0.9;
}

.tl-left-tagline {
  position: relative;
  z-index: 1;
}

.tl-left-headline {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(2.4rem, 5vw, 3.8rem);
  font-weight: 400;
  color: #FFFFFF;
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin-bottom: 16px;
}

.tl-left-headline em {
  font-style: italic;
  color: #C9A84C;
}

.tl-left-sub {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 13px;
  color: rgba(255,255,255,0.45);
  line-height: 1.7;
  max-width: 320px;
}

.tl-left-pills {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tl-pill {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.4);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 20px;
  padding: 5px 12px;
}

/* ── Right panel ─────────────────────────────────────────── */
.tl-right {
  width: 440px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 48px;
  background: #FFFFFF;
}

@media (max-width: 768px) {
  .tl-right { width: 100%; padding: 40px 24px; }
}

.tl-form-wrap {
  width: 100%;
  max-width: 340px;
}

.tl-form-logo {
  margin-bottom: 32px;
}

.tl-form-logo img {
  height: 26px;
  width: auto;
  display: block;
}

.tl-form-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 26px;
  font-weight: 400;
  color: #111111;
  margin-bottom: 6px;
  line-height: 1.2;
}

.tl-form-sub {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 13px;
  color: #AAAAAA;
  margin-bottom: 32px;
  line-height: 1.6;
}

.tl-field {
  margin-bottom: 20px;
}

.tl-label {
  display: block;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: #999999;
  margin-bottom: 8px;
}

.tl-pin-input {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 28px;
  letter-spacing: 0.5em;
  color: #111111;
  background: #FAFAFA;
  padding: 14px 18px;
  border: 1.5px solid #EEEEEE;
  border-radius: 10px;
  width: 100%;
  text-align: center;
  outline: none;
  transition: border-color 0.15s, background 0.15s;
  -webkit-appearance: none;
  appearance: none;
}
.tl-pin-input:focus { border-color: #111111; background: #FFFFFF; }

.tl-error {
  background: #FFF5F5;
  border: 1px solid #FFDDDD;
  border-radius: 7px;
  padding: 10px 14px;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 12px;
  color: #CC0000;
  margin-bottom: 16px;
  text-align: center;
}

.tl-submit {
  width: 100%;
  padding: 14px;
  background: #3D3D3D;
  color: #FFFFFF;
  border: none;
  border-radius: 10px;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  letter-spacing: 0.02em;
  transition: background 0.15s;
}
.tl-submit:hover { background: #2A2A2A; }

.tl-back {
  display: block;
  text-align: center;
  margin-top: 20px;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 12px;
  color: #AAAAAA;
  text-decoration: none;
  transition: color 0.12s;
}
.tl-back:hover { color: #111111; }
`

export default function TailorLogin() {
  const [pin, setPin] = useState('')
  const [error, setError] = useState(null)
  const [isShaking, setIsShaking] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin })
      })
      const data = await res.json()
      if (!res.ok) {
        setIsShaking(true)
        setTimeout(() => setIsShaking(false), 500)
        throw new Error(data.error || 'Login failed')
      }
      navigate('/tailor/dashboard')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <PageTransition>
      <style>{CSS}</style>
      <div className="tl-shell">

        {/* Left branded panel */}
        <div className="tl-left">
          <div className="tl-left-logo">
            <img src={mensahLogo} alt="Mensah" />
          </div>

          <div className="tl-left-tagline">
            <h1 className="tl-left-headline">
              Bespoke<br /><em>Ankara</em><br />Studio
            </h1>
            <p className="tl-left-sub">
              Manage your collections, campaigns and orders in one beautifully minimal workspace.
            </p>
          </div>

          <div className="tl-left-pills">
            {['Campaigns', 'Listings', 'Orders', 'Analytics'].map(p => (
              <span key={p} className="tl-pill">{p}</span>
            ))}
          </div>
        </div>

        {/* Right login form */}
        <div className="tl-right">
          <motion.div
            className="tl-form-wrap"
            animate={isShaking ? { x: [0, -8, 8, -4, 4, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            <div className="tl-form-logo">
              <img src={mensahLogo} alt="Mensah" />
            </div>

            <h2 className="tl-form-title">Welcome back</h2>
            <p className="tl-form-sub">Sign in to your Mensah Studio account</p>

            <form onSubmit={handleSubmit}>
              <div className="tl-field">
                <label className="tl-label">Studio PIN</label>
                <input
                  type="password"
                  className="tl-pin-input"
                  value={pin}
                  onChange={e => setPin(e.target.value)}
                  placeholder="••••••"
                  autoFocus
                />
              </div>

              {error && <div className="tl-error">{error}</div>}

              <button type="submit" className="tl-submit">
                Sign in to Studio →
              </button>
            </form>

            <a href="/" className="tl-back">← Back to shop</a>
          </motion.div>
        </div>

      </div>
    </PageTransition>
  )
}
