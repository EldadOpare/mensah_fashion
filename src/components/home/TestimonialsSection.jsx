import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const TESTIMONIALS = [
  {
    name: 'Adaeze N.',
    role: 'Fashion Enthusiast',
    quote: 'Every stitch tells a story. The Ankara wrap dress I ordered is beyond beautiful — the fabric quality and the tailoring are exceptional. I get compliments every single time I wear it.',
    stars: 5,
  },
  {
    name: 'Kofi B.',
    role: 'Creative Director',
    quote: 'I ordered a bespoke kaftan for a wedding and the attention to detail was remarkable. The fit was perfect, the Kente trim was immaculate. This is what West African fashion should feel like.',
    stars: 5,
  },
  {
    name: 'Yetunde A.',
    role: 'Style Blogger',
    quote: 'Mensah completely transformed how I think about Ankara fashion. The pieces are modern, elevated, and deeply rooted in culture. The WhatsApp ordering experience was smooth and personal.',
    stars: 5,
  },
]

export default function TestimonialsSection() {
  const [cur, setCur] = useState(0)

  const prev = () => setCur(c => (c - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)
  const next = () => setCur(c => (c + 1) % TESTIMONIALS.length)

  const t = TESTIMONIALS[cur]

  return (
    <section style={{
      borderTop: '1px solid var(--border-color)',
      padding: 'var(--space-9) var(--space-6)',
    }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>

        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-7)' }}>
          <span style={{
            fontSize: 'var(--text-xs)',
            letterSpacing: '0.06em',
            color: 'var(--text-primary)',
            fontWeight: 500,
          }}>
            {String(cur + 1).padStart(2, '0')}/{String(TESTIMONIALS.length).padStart(2, '0')}
          </span>
          <span style={{
            fontSize: 'var(--text-xs)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
          }}>
            [Testimonial]
          </span>
        </div>

        {/* Body: author left, quote right */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '200px 1fr',
          gap: 'var(--space-8)',
          alignItems: 'start',
          marginBottom: 'var(--space-7)',
        }}>
          <div>
            <p style={{
              fontSize: 'var(--text-xs)',
              letterSpacing: '0.06em',
              color: 'var(--text-muted)',
              marginBottom: '2px',
            }}>
              [{t.name}]
            </p>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
              {t.role}
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.blockquote
              key={cur}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              style={{
                fontFamily: 'var(--font-editorial)',
                fontSize: 'clamp(var(--text-lg), 2.5vw, var(--text-2xl))',
                fontWeight: 400,
                lineHeight: 1.45,
                color: 'var(--text-primary)',
                fontStyle: 'normal',
              }}
            >
              "{t.quote}"
            </motion.blockquote>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'var(--space-4)',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
              {'★★★★★'.split('').map((s, i) => (
                <span key={i} style={{ color: '#C9A84C', fontSize: '14px' }}>{s}</span>
              ))}
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginLeft: '6px' }}>
                5.0 (32 Reviews)
              </span>
            </div>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
              See What Our Customers Are Saying
            </p>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <button
              onClick={prev}
              className="secondary"
              style={{ width: 40, height: 40, padding: 0, fontSize: '16px', borderRadius: 'var(--radius-full)' }}
              aria-label="Previous testimonial"
            >
              ←
            </button>
            <button
              onClick={next}
              className="secondary"
              style={{ width: 40, height: 40, padding: 0, fontSize: '16px', borderRadius: 'var(--radius-full)' }}
              aria-label="Next testimonial"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
