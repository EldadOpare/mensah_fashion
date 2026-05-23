import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { toAbsoluteUrl, formatPrice } from '../../config/apiConfig'

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
}

export default function ListingCard({ item }) {
  const [hovered, setHovered] = useState(false)

  const { id, name, price_minor, currency = 'GHS', image_urls, in_stock, displayMode } = item
  const thumbnail = image_urls?.[0] ? toAbsoluteUrl(image_urls[0]) : null

  return (
    <motion.article variants={itemVariants}>
      <Link
        to={`/listing/${id}`}
        style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Image */}
        <div style={{
          position: 'relative',
          paddingBottom: '125%',
          overflow: 'hidden',
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-md)',
        }}>
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={name}
              loading="lazy"
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                objectFit: 'cover',
                transform: hovered && in_stock ? 'scale(1.06)' : 'scale(1)',
                transition: 'transform 0.65s var(--ease-out)',
                filter: in_stock ? 'none' : 'grayscale(60%) brightness(0.9)',
              }}
            />
          ) : (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>No image</span>
            </div>
          )}

          {/* Out of stock */}
          {!in_stock && (
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(255,255,255,0.55)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{
                background: 'var(--bg-primary)',
                border: '1.5px solid var(--border-strong)',
                padding: '4px 12px',
                fontSize: 'var(--text-xs)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--text-secondary)',
                fontWeight: 500,
                borderRadius: 'var(--radius-full)',
              }}>
                Out of Stock
              </span>
            </div>
          )}

          {/* 3D badge */}
          {displayMode === '3d' && in_stock && (
            <div style={{
              position: 'absolute', top: 10, left: 10,
              background: 'var(--accent-blue)',
              color: 'white',
              fontSize: '9px', letterSpacing: '0.12em',
              textTransform: 'uppercase',
              padding: '3px 8px',
              borderRadius: 'var(--radius-xs)',
              fontWeight: 600,
            }}>
              3D
            </div>
          )}

          {/* Hover CTA */}
          {in_stock && (
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              background: 'linear-gradient(transparent, rgba(17,17,17,0.55))',
              padding: 'var(--space-5) var(--space-3) var(--space-3)',
              transform: hovered ? 'translateY(0)' : 'translateY(6px)',
              opacity: hovered ? 1 : 0,
              transition: 'opacity 0.28s, transform 0.28s var(--ease-out)',
            }}>
              <span style={{
                color: 'rgba(255,255,255,0.92)',
                fontSize: 'var(--text-xs)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontWeight: 500,
              }}>
                View Piece →
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: 'var(--space-3) var(--space-1) 0' }}>
          <h3 style={{
            fontFamily: 'var(--font-editorial)',
            fontSize: 'var(--text-base)',
            fontWeight: 500,
            marginBottom: 'var(--space-1)',
            color: 'var(--text-primary)',
            lineHeight: 1.3,
          }}>
            {name}
          </h3>
          <p style={{ fontSize: 'var(--text-sm)', color: in_stock ? 'var(--text-secondary)' : 'var(--text-muted)' }}>
            {in_stock ? formatPrice(price_minor, currency) : '—'}
          </p>
        </div>
      </Link>
    </motion.article>
  )
}
