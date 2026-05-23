import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import AppLayout from '../components/layout/AppLayout'
import { getMerchantCampaigns, registerTeam } from '../api/merchantApi'
import { toAbsoluteUrl } from '../config/apiConfig'

const CSS = `
/* ── Stat cards ──────────────────────────────────────────── */
.td-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 28px;
}

.td-stat {
  background: #FFFFFF;
  border: 1px solid #F0F0F0;
  border-radius: 10px;
  padding: 20px 22px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.td-stat-value {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 32px;
  font-weight: 400;
  color: #111111;
  line-height: 1;
}

.td-stat-label {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 11px;
  font-weight: 500;
  color: #AAAAAA;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-top: 2px;
}

/* ── Section header ─────────────────────────────────────── */
.td-section-hd {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 16px;
}

.td-section-label {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #BBBBBB;
  margin-bottom: 4px;
}

.td-section-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 22px;
  font-weight: 400;
  color: #111111;
  line-height: 1.1;
}

/* ── Campaign grid ──────────────────────────────────────── */
.td-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 10px;
}

.td-card {
  background: #FFFFFF;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #F0F0F0;
  transition: box-shadow 0.18s, transform 0.18s;
  cursor: pointer;
}

.td-card:hover {
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  transform: translateY(-2px);
}

.td-card-img {
  width: 100%;
  aspect-ratio: 3/4;
  object-fit: cover;
  display: block;
  background: #F5F5F5;
}

.td-card-img-placeholder {
  width: 100%;
  aspect-ratio: 3/4;
  background: #F5F5F5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 10px;
  letter-spacing: 0.1em;
  color: #CCCCCC;
  text-transform: uppercase;
}

.td-card-body {
  padding: 12px 14px 14px;
}

.td-card-title {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #111111;
  margin-bottom: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.td-card-meta {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 11px;
  color: #AAAAAA;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.td-card-view {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 11px;
  color: #3D3D3D;
  font-weight: 500;
  text-decoration: none;
  padding: 3px 8px;
  border: 1px solid rgba(61,61,61,0.25);
  border-radius: 4px;
  transition: background 0.12s;
}
.td-card-view:hover { background: rgba(61,61,61,0.06); }

/* ── Empty state ─────────────────────────────────────────── */
.td-empty {
  text-align: center;
  padding: 80px 40px;
  background: #FFFFFF;
  border-radius: 12px;
  border: 1px dashed #E0E0E0;
}
.td-empty-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 22px;
  font-weight: 400;
  color: #111111;
  margin-bottom: 8px;
}
.td-empty-sub {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 13px;
  color: #AAAAAA;
  margin-bottom: 24px;
  line-height: 1.6;
}
.td-new-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #3D3D3D;
  color: #FFFFFF;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 12px;
  font-weight: 500;
  padding: 10px 20px;
  border-radius: 6px;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: background 0.15s;
}
.td-new-btn:hover { background: #2A2A2A; }

/* ── Hackathon section ───────────────────────────────────── */
.td-hackathon {
  margin-top: 32px;
  background: #FFFFFF;
  border: 1px solid #F0F0F0;
  border-radius: 10px;
  padding: 20px 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.td-hack-title {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #111111;
  margin-bottom: 3px;
}
.td-hack-sub {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 12px;
  color: #AAAAAA;
  line-height: 1.5;
}
.td-hack-btn {
  flex-shrink: 0;
  background: transparent;
  color: #111111;
  border: 1px solid #DDDDDD;
  border-radius: 6px;
  padding: 8px 16px;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.12s, border-color 0.12s;
  white-space: nowrap;
}
.td-hack-btn:hover:not(:disabled) { background: #F5F5F5; border-color: #CCCCCC; }
.td-hack-btn:disabled { opacity: 0.5; cursor: not-allowed; }

/* ── Filter tabs ─────────────────────────────────────────── */
.td-filter-row {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 16px;
}
.td-filter-tab {
  padding: 5px 13px;
  border-radius: 20px;
  border: 1px solid transparent;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  color: #999999;
  background: transparent;
  transition: all 0.12s;
  letter-spacing: 0.02em;
}
.td-filter-tab:hover { color: #111111; }
.td-filter-tab.active { background: #3D3D3D; color: #FFFFFF; border-color: #3D3D3D; }
`

function StatCard({ value, label }) {
  return (
    <div className="td-stat">
      <div className="td-stat-value">{value}</div>
      <div className="td-stat-label">{label}</div>
    </div>
  )
}

const FILTERS = ['All', 'Active', 'Draft', 'Archived']

export default function TailorDashboard() {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading]     = useState(true)
  const [teamStatus, setTeamStatus] = useState(null)
  const [activeFilter, setActiveFilter] = useState('All')
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

  const topbarLeft = (
    <div className="app-topbar-pill" style={{ background: 'transparent', border: '1px solid #EEEEEE' }}>
      Campaigns
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <polyline points="6,9 12,15 18,9"/>
      </svg>
    </div>
  )

  const topbarRight = (
    <Link to="/tailor/campaign/create" className="app-topbar-action">
      + New Campaign
    </Link>
  )

  return (
    <>
      <style>{CSS}</style>
      <AppLayout userType="tailor" onLogout={handleLogout} topbarLeft={topbarLeft} topbarRight={topbarRight}>

        {/* Stats row */}
        <div className="td-stats">
          <StatCard value={loading ? '—' : campaigns.length}                                                         label="Campaigns" />
          <StatCard value={loading ? '—' : campaigns.filter(c => c.image_urls?.length > 0).length}                   label="With Images" />
          <StatCard value={loading ? '—' : campaigns.reduce((s, c) => s + (c.featured_items?.length || 0), 0)}       label="Items Featured" />
        </div>

        {/* Section header */}
        <div className="td-section-hd">
          <div>
            <div className="td-section-label">Studio</div>
            <div className="td-section-title">Campaigns</div>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="td-filter-row">
          {FILTERS.map(f => (
            <button
              key={f}
              className={`td-filter-tab${activeFilter === f ? ' active' : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Campaign grid */}
        {loading ? (
          <div className="td-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="td-card">
                <div className="skeleton" style={{ aspectRatio: '3/4', width: '100%' }} />
                <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div className="skeleton" style={{ height: 13, width: '70%', borderRadius: 4 }} />
                  <div className="skeleton" style={{ height: 11, width: '40%', borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </div>
        ) : campaigns.length === 0 ? (
          <div className="td-empty">
            <div className="td-empty-title">No campaigns yet</div>
            <p className="td-empty-sub">
              Publish your first drop to share your bespoke<br/>pieces with customers.
            </p>
            <Link to="/tailor/campaign/create" className="td-new-btn">
              + Create Campaign
            </Link>
          </div>
        ) : (
          <motion.div
            className="td-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.04 }}
          >
            {campaigns.map((campaign, i) => {
              const cover = campaign.image_urls?.[0] ? toAbsoluteUrl(campaign.image_urls[0]) : null
              return (
                <motion.div
                  key={campaign.id}
                  className="td-card"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  {cover ? (
                    <img src={cover} alt={campaign.title} className="td-card-img" />
                  ) : (
                    <div className="td-card-img-placeholder">No image</div>
                  )}
                  <div className="td-card-body">
                    <div className="td-card-title">{campaign.title}</div>
                    <div className="td-card-meta">
                      <span>{campaign.featured_items?.length || 0} items</span>
                      <Link to={`/campaign/${campaign.id}`} className="td-card-view">View →</Link>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        )}

        {/* Team registration */}
        <div className="td-hackathon">
          <div>
            <div className="td-hack-title">Team Registration</div>
            <div className="td-hack-sub">
              Register <strong>mensah-app</strong> with the hackathon API. Safe to run multiple times.
            </div>
            {teamStatus === 'success' && (
              <p style={{ fontSize: 11, color: '#22a06b', marginTop: 4, fontFamily: 'Inter, system-ui, sans-serif' }}>✓ Team registered successfully</p>
            )}
            {teamStatus === 'error' && (
              <p style={{ fontSize: 11, color: '#CC0000', marginTop: 4, fontFamily: 'Inter, system-ui, sans-serif' }}>Registration failed — check console</p>
            )}
          </div>
          <button
            className="td-hack-btn"
            onClick={handleRegisterTeam}
            disabled={teamStatus === 'loading' || teamStatus === 'success'}
          >
            {teamStatus === 'loading' ? 'Registering…' : teamStatus === 'success' ? '✓ Done' : 'Register Team'}
          </button>
        </div>

      </AppLayout>
    </>
  )
}
