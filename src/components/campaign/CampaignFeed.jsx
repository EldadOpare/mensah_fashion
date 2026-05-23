import { Link } from 'react-router-dom'
import { toAbsoluteUrl, formatPrice } from '../../config/apiConfig'

export default function CampaignFeed({ campaigns }) {
  if (!campaigns?.length) return null

  const [hero, ...rest] = campaigns
  const heroCover = hero.image_urls?.[0] ? toAbsoluteUrl(hero.image_urls[0]) : null

  return (
    <section style={{ padding: 'var(--space-9) var(--space-6)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>

        {/* ── Section heading row ─────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-6)', marginBottom: 'var(--space-7)', flexWrap: 'wrap' }}>
          <div>
            <p style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 'var(--space-4)', fontWeight: 400 }}>
              // Featured Drops
            </p>
            {/* HEAVY bold heading — Velour style */}
            <h2 style={{
              fontFamily: 'var(--font-sans)',
              fontWeight: 500,
              fontSize: 'clamp(3rem, 7vw, 5.8rem)',
              lineHeight: 0.88,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
              textTransform: 'uppercase',
            }}>
              All —<br />About<br />
              <span style={{ color: 'var(--text-muted)', fontSize: '0.55em', fontWeight: 500, textTransform: 'none', letterSpacing: '-0.01em' }}>
                The Drop ©2025
              </span>
            </h2>
          </div>

          {/* Top-right: small thumbnail + price (first campaign extra item) */}
          {rest[0] && (
            <Link to={`/campaign/${rest[0].id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', flexShrink: 0 }}>
              <div style={{ textAlign: 'right' }}>
                {rest[0].featured_items?.[0] && (
                  <p style={{ fontFamily: 'var(--font-editorial)', fontSize: 'var(--text-base)', color: 'var(--text-primary)', marginBottom: '4px', fontStyle: 'italic' }}>
                    ({formatPrice(rest[0].featured_items[0].price_minor, rest[0].featured_items[0].currency)})
                  </p>
                )}
                {rest[0].featured_items?.length > 1 && (
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
                    ({rest[0].featured_items.length} pieces)
                  </p>
                )}
              </div>
              <div style={{ width: '72px', height: '88px', background: 'var(--bg-surface)', overflow: 'hidden', flexShrink: 0 }}>
                {rest[0].image_urls?.[0] && (
                  <img src={toAbsoluteUrl(rest[0].image_urls[0])} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.currentTarget.style.display = 'none' }} />
                )}
              </div>
            </Link>
          )}
        </div>

        {/* ── Main grid: big left + stacked right ─────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 'var(--space-6)', alignItems: 'start' }}>

          {/* LEFT: large hero campaign image + CTA */}
          <div>
            {/* Decorative ✦ */}
            <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <span style={{ color: 'var(--accent-gold)', fontSize: '24px', lineHeight: 1 }}>✦</span>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.65, maxWidth: '340px' }}>
                Every piece carries rhythm beyond clothing — its motion and meaning, where West African craft meets the moment.
              </p>
            </div>

            <Link to={`/campaign/${hero.id}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
              <div style={{ height: 'clamp(340px, 40vw, 520px)', background: 'var(--bg-surface)', overflow: 'hidden', position: 'relative' }}>
                {heroCover ? (
                  <img
                    src={heroCover}
                    alt={hero.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onError={e => { e.currentTarget.style.display = 'none' }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a1814' }}>
                    <span style={{ fontFamily: 'var(--font-editorial)', fontSize: 'var(--text-2xl)', color: '#3a342e', fontWeight: 400 }}>Mensah</span>
                  </div>
                )}
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: 'var(--space-2)', letterSpacing: '0.04em' }}>
                ©Mensah — {hero.title}
              </p>
            </Link>

            {/* CTA row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
              <Link to={`/campaign/${hero.id}`}>
                <button style={{
                  borderRadius: 'var(--radius-full)',
                  padding: '11px 26px',
                  fontSize: '11px',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  fontWeight: 500,
                }}>
                  Learn More →
                </button>
              </Link>
              <span style={{ color: 'var(--accent-gold)', fontSize: '8px' }}>●</span>
              <Link to="/campaigns" style={{ textDecoration: 'none', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
                View All Drops
              </Link>
            </div>
          </div>

          {/* RIGHT: stacked campaign cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            {campaigns.slice(1, 3).map((campaign, i) => {
              const cover = campaign.image_urls?.[0] ? toAbsoluteUrl(campaign.image_urls[0]) : null
              return (
                <Link
                  key={campaign.id}
                  to={`/campaign/${campaign.id}`}
                  style={{ textDecoration: 'none', color: 'inherit', display: 'block', marginTop: i === 1 ? 'var(--space-4)' : 0 }}
                >
                  <div style={{ height: '260px', background: 'var(--bg-surface)', overflow: 'hidden', position: 'relative' }}>
                    {cover ? (
                      <img src={cover} alt={campaign.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onError={e => { e.currentTarget.style.display = 'none' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '11px', letterSpacing: '0.08em', background: 'var(--bg-surface)' }}>
                        MENSAH
                      </div>
                    )}
                    {campaign.featured_items?.length > 0 && (
                      <div style={{
                        position: 'absolute', bottom: 12, right: 12,
                        background: 'rgba(255,255,255,0.92)',
                        fontSize: '10px',
                        letterSpacing: '0.06em',
                        padding: '3px 8px',
                        color: 'var(--text-primary)',
                      }}>
                        ({campaign.featured_items.length} pieces)
                      </div>
                    )}
                  </div>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: 'var(--space-2)', letterSpacing: '0.04em' }}>
                    ©Mensah — {campaign.title}
                  </p>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
