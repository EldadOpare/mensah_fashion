import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import GuestLayout from '../components/layout/GuestLayout'
import { getBasket } from '../api/merchantApi'
import { formatPrice, toAbsoluteUrl } from '../config/apiConfig'

function buildWhatsAppText(basket) {
  const lines = [
    `*New Order — Mensah*`,
    `Order ID: ${basket.id}`,
    ``,
    `*Items:*`,
    ...(basket.items || []).map(i => `• ${i.name} × ${i.qty} — ${formatPrice(i.price_minor * i.qty, i.currency)}`),
    ``,
    `*Total: ${formatPrice(basket.total_minor, basket.currency || 'GHS')}*`,
    ``,
    `*Customer:* ${basket.customer_name || '—'}`,
    `*Phone:* ${basket.customer_phone || '—'}`,
    basket.customer_note ? `*Note:* ${basket.customer_note}` : '',
  ]
  return lines.filter(l => l !== '').join('\n')
}

export default function BasketConfirmation() {
  const { id } = useParams()
  const [basket, setBasket] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getBasket(id)
      .then(setBasket)
      .catch(err => setError(err.message || 'Could not load your order'))
      .finally(() => setLoading(false))
  }, [id])

  const openWhatsApp = () => {
    if (!basket?.merchant?.whatsapp_number) return
    const number = basket.merchant.whatsapp_number.replace(/[^0-9]/g, '')
    const text = encodeURIComponent(buildWhatsAppText(basket))
    window.open(`https://wa.me/${number}?text=${text}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      <Helmet><title>Order Confirmed — Mensah</title></Helmet>
      <GuestLayout>
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: 'var(--space-9) var(--space-6)' }}>
          {loading ? (
            <div>
              <div className="skeleton" style={{ height: '40px', width: '60%', margin: '0 auto var(--space-5)' }} />
              <div className="skeleton" style={{ height: '200px', marginBottom: 'var(--space-5)' }} />
              <div className="skeleton" style={{ height: '52px' }} />
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: 'var(--error)', marginBottom: 'var(--space-5)' }}>{error}</p>
              <Link to="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 'var(--text-sm)' }}>
                ← Return to Collection
              </Link>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              {/* Success header */}
              <div style={{ textAlign: 'center', marginBottom: 'var(--space-7)' }}>
                <div style={{
                  width: 56, height: 56,
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--bg-surface)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto var(--space-4)',
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-teal)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h1 style={{ fontFamily: 'var(--font-editorial)', fontSize: 'var(--text-2xl)', fontWeight: 400, marginBottom: 'var(--space-2)' }}>
                  Order Received
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-base)' }}>
                  Message the studio on WhatsApp to confirm your order.
                </p>
              </div>

              {/* Order summary card */}
              <div style={{
                border: '1.5px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                marginBottom: 'var(--space-5)',
              }}>
                <div style={{ padding: 'var(--space-4) var(--space-5)', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-surface)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p className="label">Order</p>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{basket.id}</p>
                  </div>
                </div>

                <div style={{ padding: 'var(--space-5)' }}>
                  {basket.items?.map(item => (
                    <div key={item.item_id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                      {item.image_url && (
                        <img
                          src={toAbsoluteUrl(item.image_url)}
                          alt={item.name}
                          style={{ width: 48, height: 60, objectFit: 'cover', borderRadius: 'var(--radius-xs)', flexShrink: 0 }}
                        />
                      )}
                      <div style={{ flex: 1 }}>
                        <p style={{ fontFamily: 'var(--font-editorial)', fontSize: 'var(--text-base)', marginBottom: '2px' }}>{item.name}</p>
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Qty: {item.qty}</p>
                      </div>
                      <p style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>
                        {formatPrice(item.price_minor * item.qty, item.currency)}
                      </p>
                    </div>
                  ))}

                  <div style={{ height: '1px', background: 'var(--border-color)', margin: 'var(--space-4) 0' }} />

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 500 }}>Total</span>
                    <span style={{ fontWeight: 700, fontSize: 'var(--text-md)' }}>
                      {formatPrice(basket.total_minor, basket.currency || 'GHS')}
                    </span>
                  </div>

                  {basket.customer_name && (
                    <div style={{ marginTop: 'var(--space-4)', padding: 'var(--space-3)', background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)' }}>
                      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '2px' }}>
                        <strong>{basket.customer_name}</strong> · {basket.customer_phone}
                      </p>
                      {basket.customer_note && (
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{basket.customer_note}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* WhatsApp CTA */}
              <button
                onClick={openWhatsApp}
                className="whatsapp"
                style={{ width: '100%', marginBottom: 'var(--space-3)', gap: 'var(--space-2)' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Message on WhatsApp
              </button>

              <div style={{ textAlign: 'center' }}>
                <Link to="/" style={{ textDecoration: 'none', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
                  ← Continue Shopping
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </GuestLayout>
    </>
  )
}
