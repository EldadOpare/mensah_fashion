import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import AppLayout from '../components/layout/AppLayout'
import { getMerchantOrders } from '../api/merchantApi'
import { formatPrice } from '../config/apiConfig'

/* ─── Styles ──────────────────────────────────────────────────── */
const ACCENT = '#3D3D3D'
const ACCENT_LIGHT = 'rgba(61,61,61,0.07)'

const STATUS_LABELS = {
  received:    'Received',
  cut:         'Cut',
  in_progress: 'In Progress',
  ready:       'Ready',
  delivered:   'Delivered',
}

const CSS = `
.ta-root { max-width: 1100px; width: 100%; margin: 0 auto; }

.ta-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 28px;
}

.ta-stat {
  background: #FFFFFF;
  border: 1px solid #F0F0F0;
  border-radius: 10px;
  padding: 20px 24px;
}
.ta-stat-val {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 32px;
  font-weight: 400;
  color: #111111;
  line-height: 1;
}
.ta-stat-lbl {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #888888;
  margin-top: 5px;
}

/* ── Grid Sections ───────────────────────────────────────── */
.ta-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
}

@media (max-width: 900px) {
  .ta-grid { grid-template-columns: 1fr; }
}

.ta-panel {
  background: #FFFFFF;
  border: 1px solid #F0F0F0;
  border-radius: 12px;
  padding: 24px 26px;
}

.ta-panel-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 20px;
  font-weight: 400;
  color: #111111;
  margin-bottom: 18px;
}

/* ── Item lists & charts ─────────────────────────────────── */
.ta-bar-row {
  margin-bottom: 16px;
}
.ta-bar-lbl {
  display: flex;
  justify-content: space-between;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #444444;
  margin-bottom: 5px;
}
.ta-bar-container {
  height: 8px;
  background: #F4F4F4;
  border-radius: 4px;
  overflow: hidden;
}
.ta-bar-fill {
  height: 100%;
  background: ${ACCENT};
  border-radius: 4px;
}

.ta-table {
  width: 100%;
  border-collapse: collapse;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 13px;
}
.ta-table th {
  text-align: left;
  padding: 10px 8px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #AAAAAA;
  border-bottom: 1px solid #EEEEEE;
}
.ta-table td {
  padding: 12px 8px;
  border-bottom: 1px solid #F5F5F5;
  color: #333333;
}
.ta-table tr:last-child td { border-bottom: none; }

.ta-rank {
  font-weight: 600;
  color: #BBBBBB;
  width: 30px;
}

.ta-item-name {
  font-weight: 500;
  color: #111111;
}

.ta-status-tag {
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  border-radius: 4px;
  padding: 2px 6px;
  width: fit-content;
}
.ta-status-tag.delivered { color: #1a7a40; background: #F0FDF4; }
.ta-status-tag.active { color: #856404; background: #FEFCE8; }

/* ── Responsive ──────────────────────────────────────────── */
@media (max-width: 768px) {
  .ta-stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
}
`

export default function TailorAnalytics() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetch('/api/auth/verify', { credentials: 'include' })
      .then(r => { if (r.status === 401) navigate('/tailor/login') })
      .catch(() => {})
    load()
  }, [])

  const load = () => {
    setLoading(true)
    getMerchantOrders()
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }

  /* Compute Analytics Data */
  const computeStats = () => {
    const totalOrders = orders.length
    
    // Revenue from completed/delivered orders, fallback to counting all if none marked delivered
    const hasDelivered = orders.some(o => o.status === 'delivered')
    const completedOrders = orders.filter(o => o.status === 'delivered')
    const pipelineOrders = orders.filter(o => o.status !== 'delivered')
    
    // Calculate total revenue (in GHS/minor units)
    // We treat delivered as finalized, but sum all valid orders for general finance visibility
    const totalRevenueMinor = orders.reduce((sum, o) => sum + (o.total_minor || 0), 0)
    const finalizedRevenueMinor = completedOrders.reduce((sum, o) => sum + (o.total_minor || 0), 0)
    const aovMinor = totalOrders > 0 ? Math.round(totalRevenueMinor / totalOrders) : 0

    // 1. Most Bought Items
    const itemsMap = {}
    orders.forEach(o => {
      o.items?.forEach(i => {
        const key = i.name
        if (!itemsMap[key]) {
          itemsMap[key] = { name: i.name, qty: 0, revenue: 0, currency: o.currency || 'GHS' }
        }
        itemsMap[key].qty += i.qty || 1
        itemsMap[key].revenue += (i.price_minor || 0) * (i.qty || 1)
      })
    })
    const sortedItems = Object.values(itemsMap).sort((a, b) => b.qty - a.qty).slice(0, 5)

    // 2. Sales by Order Status
    const statusCounts = { received: 0, cut: 0, in_progress: 0, ready: 0, delivered: 0 }
    orders.forEach(o => {
      if (statusCounts[o.status] !== undefined) {
        statusCounts[o.status]++
      } else {
        statusCounts.received++
      }
    })

    return {
      totalRevenueMinor,
      finalizedRevenueMinor,
      aovMinor,
      totalOrders,
      completedCount: completedOrders.length,
      pipelineCount: pipelineOrders.length,
      sortedItems,
      statusCounts,
    }
  }

  const data = computeStats()

  const topbarLeft = (
    <div className="app-topbar-pill" style={{ background: 'transparent', border: '1px solid #EEEEEE' }}>
      Analytics
    </div>
  )

  const topbarRight = (
    <button className="app-topbar-action" onClick={load}>
      ↻ Refresh
    </button>
  )

  return (
    <>
      <style>{CSS}</style>
      <AppLayout userType="tailor" topbarLeft={topbarLeft} topbarRight={topbarRight}
        onLogout={async () => {
          await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
          navigate('/tailor/login')
        }}
      >
        <div className="ta-root">

          {/* Metrics Row */}
          <div className="ta-stats">
            <div className="ta-stat">
              <div className="ta-stat-val">
                {loading ? '—' : formatPrice(data.totalRevenueMinor, 'GHS')}
              </div>
              <div className="ta-stat-lbl">Gross Revenue</div>
            </div>
            <div className="ta-stat">
              <div className="ta-stat-val">
                {loading ? '—' : formatPrice(data.aovMinor, 'GHS')}
              </div>
              <div className="ta-stat-lbl">Avg. Order Value</div>
            </div>
            <div className="ta-stat">
              <div className="ta-stat-val">
                {loading ? '—' : data.completedCount}
              </div>
              <div className="ta-stat-lbl">Delivered Orders</div>
            </div>
            <div className="ta-stat">
              <div className="ta-stat-val">
                {loading ? '—' : data.pipelineCount}
              </div>
              <div className="ta-stat-lbl">Active Pipeline</div>
            </div>
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="skeleton" style={{ height: 260, borderRadius: 12 }} />
              <div className="skeleton" style={{ height: 260, borderRadius: 12 }} />
            </div>
          ) : orders.length === 0 ? (
            <div style={{ background: '#FFFFFF', padding: '80px 40px', borderRadius: 12, border: '1px dashed #E0E0E0', textAlign: 'center' }}>
              <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 20, color: '#111111', marginBottom: 6 }}>No financial data yet</h2>
              <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 13, color: '#AAAAAA' }}>Once customers check out, your Paystack sales and item analytics will populate here automatically.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              
              {/* Grid 1: Most Bought & Status Overview */}
              <div className="ta-grid">
                
                {/* Most Bought Items */}
                <div className="ta-panel">
                  <h3 className="ta-panel-title">Most Popular Garments</h3>
                  <table className="ta-table">
                    <thead>
                      <tr>
                        <th>Rank</th>
                        <th>Garment</th>
                        <th style={{ textAlign: 'center' }}>Units Sold</th>
                        <th style={{ textAlign: 'right' }}>Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.sortedItems.map((item, index) => (
                        <tr key={index}>
                          <td className="ta-rank">#{index + 1}</td>
                          <td className="ta-item-name">{item.name}</td>
                          <td style={{ textAlign: 'center', fontWeight: 600 }}>{item.qty}</td>
                          <td style={{ textAlign: 'right', fontWeight: 500 }}>
                            {formatPrice(item.revenue, item.currency)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pipeline Status Breakdown */}
                <div className="ta-panel">
                  <h3 className="ta-panel-title">Production Workflow Status</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', marginTop: 8 }}>
                    {Object.keys(STATUS_LABELS).map(key => {
                      const count = data.statusCounts[key] || 0
                      const percent = data.totalOrders > 0 ? (count / data.totalOrders) * 100 : 0
                      return (
                        <div key={key} className="ta-bar-row">
                          <div className="ta-bar-lbl">
                            <span>{STATUS_LABELS[key]}</span>
                            <span style={{ fontWeight: 600 }}>
                              {count} {count === 1 ? 'order' : 'orders'} ({Math.round(percent)}%)
                            </span>
                          </div>
                          <div className="ta-bar-container">
                            <motion.div
                              className="ta-bar-fill"
                              initial={{ width: 0 }}
                              animate={{ width: `${percent}%` }}
                              transition={{ duration: 0.8, ease: 'easeOut' }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

              </div>

              {/* Grid 2: Recent Transactions */}
              <div className="ta-panel">
                <h3 className="ta-panel-title">Recent Order Transactions</h3>
                <table className="ta-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Items Purchased</th>
                      <th>Financing Ref</th>
                      <th>Date</th>
                      <th style={{ textAlign: 'right' }}>Amount</th>
                      <th style={{ textAlign: 'center' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 8).map(o => {
                      const dateStr = o.created_at ? new Date(o.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '—'
                      const isDelivered = o.status === 'delivered'
                      const displayItems = o.items?.map(i => `${i.name} (${i.qty})`).join(', ') || '—'
                      
                      return (
                        <tr key={o.id}>
                          <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{o.id}</td>
                          <td style={{ fontWeight: 500 }}>{o.customer_name}</td>
                          <td style={{ color: '#666666', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {displayItems}
                          </td>
                          <td style={{ color: '#888888', fontSize: '11px', fontFamily: 'monospace' }}>
                            {o.basket_id || 'wa_direct'}
                          </td>
                          <td>{dateStr}</td>
                          <td style={{ textAlign: 'right', fontWeight: 600 }}>
                            {formatPrice(o.total_minor, o.currency)}
                          </td>
                          <td style={{ display: 'flex', justifyContent: 'center' }}>
                            <span className={`ta-status-tag ${isDelivered ? 'delivered' : 'active'}`}>
                              {isDelivered ? 'Paid & Settled' : 'In Pipeline'}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

            </div>
          )}

        </div>
      </AppLayout>
    </>
  )
}
