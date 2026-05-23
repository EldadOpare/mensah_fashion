import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import GuestLayout from '../components/layout/GuestLayout'
import { getBasket, getBasketOrder, payOrder } from '../api/merchantApi'
import { formatPrice, toAbsoluteUrl, WHATSAPP_NUMBER } from '../config/apiConfig'

function buildWhatsAppText(basket, localOrder) {
  const isPaid = localOrder?.payment_status === 'paid'
  const lines = [
    `*New Order — Mensah*`,
    `Order ID: ${basket.id}`,
    isPaid ? `*Payment: Paid via Paystack* (Ref: ${localOrder?.paystack_reference})` : '*Payment: Pending (Pay on Delivery)*',
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
  const [localOrder, setLocalOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  /* Paystack Payment States */
  const [paystackModalOpen, setPaystackModalOpen] = useState(false)
  const [paymentStep, setPaymentStep] = useState('method') // 'method' | 'card' | 'momo' | 'paying' | 'otp' | 'success'
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [momoNumber, setMomoNumber] = useState('')
  const [momoProvider, setMomoProvider] = useState('MTN')
  const [otpCode, setOtpCode] = useState('')
  const [paymentError, setPaymentError] = useState(null)
  const [progressMsg, setProgressMsg] = useState('Securing connection…')

  useEffect(() => {
    loadOrderDetails()
  }, [id])

  useEffect(() => {
    if (basket?.customer_phone) {
      setMomoNumber(basket.customer_phone)
    }
  }, [basket])

  const loadOrderDetails = async () => {
    try {
      const data = await getBasket(id)
      setBasket(data)
      try {
        const local = await getBasketOrder(id)
        setLocalOrder(local)
      } catch (localErr) {
        console.warn('No local order synced yet', localErr)
      }
    } catch (err) {
      setError(err.message || 'Could not load your order')
    } finally {
      setLoading(false)
    }
  }

  const openWhatsApp = () => {
    const raw = basket?.merchant?.whatsapp_number || WHATSAPP_NUMBER
    const number = raw.replace(/[^0-9]/g, '')
    const text = encodeURIComponent(buildWhatsAppText(basket, localOrder))
    window.open(`https://wa.me/${number}?text=${text}`, '_blank', 'noopener,noreferrer')
  }

  /* Trigger simulated Paystack payment processing */
  const startCardPayment = (e) => {
    e.preventDefault()
    if (!cardNumber || !cardExpiry || !cardCvv) {
      setPaymentError('Please fill out all card details.')
      return
    }
    processPayment('Verifying credit card details…')
  }

  const startMomoPayment = (e) => {
    e.preventDefault()
    if (!momoNumber) {
      setPaymentError('Please provide your Mobile Money wallet number.')
      return
    }
    processPayment('Requesting prompt on your mobile wallet…')
  }

  const processPayment = (initMsg) => {
    setPaymentError(null)
    setPaymentStep('paying')
    setProgressMsg(initMsg)

    // Stage 1: Authenticating with gateway
    setTimeout(() => {
      setProgressMsg('Connecting securely with Paystack servers…')
      
      // Stage 2: Authorization / Checking bank accounts
      setTimeout(() => {
        setProgressMsg('Contacting your bank for clearance…')
        
        // Stage 3: Requesting OTP
        setTimeout(() => {
          setPaymentStep('otp')
        }, 1500)
      }, 1500)
    }, 1500)
  }

  const submitOtp = async (e) => {
    e.preventDefault()
    if (!otpCode) {
      setPaymentError('Please enter the verification code sent to your device.')
      return
    }
    setPaymentError(null)
    setPaymentStep('paying')
    setProgressMsg('Clearing funds and generating Paystack settlement…')

    setTimeout(async () => {
      try {
        const ref = `PSTK-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
        await payOrder(localOrder?.id || id, ref)
        
        // Reload details to sync status
        const updated = await getBasketOrder(id)
        setLocalOrder(updated)
        
        setPaymentStep('success')
      } catch (err) {
        setPaymentStep('method')
        setPaymentError(err.message || 'Payment capture failed on server.')
      }
    }, 1500)
  }

  const formattedAmount = basket ? formatPrice(basket.total_minor, basket.currency || 'GHS') : '0.00 GHS'
  const isAlreadyPaid = localOrder?.payment_status === 'paid'

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
                  background: isAlreadyPaid ? 'rgba(26,122,64,0.08)' : 'var(--bg-surface)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto var(--space-4)',
                  border: isAlreadyPaid ? '1.5px solid #1a7a40' : 'none',
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={isAlreadyPaid ? '#1a7a40' : 'var(--accent-teal)'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h1 style={{ fontFamily: 'var(--font-editorial)', fontSize: 'var(--text-2xl)', fontWeight: 400, marginBottom: 'var(--space-2)' }}>
                  {isAlreadyPaid ? 'Payment Settled!' : 'Order Received'}
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-base)' }}>
                  {isAlreadyPaid 
                    ? `Paid via Paystack (${localOrder?.paystack_reference}). Message on WhatsApp to coordinate tailoring fit!`
                    : 'Pay securely now with Paystack, or message the studio on WhatsApp to confirm details.'}
                </p>
              </div>

              {/* Order summary card */}
              <div style={{
                border: '1.5px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                marginBottom: 'var(--space-5)',
                background: '#FFFFFF',
              }}>
                <div style={{ padding: 'var(--space-4) var(--space-5)', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-surface)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p className="label">Order Ledger</p>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      {isAlreadyPaid ? (
                        <span style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#1a7a40', background: '#F0FDF4', border: '1px solid rgba(26,122,64,0.2)', padding: '2px 6px', borderRadius: 4 }}>
                          PAID
                        </span>
                      ) : (
                        <span style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#888888', background: '#FAFAFA', border: '1px solid #E5E5E5', padding: '2px 6px', borderRadius: 4 }}>
                          UNPAID
                        </span>
                      )}
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{basket.id}</p>
                    </div>
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
                    <span style={{ fontWeight: 500 }}>Total Amount</span>
                    <span style={{ fontWeight: 500, fontSize: 'var(--text-md)' }}>
                      {formattedAmount}
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

              {/* CTAs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {!isAlreadyPaid && (
                  <button
                    onClick={() => {
                      setPaymentStep('method')
                      setPaymentError(null)
                      setPaystackModalOpen(true)
                    }}
                    style={{
                      width: '100%',
                      padding: '15px',
                      fontSize: 'var(--text-base)',
                      background: '#111111',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      border: 'none',
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                    Pay Securely with Paystack
                  </button>
                )}

                <button
                  onClick={openWhatsApp}
                  className="whatsapp"
                  style={{ width: '100%', gap: 'var(--space-2)', background: isAlreadyPaid ? '#25d366' : 'transparent', color: isAlreadyPaid ? '#FFFFFF' : 'var(--text-secondary)', border: isAlreadyPaid ? 'none' : '1.5px solid var(--border-color)' }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  {isAlreadyPaid ? 'Confirm Details on WhatsApp' : 'Message on WhatsApp (Pay Later)'}
                </button>

                <div style={{ textAlign: 'center', marginTop: 'var(--space-3)' }}>
                  <Link to="/" style={{ textDecoration: 'none', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
                    ← Continue Shopping
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* ── Paystack Simulated Modal ───────────────────────────────── */}
        <AnimatePresence>
          {paystackModalOpen && (
            <>
              {/* Overlay Backdrop */}
              <motion.div
                key="pstk-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  position: 'fixed', inset: 0,
                  background: 'rgba(15,15,15,0.48)',
                  backdropFilter: 'blur(5px)',
                  zIndex: 200,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: 16,
                }}
              >
                {/* Modal Container */}
                <motion.div
                  key="pstk-dialog"
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 30, scale: 0.95 }}
                  transition={{ type: 'spring', damping: 28, stiffness: 240 }}
                  style={{
                    width: '100%', maxWidth: '440px',
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    boxShadow: '0 20px 48px rgba(0,0,0,0.18)',
                    overflow: 'hidden',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    color: '#333333',
                  }}
                  onClick={e => e.stopPropagation()}
                >
                  {/* Modal Header */}
                  <div style={{
                    background: '#FAFAFA',
                    borderBottom: '1px solid #EEEEEE',
                    padding: '20px 24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        background: '#3ecf8e',
                        width: 28, height: 28,
                        borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0110 0v4" />
                        </svg>
                      </div>
                      <div>
                        <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#888888', display: 'block', lineHeight: 1 }}>
                          SECURE PAYOUT
                        </span>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#111111' }}>
                          Amina Stitches (Mensah)
                        </span>
                      </div>
                    </div>
                    {paymentStep !== 'paying' && paymentStep !== 'success' && (
                      <button
                        onClick={() => setPaystackModalOpen(false)}
                        style={{ background: 'none', border: 'none', font: 'inherit', fontSize: '20px', color: '#AAAAAA', cursor: 'pointer', outline: 'none' }}
                      >
                        ×
                      </button>
                    )}
                  </div>

                  {/* Modal Body */}
                  <div style={{ padding: '24px' }}>
                    
                    {/* Amount Banner */}
                    <div style={{
                      textAlign: 'center',
                      background: 'rgba(62,207,142,0.06)',
                      border: '1px solid rgba(62,207,142,0.18)',
                      borderRadius: '8px',
                      padding: '12px',
                      marginBottom: '20px',
                    }}>
                      <span style={{ fontSize: '11px', color: '#1a7a40', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Total Amount Due
                      </span>
                      <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#111111', margin: '2px 0 0' }}>
                        {formattedAmount}
                      </h2>
                    </div>

                    {paymentError && (
                      <div style={{
                        background: '#FFF5F5',
                        border: '1px solid #FFD3D3',
                        color: '#E53E3E',
                        fontSize: '12px',
                        padding: '10px 12px',
                        borderRadius: '6px',
                        marginBottom: '16px',
                        textAlign: 'center',
                      }}>
                        {paymentError}
                      </div>
                    )}

                    {/* STEPS */}
                    
                    {/* 1. SELECT PAYMENT METHOD */}
                    {paymentStep === 'method' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <p style={{ fontSize: '13px', color: '#666666', marginBottom: 6 }}>Select payment method:</p>
                        
                        <button
                          onClick={() => setPaymentStep('card')}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 14,
                            padding: '16px', borderRadius: '10px',
                            border: '1.5px solid #EEEEEE', background: '#FFFFFF',
                            textAlign: 'left', cursor: 'pointer', transition: 'border-color 0.2s',
                          }}
                          onMouseEnter={e => e.currentTarget.style.borderColor = '#3ecf8e'}
                          onMouseLeave={e => e.currentTarget.style.borderColor = '#EEEEEE'}
                        >
                          <span style={{ fontSize: '24px' }}>💳</span>
                          <div>
                            <strong style={{ display: 'block', fontSize: '14px', color: '#111111' }}>Credit / Debit Card</strong>
                            <span style={{ fontSize: '11px', color: '#888888' }}>Pay with Visa, Mastercard, or Verve</span>
                          </div>
                        </button>

                        <button
                          onClick={() => setPaymentStep('momo')}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 14,
                            padding: '16px', borderRadius: '10px',
                            border: '1.5px solid #EEEEEE', background: '#FFFFFF',
                            textAlign: 'left', cursor: 'pointer', transition: 'border-color 0.2s',
                          }}
                          onMouseEnter={e => e.currentTarget.style.borderColor = '#3ecf8e'}
                          onMouseLeave={e => e.currentTarget.style.borderColor = '#EEEEEE'}
                        >
                          <span style={{ fontSize: '24px' }}>📱</span>
                          <div>
                            <strong style={{ display: 'block', fontSize: '14px', color: '#111111' }}>Mobile Money Wallet</strong>
                            <span style={{ fontSize: '11px', color: '#888888' }}>Pay via MTN MoMo, Telecel, or AirtelTigo</span>
                          </div>
                        </button>
                      </div>
                    )}

                    {/* 2. CARD FORM */}
                    {paymentStep === 'card' && (
                      <form onSubmit={startCardPayment} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <label style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#888888' }}>Card Number</label>
                          <input
                            type="text"
                            required
                            placeholder="4000 1234 5678 9010"
                            value={cardNumber}
                            onChange={e => setCardNumber(e.target.value.replace(/[^0-9]/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19))}
                            style={{ padding: '10px 12px', fontSize: '14px', border: '1px solid #DDDDDD', borderRadius: '6px', outline: 'none', background: '#FAFAFA' }}
                          />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <label style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#888888' }}>Expiry Date</label>
                            <input
                              type="text"
                              required
                              placeholder="MM/YY"
                              value={cardExpiry}
                              onChange={e => setCardExpiry(e.target.value.replace(/[^0-9]/g, '').replace(/(.{2})/g, '$1/').replace(/\/$/, '').slice(0, 5))}
                              style={{ padding: '10px 12px', fontSize: '14px', border: '1px solid #DDDDDD', borderRadius: '6px', outline: 'none', background: '#FAFAFA' }}
                            />
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <label style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#888888' }}>CVV</label>
                            <input
                              type="password"
                              required
                              placeholder="123"
                              value={cardCvv}
                              onChange={e => setCardCvv(e.target.value.replace(/[^0-9]/g, '').slice(0, 3))}
                              style={{ padding: '10px 12px', fontSize: '14px', border: '1px solid #DDDDDD', borderRadius: '6px', outline: 'none', background: '#FAFAFA' }}
                            />
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                          <button
                            type="submit"
                            style={{ flex: 1, padding: 12, background: '#3ecf8e', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}
                          >
                            Pay {formattedAmount}
                          </button>
                          <button
                            type="button"
                            onClick={() => setPaymentStep('method')}
                            style={{ padding: '12px 16px', background: '#FFFFFF', border: '1px solid #DDDDDD', borderRadius: '8px', color: '#666666', fontSize: '14px', cursor: 'pointer' }}
                          >
                            Back
                          </button>
                        </div>
                      </form>
                    )}

                    {/* 3. MOBILE MONEY FORM */}
                    {paymentStep === 'momo' && (
                      <form onSubmit={startMomoPayment} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <label style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#888888' }}>Wallet Network</label>
                          <select
                            value={momoProvider}
                            onChange={e => setMomoProvider(e.target.value)}
                            style={{ padding: '10px 12px', fontSize: '14px', border: '1px solid #DDDDDD', borderRadius: '6px', outline: 'none', background: '#FAFAFA', appearance: 'auto' }}
                          >
                            <option value="MTN">MTN Mobile Money</option>
                            <option value="Telecel">Telecel Cash</option>
                            <option value="AirtelTigo">AirtelTigo Money</option>
                          </select>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <label style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#888888' }}>Wallet Number</label>
                          <input
                            type="text"
                            required
                            placeholder="+233 24 000 0000"
                            value={momoNumber}
                            onChange={e => setMomoNumber(e.target.value)}
                            style={{ padding: '10px 12px', fontSize: '14px', border: '1px solid #DDDDDD', borderRadius: '6px', outline: 'none', background: '#FAFAFA' }}
                          />
                        </div>

                        <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                          <button
                            type="submit"
                            style={{ flex: 1, padding: 12, background: '#3ecf8e', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}
                          >
                            Pay {formattedAmount}
                          </button>
                          <button
                            type="button"
                            onClick={() => setPaymentStep('method')}
                            style={{ padding: '12px 16px', background: '#FFFFFF', border: '1px solid #DDDDDD', borderRadius: '8px', color: '#666666', fontSize: '14px', cursor: 'pointer' }}
                          >
                            Back
                          </button>
                        </div>
                      </form>
                    )}

                    {/* 4. PROCESSING LOADER */}
                    {paymentStep === 'paying' && (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0', gap: 16 }}>
                        <div style={{
                          width: 44, height: 44,
                          border: '3px solid #F3F3F3',
                          borderTop: '3px solid #3ecf8e',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite',
                        }} />
                        <p style={{ fontSize: '13px', color: '#666666', fontWeight: 500, textAlign: 'center' }}>
                          {progressMsg}
                        </p>
                        
                        <style>{`
                          @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                          }
                        `}</style>
                      </div>
                    )}

                    {/* 5. OTP / MOCK AUTHORIZATION DIALOG */}
                    {paymentStep === 'otp' && (
                      <form onSubmit={submitOtp} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div style={{ textAlign: 'center', marginBottom: 4 }}>
                          <span style={{ fontSize: '24px' }}>🔒</span>
                          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#111111', margin: '6px 0 2px' }}>Two-Factor Authorization</h3>
                          <p style={{ fontSize: '12px', color: '#888888', maxWidth: '300px', margin: '0 auto' }}>
                            We have sent a verification code to your device. Please enter it below to authorize this payout.
                          </p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <label style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#888888', textAlign: 'center' }}>OTP Code</label>
                          <input
                            type="text"
                            required
                            placeholder="123456"
                            value={otpCode}
                            onChange={e => setOtpCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                            style={{ padding: '12px', fontSize: '16px', fontWeight: 700, letterSpacing: '0.3em', textAlign: 'center', border: '1px solid #DDDDDD', borderRadius: '8px', outline: 'none', background: '#FAFAFA' }}
                          />
                        </div>

                        <button
                          type="submit"
                          style={{ padding: 12, background: '#3ecf8e', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '14px', cursor: 'pointer', marginTop: 8 }}
                        >
                          Submit Authorization
                        </button>
                      </form>
                    )}

                    {/* 6. PAYMENT SUCCESS STATE */}
                    {paymentStep === 'success' && (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 0', gap: 16 }}>
                        <div style={{
                          width: 52, height: 52,
                          borderRadius: '50%',
                          background: '#F0FDF4',
                          border: '2px solid #1a7a40',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1a7a40" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        </div>
                        
                        <div style={{ textAlign: 'center' }}>
                          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#111111', margin: '0 0 4px' }}>
                            Transaction Approved
                          </h3>
                          <p style={{ fontSize: '12px', color: '#888888', maxWidth: '320px', margin: '0 auto', lineHeight: 1.5 }}>
                            Your billing request was cleared successfully. We have marked order <strong>{localOrder?.id || id}</strong> as fully paid.
                          </p>
                        </div>

                        <div style={{
                          background: '#FAFAFA',
                          border: '1px solid #EEEEEE',
                          borderRadius: '6px',
                          padding: '10px 14px',
                          width: '100%',
                          fontSize: '11px',
                          fontFamily: 'monospace',
                          color: '#666666',
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <span>GATEWAY:</span>
                            <strong>PAYSTACK LTD</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <span>REFERENCE:</span>
                            <strong>{localOrder?.paystack_reference || 'PSTK-N/A'}</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>SETTLEMENT:</span>
                            <strong style={{ color: '#1a7a40' }}>SUCCESSFUL</strong>
                          </div>
                        </div>

                        <button
                          onClick={() => setPaystackModalOpen(false)}
                          style={{
                            width: '100%',
                            padding: 12,
                            background: '#111111',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 600,
                            fontSize: '14px',
                            cursor: 'pointer',
                            marginTop: 8,
                          }}
                        >
                          Return to Receipt
                        </button>
                      </div>
                    )}

                  </div>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

      </GuestLayout>
    </>
  )
}
