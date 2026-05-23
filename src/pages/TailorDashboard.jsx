import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import AppLayout from '../components/layout/AppLayout'
import { getMerchantCampaigns, registerTeam } from '../api/merchantApi'
import { toAbsoluteUrl } from '../config/apiConfig'

function StatCard({ value, label, color }) {
  return (
    <div style={{
      background: '#FFF',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-6)',
    }}>
      <div style={{
        width: 36, height: 36,
        borderRadius: 'var(--radius-sm)',
        background: color + '22',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 'var(--space-4)',
      }}>
        <span style={{ width: 12, height: 12, borderRadius: '50%', background: color, display: 'inline-block' }} />
      </div>
      <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 500, color: 'var(--text-primary)', marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{label}</div>
    </div>
  )
}

export default function TailorDashboard() {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [teamStatus, setTeamStatus] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetch('/api/auth/verify', { credentials: 'include' })
      .then(r => { if (r.status === 401) navigate('/tailor/login') })
      .catch(() => {})
    getMerchantCampaigns()
      .then(setCampaigns)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    navigate('/tailor/login')
  }

  const handleRegisterTeam = async () => {
    setTeamStatus('loading')
    try {
      await registerTeam()
      setTeamStatus('success')
    } catch (err) {
      setTeamStatus(err.message?.includes('already') ? 'success' : 'error')
    }
  }

  return (
    <AppLayout userType="tailor" onLogout={handleLogout}>
      {/* Stats */}
      <div style={{
        padding: 'var(--space-7) var(--space-7) var(--space-6)',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 'var(--space-5)',
      }}>
        <StatCard
          value={loading ? '—' : campaigns.length}
          label="Campaigns"
          color="#4DA8DA"
        />
        <StatCard
          value={loading ? '—' : campaigns.filter(c => c.image_urls?.length > 0).length}
          label="With Images"
          color="#80D8C3"
        />
        <StatCard
          value={loading ? '—' : campaigns.reduce((sum, c) => sum + (c.featured_items?.length || 0), 0)}
          label="Items Featured"
          color="#FFD66B"
        />
      </div>

      {/* Campaigns section */}
      <div style={{ padding: '0 var(--space-7) var(--space-7)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-5)' }}>
          <div>
            <p className="label" style={{ marginBottom: 'var(--space-2)' }}>Studio</p>
            <h2 style={{ fontFamily: 'var(--font-editorial)', fontSize: 'var(--text-xl)', fontWeight: 400 }}>Campaigns</h2>
          </div>
          <Link to="/tailor/campaign/create">
            <button style={{ fontSize: 'var(--text-sm)', padding: '10px 18px' }}>+ New Campaign</button>
          </Link>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-5)' }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 220, borderRadius: 'var(--radius-md)' }} />
            ))}
          </div>
        ) : campaigns.length === 0 ? (
          <div style={{ padding: 'var(--space-9)', textAlign: 'center', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
              No campaigns yet. Publish your first drop to share with customers.
            </p>
            <Link to="/tailor/campaign/create">
              <button>Create Your First Campaign</button>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-5)' }}>
            {campaigns.map(campaign => {
              const cover = campaign.image_urls?.[0] ? toAbsoluteUrl(campaign.image_urls[0]) : null
              return (
                <motion.div
                  key={campaign.id}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    background: 'white',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <div style={{ height: 160, background: 'var(--bg-surface)', overflow: 'hidden' }}>
                    {cover ? (
                      <img src={cover} alt={campaign.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{
                        width: '100%', height: '100%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--text-muted)', fontSize: 'var(--text-xs)', letterSpacing: '0.06em',
                      }}>
                        NO IMAGE
                      </div>
                    )}
                  </div>
                  <div style={{ padding: 'var(--space-4)' }}>
                    <h3 style={{ fontFamily: 'var(--font-editorial)', fontSize: 'var(--text-base)', fontWeight: 400, marginBottom: 'var(--space-1)' }}>
                      {campaign.title}
                    </h3>
                    {campaign.copy_text && (
                      <p style={{
                        fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.5,
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                        marginBottom: 'var(--space-3)',
                      }}>
                        {campaign.copy_text}
                      </p>
                    )}
                    <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                      {campaign.featured_items?.length > 0 && (
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                          {campaign.featured_items.length} items
                        </span>
                      )}
                      <Link to={`/campaign/${campaign.id}`} style={{ marginLeft: 'auto' }}>
                        <button className="secondary" style={{ fontSize: 'var(--text-xs)', padding: '6px 12px' }}>View</button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      <div style={{ margin: '0 var(--space-7)', borderTop: '1px solid var(--border-color)' }} />

      {/* Team registration */}
      <div style={{ padding: 'var(--space-6) var(--space-7) var(--space-8)' }}>
        <p className="label" style={{ marginBottom: 'var(--space-3)' }}>Hackathon</p>
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-5)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)',
        }}>
          <div>
            <p style={{ fontWeight: 500, marginBottom: 4 }}>Team Registration</p>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
              Register <strong>mensah-app</strong> with the hackathon API. Safe to run multiple times.
            </p>
            {teamStatus === 'success' && (
              <p style={{ fontSize: 'var(--text-xs)', color: '#22a06b', marginTop: 6 }}>✓ Team registered successfully</p>
            )}
            {teamStatus === 'error' && (
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--error)', marginTop: 6 }}>Registration failed — check console</p>
            )}
          </div>
          <button
            className="secondary"
            onClick={handleRegisterTeam}
            disabled={teamStatus === 'loading' || teamStatus === 'success'}
            style={{ flexShrink: 0, fontSize: 'var(--text-sm)', padding: '10px 16px' }}
          >
            {teamStatus === 'loading' ? 'Registering…' : teamStatus === 'success' ? '✓ Done' : 'Register Team'}
          </button>
        </div>
      </div>
    </AppLayout>
  )
}
