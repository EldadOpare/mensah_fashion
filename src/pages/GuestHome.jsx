import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import GuestLayout from '../components/layout/GuestLayout'
import RunwayHero from '../components/hero/RunwayHero'
import ListingCard from '../components/listing/ListingCard'
import CampaignFeed from '../components/campaign/CampaignFeed'
import TestimonialsSection from '../components/home/TestimonialsSection'
import { getItems, getMerchantCampaigns } from '../api/merchantApi'
import { mapItemToGarment } from '../utils/garmentMap'
import { toAbsoluteUrl } from '../config/apiConfig'

const FILTERS = [
  { id: 'all',      label: 'All Pieces' },
  { id: 'in_stock', label: 'In Stock' },
  { id: '3d',       label: '3D View' },
]

const MOCK_ITEMS = [
  { id: 'mock-1', name: 'Ankara Wrap Dress', price_minor: 45000, currency: 'GHS', image_urls: [], in_stock: true, displayMode: 'photo' },
  { id: 'mock-2', name: 'Kente Kaftan', price_minor: 85000, currency: 'GHS', image_urls: [], in_stock: true, displayMode: '3d' },
  { id: 'mock-3', name: 'Print Blouse', price_minor: 22000, currency: 'GHS', image_urls: [], in_stock: false, displayMode: 'photo' },
]

const FALLBACK_CATEGORIES = [
  { label: 'Kaftans' },
  { label: 'Wrap Dresses' },
  { label: 'Sets & Coords' },
  { label: 'Blouses & Tops' },
  { label: '3D Pieces' },
]


const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

function FilterBar({ active, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
      {FILTERS.map(f => (
        <button
          key={f.id}
          onClick={() => onChange(f.id)}
          className={active === f.id ? '' : 'secondary'}
          style={{
            padding: '7px 16px',
            fontSize: 'var(--text-xs)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            borderRadius: 'var(--radius-full)',
          }}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}

function ItemSkeleton() {
  return (
    <div>
      <div className="skeleton" style={{ paddingBottom: '125%', borderRadius: 'var(--radius-md)' }} />
      <div style={{ padding: 'var(--space-3) 0 0' }}>
        <div className="skeleton" style={{ height: '18px', width: '70%', marginBottom: 'var(--space-2)' }} />
        <div className="skeleton" style={{ height: '14px', width: '40%' }} />
      </div>
    </div>
  )
}

function deriveCategories(items) {
  const rules = [
    { label: 'Kaftans',        match: i => /kaftan|agbada|boubou|dashiki/i.test(i.name) },
    { label: 'Dresses & Gowns', match: i => /dress|gown/i.test(i.name) },
    { label: 'Sets & Coords',  match: i => /set|coord|outfit/i.test(i.name) },
    { label: 'Blouses & Tops', match: i => /blouse|top/i.test(i.name) },
    { label: '3D Pieces',      match: i => i.displayMode === '3d' },
  ]
  return rules.map(r => ({ label: r.label, count: items.filter(r.match).length })).filter(c => c.count > 0)
}

export default function GuestHome() {
  const [items, setItems] = useState([])
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [usingFallback, setUsingFallback] = useState(false)
  const [filter, setFilter] = useState('all')

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    try {
      const [rawItems, campaignData] = await Promise.allSettled([
        getItems(),
        getMerchantCampaigns(),
      ])

      if (rawItems.status === 'fulfilled') {
        setItems(rawItems.value.map(item => ({ ...item, ...mapItemToGarment(item) })))
      } else {
        setItems(MOCK_ITEMS)
        setUsingFallback(true)
      }

      if (campaignData.status === 'fulfilled') setCampaigns(campaignData.value)
    } finally {
      setLoading(false)
    }
  }

  const filtered = items.filter(item => {
    if (filter === 'in_stock') return item.in_stock
    if (filter === '3d') return item.displayMode === '3d'
    return true
  })

  const heroItems = (() => {
    const from = campaigns[0]?.featured_items?.slice(0, 3)
    if (from?.length) return from
    const inStock = items.filter(i => i.in_stock)
    return (inStock.length ? inStock : items).slice(0, 3)
  })()

  const categories = items.length ? deriveCategories(items) : FALLBACK_CATEGORIES

  return (
    <>
      <Helmet>
        <title>Mensah — Bespoke West African Fashion</title>
      </Helmet>

      <GuestLayout>

        {/* ── Hero ─────────────────────────────────── */}
        <RunwayHero items={heroItems} />

        {/* ── Campaigns ─────────────────────────────── */}
        {campaigns.length > 0 && <CampaignFeed campaigns={campaigns} />}

        {/* ── Category index ────────────────────────── */}
        {(() => {
          const cats = categories.length ? categories : FALLBACK_CATEGORIES
          const maxCount = Math.max(...cats.map(c => c.count || 0), 1)
          const featuredItem = items.find(i => i.image_urls?.[0])
          const featuredImg = featuredItem?.image_urls?.[0] ? toAbsoluteUrl(featuredItem.image_urls[0]) : null

          return (
            <section style={{ borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'grid', gridTemplateColumns: '5fr 7fr', minHeight: '480px' }}>

                {/* Left: featured item image + text */}
                <div style={{ position: 'relative', overflow: 'hidden', borderRight: '1px solid var(--border-color)' }}>
                  {featuredImg ? (
                    <img
                      src={featuredImg}
                      alt={featuredItem?.name || ''}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', minHeight: '480px' }}
                      onError={e => { e.currentTarget.style.display = 'none' }}
                    />
                  ) : (
                    <div style={{ width: '100%', minHeight: '480px', background: 'var(--bg-surface)' }} />
                  )}
                  {/* Overlay text */}
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 'var(--space-6)', background: 'linear-gradient(to top, rgba(255,255,255,0.95) 0%, transparent 100%)' }}>
                    <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.65, maxWidth: '300px', marginBottom: 'var(--space-4)' }}>
                      Every piece carries rhythm beyond clothing — its motion and meaning, where West African craft meets the moment.
                    </p>
                    <button
                      onClick={() => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })}
                      className="secondary"
                      style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '9px 20px', borderRadius: 'var(--radius-full)' }}
                    >
                      See Collection →
                    </button>
                  </div>
                </div>

                {/* Right: right-aligned numbered categories, size ∝ count */}
                <div style={{ padding: 'var(--space-7) var(--space-6)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  {cats.map((cat, i) => {
                    const ratio = (cat.count || 0) / maxCount
                    // font size: 14px → 52px based on count ratio; fallback uses bell-curve index
                    const fallbackRatio = [0.3, 0.6, 1, 0.6, 0.3][i] ?? 0.5
                    const r = cat.count ? ratio : fallbackRatio
                    const fs = Math.round(14 + r * 38)
                    const isLarge = r > 0.6
                    return (
                      <button
                        key={cat.label}
                        onClick={() => {
                          setFilter('all')
                          document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'baseline',
                          justifyContent: 'flex-end',
                          gap: 'var(--space-3)',
                          width: '100%',
                          background: 'none',
                          border: 'none',
                          borderBottom: '1px solid var(--border-color)',
                          padding: 'var(--space-2) 0',
                          cursor: 'pointer',
                          textAlign: 'right',
                          color: isLarge ? 'var(--text-primary)' : 'var(--text-secondary)',
                          transition: 'color 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                        onMouseLeave={e => e.currentTarget.style.color = isLarge ? 'var(--text-primary)' : 'var(--text-secondary)'}
                      >
                        <span style={{ fontSize: '10px', letterSpacing: '0.12em', color: 'var(--text-muted)', fontWeight: 400, alignSelf: 'center', marginRight: 'auto' }}>
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span style={{ fontFamily: 'var(--font-sans)', fontSize: `${fs}px`, fontWeight: isLarge ? 500 : 400, lineHeight: 1.1, letterSpacing: isLarge ? '-0.02em' : '0' }}>
                          {cat.label}
                        </span>
                        {cat.count > 0 && (
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.05em', alignSelf: 'center', marginLeft: '6px' }}>
                            ({cat.count})
                          </span>
                        )}
                      </button>
                    )
                  })}
                  <div style={{ paddingTop: 'var(--space-3)', textAlign: 'right' }}>
                    <span style={{ fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                      [Categories]
                    </span>
                  </div>
                </div>
              </div>
            </section>
          )
        })()}

        {/* ── Fallback notice ────────────────────────── */}
        {usingFallback && (
          <div style={{ maxWidth: '1440px', margin: '0 auto', padding: 'var(--space-4) var(--space-6) 0' }}>
            <p style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--text-muted)',
              background: 'var(--bg-surface)',
              padding: 'var(--space-2) var(--space-3)',
              borderRadius: 'var(--radius-sm)',
              display: 'inline-block',
            }}>
              Live data unavailable — showing sample items
            </p>
          </div>
        )}

        {/* ── Collection grid ────────────────────────── */}
        <section id="collection" style={{ maxWidth: '1440px', margin: '0 auto', padding: 'var(--space-7) var(--space-6) var(--space-9)' }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 'var(--space-4)',
            marginBottom: 'var(--space-6)',
          }}>
            <div>
              <p style={{ fontSize: 'var(--text-xs)', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 'var(--space-2)', fontWeight: 400 }}>
                // The Collection
              </p>
              <h2 style={{
                fontFamily: 'var(--font-editorial)',
                fontSize: 'clamp(var(--text-2xl), 4vw, var(--text-3xl))',
                fontWeight: 400,
                lineHeight: 1.1,
              }}>
                {loading ? 'All Pieces' : `All Pieces (${filtered.length})`}
              </h2>
            </div>
            <FilterBar active={filter} onChange={setFilter} />
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 'var(--space-5)' }}>
              {Array.from({ length: 6 }).map((_, i) => <ItemSkeleton key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{
              padding: 'var(--space-9) 0',
              textAlign: 'center',
              border: '1px dashed var(--border-color)',
              borderRadius: 'var(--radius-md)',
            }}>
              <p style={{ color: 'var(--text-muted)' }}>
                {filter === 'in_stock' ? 'No pieces in stock right now.' : 'No pieces match this filter.'}
              </p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 'var(--space-5)' }}
            >
              {filtered.map(item => <ListingCard key={item.id} item={item} />)}
            </motion.div>
          )}
        </section>

        {/* ── Testimonials ───────────────────────────── */}
        <TestimonialsSection />

      </GuestLayout>
    </>
  )
}
