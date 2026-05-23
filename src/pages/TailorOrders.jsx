import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import AppLayout from '../components/layout/AppLayout'
import { getMerchantOrders, updateOrderStatus } from '../api/merchantApi'
import { formatPrice } from '../config/apiConfig'

/* ─── Design tokens: dark grey accent ─────────────────────────── */
const ACCENT = '#3D3D3D'
const ACCENT_LIGHT = 'rgba(61,61,61,0.07)'
const ACCENT_BORDER = 'rgba(61,61,61,0.18)'

const STATUS_META = {
  received:    { label: 'Received',    color: '#555555', bg: '#F4F4F4' },
  cut:         { label: 'Cut',         color: '#666666', bg: '#F0F0F0' },
  in_progress: { label: 'In Progress', color: '#856404', bg: '#FEFCE8' },
  ready:       { label: 'Ready',       color: '#1a7a40', bg: '#F0FDF4' },
  delivered:   { label: 'Delivered',   color: '#1a3f7a', bg: '#EFF6FF' },
}
const STATUS_ORDER = ['received', 'cut', 'in_progress', 'ready', 'delivered']

const CSS = `
/* ── Page layout ─────────────────────────────────────────── */
.to-root { max-width: 1100px; width: 100%; margin: 0 auto; }

.to-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 28px;
}

.to-stat {
  background: #FFFFFF;
  border: 1px solid #F0F0F0;
  border-radius: 10px;
  padding: 20px 24px;
}
.to-stat-val {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 32px;
  font-weight: 400;
  color: #111111;
  line-height: 1;
}
.to-stat-lbl {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #888888;
  margin-top: 5px;
}

/* ── Filter row ──────────────────────────────────────────── */
.to-filter-row {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 20px;
}
.to-filter-tab {
  padding: 5px 14px;
  border-radius: 20px;
  border: 1px solid transparent;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  color: #999;
  background: transparent;
  transition: all 0.12s;
}
.to-filter-tab:hover { color: ${ACCENT}; }
.to-filter-tab.active {
  background: ${ACCENT};
  color: #FFFFFF;
  border-color: ${ACCENT};
}

/* ── List Header ─────────────────────────────────────────── */
.to-list-header {
  display: grid;
  grid-template-columns: 110px 2.2fr 1.6fr 1.3fr 1.3fr 30px;
  gap: 16px;
  padding: 10px 24px;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #AAAAAA;
  border-bottom: 1px solid #EEEEEE;
  margin-bottom: 10px;
}

/* ── Order card ──────────────────────────────────────────── */
.to-card {
  background: #FFFFFF;
  border: 1px solid #F0F0F0;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 8px;
  border-left: 3px solid transparent;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.to-card:hover {
  border-color: ${ACCENT};
  box-shadow: 0 4px 16px rgba(0,0,0,0.06);
}

.to-card-head {
  display: grid;
  grid-template-columns: 110px 2.2fr 1.6fr 1.3fr 1.3fr 30px;
  align-items: center;
  gap: 16px;
  padding: 18px 24px;
  cursor: pointer;
  user-select: none;
}

.to-card-id {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: ${ACCENT};
  letter-spacing: 0.05em;
  white-space: nowrap;
  background: ${ACCENT_LIGHT};
  border: 1px solid ${ACCENT_BORDER};
  border-radius: 4px;
  padding: 3px 8px;
  text-align: center;
}

.to-card-name {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 16px;
  font-weight: 400;
  color: #111111;
}

.to-card-date {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 12px;
  color: #888888;
  white-space: nowrap;
}

.to-card-total {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #111111;
  white-space: nowrap;
}

/* ── Status pill ─────────────────────────────────────────── */
.to-status-pill {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  border-radius: 20px;
  padding: 3px 10px;
  border: 1px solid currentColor;
  white-space: nowrap;
  justify-self: start;
}

/* ── Expanded detail ─────────────────────────────────────── */
.to-detail {
  padding: 0 24px 20px 24px;
  border-top: 1px solid #F5F5F5;
}

.to-detail-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr;
  gap: 28px;
  margin-top: 20px;
}

.to-detail-section-lbl {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #BBBBBB;
  margin-bottom: 12px;
}

.to-item-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #F5F5F5;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 13px;
  color: #333333;
}
.to-item-row:last-child { border-bottom: none; }

.to-contact-row {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 13px;
  color: #444444;
  line-height: 1.7;
}

.to-note {
  margin-top: 12px;
  padding: 10px 12px;
  background: #FAFAFA;
  border-radius: 6px;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 12px;
  color: #666666;
  font-style: italic;
  border-left: 2px solid ${ACCENT};
}

/* ── Status stepper (vertical timeline) ──────────────────── */
.to-status-stepper-vertical {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.to-status-step-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #EEEEEE;
  background: #FAFAFA;
  color: #666666;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  text-align: left;
  width: 100%;
}
.to-status-step-btn:hover:not(:disabled) {
  border-color: ${ACCENT};
  background: #FFFFFF;
}
.to-status-step-btn.current {
  background: ${ACCENT};
  color: #FFFFFF;
  border-color: ${ACCENT};
  box-shadow: 0 2px 8px rgba(61,61,61,0.2);
}
.to-status-step-btn.completed {
  background: #F9F9F8;
  color: #AAAAAA;
  border-color: #E8E8E4;
}
.to-status-step-btn.completed .to-status-step-icon {
  background: #E8E8E4;
  border-color: #D0D0CC;
  color: #666666;
}

.to-status-step-icon {
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1.5px solid currentColor;
  font-size: 10px;
  font-weight: 600;
  flex-shrink: 0;
}

/* ── Empty state ─────────────────────────────────────────── */
.to-empty {
  text-align: center;
  padding: 80px 40px;
  background: #FFFFFF;
  border-radius: 12px;
  border: 1px dashed #E0E0E0;
}
.to-empty-icon {
  width: 48px; height: 48px;
  margin: 0 auto 14px;
  color: #DDDDDD;
}
.to-empty-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 20px;
  font-weight: 400;
  color: #111111;
  margin-bottom: 6px;
}
.to-empty-sub {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 13px;
  color: #AAAAAA;
  line-height: 1.6;
}

/* ── Responsive ──────────────────────────────────────────── */
@media (max-width: 900px) {
  .to-detail-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .to-stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
  .to-list-header {
    display: none;
  }
  .to-card-head {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    padding: 14px 16px;
  }
  .to-card-head svg {
    margin-left: auto;
  }
  .to-detail-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  .to-status-pill {
    justify-self: unset;
  }
}
`

function fmt(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function StatusPill({ status }) {
  const meta = STATUS_META[status] || STATUS_META.received
  return (
    <span
      className="to-status-pill"
      style={{ color: meta.color, background: meta.bg, borderColor: meta.color + '44' }}
    >
      {meta.label}
    </span>
  )
}

function OrderCard({ order, onStatusChange }) {
  const [open, setOpen] = useState(false)
  const [updating, setUpdating] = useState(false)

  const handleStatus = async (status) => {
    if (updating || status === order.status) return
    setUpdating(true)
    try {
      await onStatusChange(order.id, status)
    } finally {
      setUpdating(false)
    }
  }

  return (
    <motion.div
      className="to-card"
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header row */}
      <div className="to-card-head" onClick={() => setOpen(o => !o)}>
        <span className="to-card-id">{order.id}</span>
        <span className="to-card-name">{order.customer_name}</span>
        <span className="to-card-date">{fmt(order.created_at)}</span>
        <StatusPill status={order.status} />
        <span className="to-card-total">
          {formatPrice(order.total_minor, order.currency)}
        </span>
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#BBBBBB"
          strokeWidth="2" strokeLinecap="round"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}
        >
          <polyline points="6,9 12,15 18,9"/>
        </svg>
      </div>

      {/* Expandable detail */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            style={{ overflow: 'hidden' }}
          >
            <div className="to-detail">
              <div className="to-detail-grid">
                {/* Items */}
                <div>
                  <div className="to-detail-section-lbl">Items</div>
                  {order.items?.map((item, i) => (
                    <div key={i} className="to-item-row">
                      <span>{item.name} {item.qty > 1 && `× ${item.qty}`}</span>
                      <span style={{ fontWeight: 500 }}>
                        {formatPrice(item.price_minor * (item.qty || 1), item.currency || order.currency)}
                      </span>
                    </div>
                  ))}
                  <div className="to-item-row" style={{ fontWeight: 600, marginTop: 4 }}>
                    <span>Total</span>
                    <span>{formatPrice(order.total_minor, order.currency)}</span>
                  </div>
                </div>

                {/* Customer */}
                <div>
                  <div className="to-detail-section-lbl">Customer</div>
                  <div className="to-contact-row">
                    <div style={{ fontWeight: 500, marginBottom: 2 }}>{order.customer_name}</div>
                    {order.customer_phone && (
                      <div>
                        <a href={`tel:${order.customer_phone}`} style={{ color: ACCENT, textDecoration: 'none' }}>
                          {order.customer_phone}
                        </a>
                      </div>
                    )}
                  </div>
                  {order.customer_note && (
                    <div className="to-note">"{order.customer_note}"</div>
                  )}
                </div>

                {/* Status stepper */}
                <div>
                  <div className="to-detail-section-lbl">Update Status</div>
                  <div className="to-status-stepper-vertical">
                    {STATUS_ORDER.map((s, index) => {
                      const isCurrent = s === order.status
                      const currentIndex = STATUS_ORDER.indexOf(order.status)
                      const isCompleted = index < currentIndex
                      return (
                        <button
                          key={s}
                          className={`to-status-step-btn${isCurrent ? ' current' : ''}${isCompleted ? ' completed' : ''}`}
                          onClick={() => handleStatus(s)}
                          disabled={updating}
                        >
                          <span className="to-status-step-icon">
                            {isCompleted ? '✓' : index + 1}
                          </span>
                          <span>{STATUS_META[s].label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const FILTER_TABS = ['All', ...STATUS_ORDER]

export default function TailorOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('All')
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

  const handleStatusChange = async (orderId, status) => {
    const updated = await updateOrderStatus(orderId, status)
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: updated.status } : o))
  }

  const filtered = activeFilter === 'All'
    ? orders
    : orders.filter(o => o.status === activeFilter)

  // Stats
  const stats = {
    total:       orders.length,
    received:    orders.filter(o => o.status === 'received').length,
    in_progress: orders.filter(o => ['cut','in_progress'].includes(o.status)).length,
    ready:       orders.filter(o => o.status === 'ready').length,
    delivered:   orders.filter(o => o.status === 'delivered').length,
  }

  const topbarLeft = (
    <div className="app-topbar-pill" style={{ background: 'transparent', border: '1px solid #EEEEEE' }}>
      All Orders
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
        <div className="to-root">

          {/* Stats */}
          <div className="to-stats">
            <div className="to-stat">
              <div className="to-stat-val">{stats.total}</div>
              <div className="to-stat-lbl">Total Orders</div>
            </div>
            <div className="to-stat">
              <div className="to-stat-val">{stats.received}</div>
              <div className="to-stat-lbl">New</div>
            </div>
            <div className="to-stat">
              <div className="to-stat-val">{stats.in_progress}</div>
              <div className="to-stat-lbl">In Progress</div>
            </div>
            <div className="to-stat">
              <div className="to-stat-val">{stats.ready}</div>
              <div className="to-stat-lbl">Ready</div>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="to-filter-row">
            {FILTER_TABS.map(f => (
              <button
                key={f}
                className={`to-filter-tab${activeFilter === f ? ' active' : ''}`}
                onClick={() => setActiveFilter(f)}
              >
                {f === 'All' ? 'All' : STATUS_META[f]?.label}
              </button>
            ))}
          </div>

          {/* Orders list */}
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 58, borderRadius: 10 }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="to-empty">
              <svg className="to-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
                <polyline points="3.27,6.96 12,12.01 20.73,6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
              </svg>
              <div className="to-empty-title">
                {activeFilter === 'All' ? 'No orders yet' : `No ${STATUS_META[activeFilter]?.label.toLowerCase()} orders`}
              </div>
              <p className="to-empty-sub">
                {activeFilter === 'All'
                  ? 'Orders from customers will appear here once they are placed.'
                  : 'Change the filter above to see orders in other stages.'}
              </p>
            </div>
          ) : (
            <motion.div layout>
              <div className="to-list-header">
                <span>Order ID</span>
                <span>Customer</span>
                <span>Date Placed</span>
                <span>Status</span>
                <span>Total</span>
                <span></span>
              </div>
              {filtered.map(order => (
                <OrderCard key={order.id} order={order} onStatusChange={handleStatusChange} />
              ))}
            </motion.div>
          )}

        </div>
      </AppLayout>
    </>
  )
}
