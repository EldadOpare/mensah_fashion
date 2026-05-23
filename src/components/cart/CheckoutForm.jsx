import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { createBasket } from '../../api/merchantApi'
import { formatPrice } from '../../config/apiConfig'

const MEASUREMENT_FIELDS = ['chest', 'waist', 'hips', 'length', 'sleeve']

export default function CheckoutForm({ onBack }) {
  const navigate = useNavigate()
  const { items, totalMinor, clearCart } = useCart()
  const [form, setForm] = useState({ name: '', phone: '', address: '', notes: '', measurements: {} })
  const [showMeasurements, setShowMeasurements] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }))
  const setMeasurement = (field, value) => setForm(f => ({
    ...f,
    measurements: { ...f.measurements, [field]: value },
  }))

  const isValid = form.name.trim() && form.phone.trim() && form.address.trim()

  const buildCustomerNote = () => {
    const parts = [`Delivery: ${form.address}`]
    const m = form.measurements
    const hasMeasurements = MEASUREMENT_FIELDS.some(f => m[f])
    if (hasMeasurements) {
      const mStr = MEASUREMENT_FIELDS
        .filter(f => m[f])
        .map(f => `${f}: ${m[f]}`)
        .join(', ')
      parts.push(`Measurements: ${mStr}`)
    }
    if (form.notes) parts.push(`Notes: ${form.notes}`)
    return parts.join(' | ')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isValid || submitting) return
    setError(null)
    setSubmitting(true)

    try {
      const payload = {
        items: items.map(i => ({
          item_id: i.item_id,
          qty: i.qty,
          item_note: i.item_note || undefined,
        })),
        customer_name: form.name.trim(),
        customer_phone: form.phone.trim(),
        customer_note: buildCustomerNote(),
      }

      const result = await createBasket(payload)
      clearCart()
      navigate(`/basket/${result.id}`)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {/* Order summary */}
      <div style={{ background: 'var(--bg-surface)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-2)' }}>
        <p className="label" style={{ marginBottom: 'var(--space-3)' }}>Order Summary</p>
        {items.map(item => (
          <div key={item.item_id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
              {item.name} × {item.qty}
            </span>
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>
              {formatPrice(item.price_minor * item.qty, item.currency)}
            </span>
          </div>
        ))}
        <div style={{ height: '1px', background: 'var(--border-color)', margin: 'var(--space-3) 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 500 }}>Total</span>
          <span style={{ fontWeight: 600 }}>{formatPrice(totalMinor, items[0]?.currency || 'GHS')}</span>
        </div>
      </div>

      {/* Fields */}
      <div>
        <label>Full Name *</label>
        <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Ama Owusu" required />
      </div>
      <div>
        <label>Phone Number *</label>
        <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+233 24 000 0000" required />
      </div>
      <div>
        <label>Delivery Address *</label>
        <textarea value={form.address} onChange={e => set('address', e.target.value)} placeholder="House number, street, city…" rows="2" required />
      </div>

      {/* Measurements toggle */}
      <div>
        <button
          type="button"
          className="secondary"
          onClick={() => setShowMeasurements(v => !v)}
          style={{ fontSize: 'var(--text-xs)', padding: '8px 14px', letterSpacing: '0.06em' }}
        >
          {showMeasurements ? '— Hide Measurements' : '+ Add Measurements (optional)'}
        </button>
        {showMeasurements && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
            {MEASUREMENT_FIELDS.map(field => (
              <div key={field}>
                <label>{field}</label>
                <input
                  value={form.measurements[field] || ''}
                  onChange={e => setMeasurement(field, e.target.value)}
                  placeholder="e.g. 38 in"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <label>Special Notes</label>
        <textarea value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Any specific requirements…" rows="2" />
      </div>

      {error && (
        <p style={{ color: 'var(--error)', fontSize: 'var(--text-sm)', background: '#fff5f5', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)' }}>
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={!isValid || submitting}
        style={{ width: '100%', padding: '14px', fontSize: 'var(--text-base)', marginTop: 'var(--space-2)' }}
      >
        {submitting ? 'Placing Order…' : 'Place Order via WhatsApp'}
      </button>

      <button type="button" className="ghost" onClick={onBack} style={{ width: '100%' }}>
        ← Back to Cart
      </button>
    </form>
  )
}
