import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import GuestLayout from '../components/layout/GuestLayout'
import CampaignCard from '../components/campaign/CampaignCard'
import { getMerchantCampaigns } from '../api/merchantApi'

export default function CampaignsList() {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMerchantCampaigns()
      .then(setCampaigns)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <Helmet><title>Campaigns — Mensah</title></Helmet>
      <GuestLayout>
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: 'var(--space-7) var(--space-6) var(--space-9)' }}>
          <Link
            to="/"
            style={{ textDecoration: 'none', color: 'var(--text-muted)', fontSize: 'var(--text-xs)', letterSpacing: '0.06em', display: 'block', marginBottom: 'var(--space-5)' }}
          >
            ← Collection
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            style={{ marginBottom: 'var(--space-7)' }}
          >
            <p className="label" style={{ marginBottom: 'var(--space-2)' }}>Featured Drops</p>
            <h1 style={{
              fontFamily: 'var(--font-editorial)',
              fontSize: 'clamp(var(--text-2xl), 4vw, var(--text-3xl))',
              fontWeight: 400,
              lineHeight: 1.15,
            }}>
              Campaigns
            </h1>
          </motion.div>

          {loading ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 'var(--space-6)',
            }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 340, borderRadius: 'var(--radius-md)' }} />
              ))}
            </div>
          ) : campaigns.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: 'var(--space-9)',
              border: '1px dashed var(--border-color)',
              borderRadius: 'var(--radius-md)',
            }}>
              <p style={{ fontFamily: 'var(--font-editorial)', fontSize: 'var(--text-xl)', fontWeight: 400, marginBottom: 'var(--space-3)' }}>
                No campaigns yet
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-5)' }}>
                New drops will appear here. Check back soon.
              </p>
              <Link to="/" style={{ textDecoration: 'none', color: 'var(--text-muted)', fontSize: 'var(--text-xs)', letterSpacing: '0.06em' }}>
                ← Back to Collection
              </Link>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 'var(--space-6)',
            }}>
              {campaigns.map((campaign, i) => (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                >
                  <CampaignCard campaign={campaign} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </GuestLayout>
    </>
  )
}
