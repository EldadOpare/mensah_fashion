import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toAbsoluteUrl } from '../../config/apiConfig'

export default function CampaignCard({ campaign }) {
  const { id, title, copy_text, image_urls } = campaign
  const cover = image_urls?.[0] ? toAbsoluteUrl(image_urls[0]) : null

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      style={{ flexShrink: 0, width: 280 }}
    >
      <Link to={`/campaign/${id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
        {/* Cover image */}
        <div style={{
          height: 200,
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          background: 'var(--bg-surface)',
          marginBottom: 'var(--space-3)',
          position: 'relative',
        }}>
          {cover ? (
            <img
              src={cover}
              alt={title}
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', gap: 'var(--space-2)',
            }}>
              <span style={{ fontSize: '28px' }}>✦</span>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>Campaign</p>
            </div>
          )}
          {/* Campaign badge */}
          <div style={{
            position: 'absolute', top: 10, right: 10,
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(6px)',
            padding: '2px 8px',
            borderRadius: 'var(--radius-full)',
            fontSize: 'var(--text-xs)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            fontWeight: 500,
          }}>
            Drop
          </div>
        </div>

        {/* Info */}
        <h3 style={{ fontFamily: 'var(--font-editorial)', fontSize: 'var(--text-md)', fontWeight: 500, marginBottom: 'var(--space-1)', lineHeight: 1.3 }}>
          {title}
        </h3>
        {copy_text && (
          <p style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--text-secondary)',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.6,
          }}>
            {copy_text}
          </p>
        )}
      </Link>
    </motion.div>
  )
}
