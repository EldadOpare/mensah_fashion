import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import GuestLayout from '../components/layout/GuestLayout'
import HeroSequence from '../components/hero/HeroSequence'
import ListingCard from '../components/listing/ListingCard'
import MerchantBanner from '../components/merchant/MerchantBanner'
import CampaignFeed from '../components/campaign/CampaignFeed'
import { getItems, getMerchant, getMerchantCampaigns } from '../api/merchantApi'
import { mapItemToGarment } from '../utils/garmentMap'

let heroPlayed = false

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

export default function GuestHome() {
  const [showHero, setShowHero] = useState(!heroPlayed)
  const [items, setItems] = useState([])
  const [merchant, setMerchant] = useState(null)
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [usingFallback, setUsingFallback] = useState(false)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    loadAll()
  }, [])

  async function loadAll() {
    try {
      const [rawItems, merchantData, campaignData] = await Promise.allSettled([
        getItems(),
        getMerchant(),
        getMerchantCampaigns(),
      ])

      if (rawItems.status === 'fulfilled') {
        const enriched = rawItems.value.map(item => ({
          ...item,
          ...mapItemToGarment(item),
        }))
        setItems(enriched)
      } else {
        setItems(MOCK_ITEMS)
        setUsingFallback(true)
      }

      if (merchantData.status === 'fulfilled') setMerchant(merchantData.value)
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

  return (
    <>
      <Helmet>
        <title>Mensah — Bespoke West African Fashion</title>
      </Helmet>

      {showHero && <HeroSequence onComplete={() => { heroPlayed = true; setShowHero(false) }} />}

      <GuestLayout>
        <MerchantBanner merchant={merchant} loading={loading && !merchant} />

        {usingFallback && (
          <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 var(--space-6) var(--space-3)' }}>
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

        {campaigns.length > 0 && <CampaignFeed campaigns={campaigns} />}

        <section style={{ maxWidth: '1440px', margin: '0 auto', padding: 'var(--space-6) var(--space-6) var(--space-9)' }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 'var(--space-4)',
            marginBottom: 'var(--space-6)',
          }}>
            <div>
              <p className="label" style={{ marginBottom: 'var(--space-2)' }}>The Collection</p>
              <h2 style={{ fontFamily: 'var(--font-editorial)', fontSize: 'var(--text-xl)', fontWeight: 400 }}>
                All Pieces
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
      </GuestLayout>
    </>
  )
}
