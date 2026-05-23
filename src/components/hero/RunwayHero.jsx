import { useState, useEffect, useRef } from 'react'
import { toAbsoluteUrl, formatPrice } from '../../config/apiConfig'

const CSS = `
.rh {
  position: relative;
  width: 100%;
  height: 88vh;
  min-height: 540px;
  overflow: hidden;
  background: #1A1714;
}

/* ── Slides ── */
.rh-slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 1s ease;
  pointer-events: none;
}
.rh-slide.rh-active {
  opacity: 1;
  pointer-events: auto;
}

.rh-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Gradient overlay — heavier at bottom for text legibility */
.rh-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(10,8,6,0.15) 0%,
    rgba(10,8,6,0) 35%,
    rgba(10,8,6,0.6) 80%,
    rgba(10,8,6,0.82) 100%
  );
}

/* Placeholder dark bg when image is missing */
.rh-placeholder {
  position: absolute;
  inset: 0;
  background: linear-gradient(145deg, #1A1714 0%, #231E1A 60%, #1A1714 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.rh-placeholder-watermark {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(5rem, 16vw, 14rem);
  font-weight: 400;
  font-style: italic;
  color: rgba(255,255,255,0.03);
  letter-spacing: -0.02em;
  user-select: none;
  white-space: nowrap;
}

/* ── Bottom info bar ── */
.rh-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2.8rem 4rem 3rem;
  z-index: 10;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 2rem;
}

.rh-info-left {}

.rh-eyebrow {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 10px;
  letter-spacing: 0.42em;
  color: rgba(255,255,255,0.45);
  text-transform: uppercase;
  margin-bottom: 0.7rem;
}

.rh-name {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(1.9rem, 4.5vw, 3.6rem);
  font-weight: 400;
  font-style: italic;
  color: #FFFFFF;
  line-height: 1.0;
  letter-spacing: -0.01em;
}

.rh-price {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 11px;
  letter-spacing: 0.32em;
  color: #C9A84C;
  text-transform: uppercase;
  margin-top: 0.9rem;
}

/* ── Right side: counter + CTA ── */
.rh-info-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1.4rem;
  flex-shrink: 0;
}

.rh-counter {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 13px;
  font-style: italic;
  color: rgba(255,255,255,0.4);
  letter-spacing: 0.06em;
}

.rh-cta {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 10px;
  letter-spacing: 0.42em;
  text-transform: uppercase;
  color: #FFFFFF;
  background: transparent;
  border: 1px solid rgba(255,255,255,0.35);
  padding: 0.9rem 2.2rem;
  cursor: pointer;
  font-weight: 400;
  transition: border-color 0.25s ease, background 0.25s ease;
  white-space: nowrap;
}
.rh-cta:hover {
  border-color: rgba(255,255,255,0.75);
  background: rgba(255,255,255,0.06);
}

/* ── Dots ── */
.rh-dots {
  position: absolute;
  bottom: 1.4rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  display: flex;
  gap: 7px;
  align-items: center;
}
.rh-dot {
  height: 3px;
  width: 18px;
  background: rgba(255,255,255,0.22);
  border-radius: 2px;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: background 0.4s, width 0.4s;
}
.rh-dot.rh-active {
  width: 32px;
  background: #C9A84C;
}

/* ── Arrows ── */
.rh-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 20;
  width: 42px;
  height: 42px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.18);
  color: rgba(255,255,255,0.75);
  font-size: 17px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, color 0.2s;
  backdrop-filter: blur(6px);
}
.rh-arrow:hover {
  background: rgba(255,255,255,0.16);
  color: #FFFFFF;
}
.rh-arrow-prev { left: 2.4rem; }
.rh-arrow-next { right: 2.4rem; }

/* ── Top brand label ── */
.rh-brand {
  position: absolute;
  top: 2.4rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 10px;
  letter-spacing: 0.55em;
  color: rgba(255,255,255,0.35);
  text-transform: uppercase;
  font-weight: 400;
  white-space: nowrap;
}
`

export default function RunwayHero({ items = [] }) {
  const [cur, setCur] = useState(0)
  const [paused, setPaused] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    if (items.length < 2 || paused) return
    timerRef.current = setTimeout(() => {
      setCur(c => (c + 1) % items.length)
    }, 4800)
    return () => clearTimeout(timerRef.current)
  }, [cur, items.length, paused])

  const go = (dir) => {
    clearTimeout(timerRef.current)
    setCur(c => (c + dir + Math.max(items.length, 1)) % Math.max(items.length, 1))
  }

  const goTo = (i) => {
    clearTimeout(timerRef.current)
    setCur(i)
  }

  const scrollToCollection = () =>
    document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })

  const active = items[cur] || null
  const total  = Math.max(items.length, 1)

  return (
    <div
      className="rh"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <style>{CSS}</style>

      {/* Brand */}
      <p className="rh-brand">Mensah</p>

      {/* Slides */}
      {items.length > 0 ? items.map((item, i) => {
        const src = item.image_urls?.[0] ? toAbsoluteUrl(item.image_urls[0]) : null
        return (
          <div key={item.id} className={`rh-slide${i === cur ? ' rh-active' : ''}`}>
            {src ? (
              <>
                <img
                  src={src}
                  alt={item.name}
                  onError={e => { e.currentTarget.style.display = 'none' }}
                />
                <div className="rh-overlay" />
              </>
            ) : (
              <div className="rh-placeholder">
                <span className="rh-placeholder-watermark">{item.name}</span>
                <div className="rh-overlay" style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(10,8,6,0.5) 70%, rgba(10,8,6,0.85) 100%)' }} />
              </div>
            )}
          </div>
        )
      }) : (
        /* Empty state — no items yet */
        <div className="rh-slide rh-active">
          <div className="rh-placeholder">
            <span className="rh-placeholder-watermark">Mensah</span>
            <div className="rh-overlay" style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(10,8,6,0.5) 70%, rgba(10,8,6,0.85) 100%)' }} />
          </div>
        </div>
      )}

      {/* Arrows */}
      {items.length > 1 && (
        <>
          <button className="rh-arrow rh-arrow-prev" onClick={() => go(-1)} aria-label="Previous">‹</button>
          <button className="rh-arrow rh-arrow-next" onClick={() => go(1)}  aria-label="Next">›</button>
        </>
      )}

      {/* Info bar */}
      <div className="rh-info">
        <div className="rh-info-left">
          <p className="rh-eyebrow">// The Collection</p>
          <h1 className="rh-name">{active?.name || 'Bespoke West African Fashion'}</h1>
          {active && (
            <p className="rh-price">{formatPrice(active.price_minor, active.currency)}</p>
          )}
        </div>
        <div className="rh-info-right">
          <span className="rh-counter">
            {String(cur + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
          <button className="rh-cta" onClick={scrollToCollection}>
            View Collection
          </button>
        </div>
      </div>

      {/* Dots */}
      {items.length > 1 && (
        <div className="rh-dots">
          {items.map((_, i) => (
            <button
              key={i}
              className={`rh-dot${i === cur ? ' rh-active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
