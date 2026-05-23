import { motion } from 'framer-motion'
import { toAbsoluteUrl } from '../../config/apiConfig'

export default function MerchantBanner({ merchant, loading }) {
  if (loading) {
    return (
      <div style={{ padding: 'var(--space-9) var(--space-6) var(--space-7)', maxWidth: '1440px', margin: '0 auto' }}>
        <div className="skeleton" style={{ width: '200px', height: '14px', marginBottom: 'var(--space-3)' }} />
        <div className="skeleton" style={{ width: '480px', maxWidth: '100%', height: '56px', marginBottom: 'var(--space-4)' }} />
        <div className="skeleton" style={{ width: '320px', height: '18px' }} />
      </div>
    )
  }

  if (!merchant) return null

  const accentColor = merchant.brand_colors?.[0] || '#C9A84C'

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Accent bar */}
      <div style={{ height: '3px', background: `linear-gradient(90deg, ${accentColor}, transparent)` }} />

      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: 'var(--space-8) var(--space-6) var(--space-6)',
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        alignItems: 'end',
        gap: 'var(--space-6)',
      }}>
        <div>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 500,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              marginBottom: 'var(--space-3)',
            }}
          >
            The Studio
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            style={{
              fontFamily: 'var(--font-editorial)',
              fontSize: 'clamp(var(--text-2xl), 5vw, var(--text-4xl))',
              fontWeight: 500,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
              marginBottom: 'var(--space-4)',
            }}
          >
            {merchant.name}
          </motion.h1>

          {merchant.description && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                fontSize: 'var(--text-base)',
                color: 'var(--text-secondary)',
                maxWidth: '560px',
                lineHeight: 1.7,
              }}
            >
              {merchant.description}
            </motion.p>
          )}
        </div>

        {merchant.logo_url && (
          <motion.img
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            src={toAbsoluteUrl(merchant.logo_url)}
            alt={merchant.name}
            style={{ height: '64px', width: 'auto', objectFit: 'contain', opacity: 0.85 }}
          />
        )}
      </div>
    </div>
  )
}
