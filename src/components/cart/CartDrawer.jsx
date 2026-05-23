import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../../context/CartContext'
import CheckoutForm from './CheckoutForm'
import { formatPrice } from '../../config/apiConfig'

function QtyControl({ qty, onDecrement, onIncrement }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', border: '1.5px solid var(--border-color)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
      <button
        type="button"
        className="ghost"
        onClick={onDecrement}
        style={{ padding: '4px 10px', borderRadius: 0, minWidth: 32 }}
      >−</button>
      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500, minWidth: '20px', textAlign: 'center' }}>{qty}</span>
      <button
        type="button"
        className="ghost"
        onClick={onIncrement}
        style={{ padding: '4px 10px', borderRadius: 0, minWidth: 32 }}
      >+</button>
    </div>
  )
}

export default function CartDrawer({ isOpen, onClose }) {
  const { items, removeItem, updateQty, totalMinor } = useCart()
  const [view, setView] = useState('cart')

  const handleClose = () => {
    setView('cart')
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={handleClose}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.4)',
              zIndex: 400,
              backdropFilter: 'blur(2px)',
            }}
          />

          {/* Drawer */}
          <motion.aside
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            style={{
              position: 'fixed',
              top: 0, right: 0, bottom: 0,
              width: 'min(480px, 100vw)',
              background: 'var(--bg-primary)',
              zIndex: 401,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-drawer)',
            }}
          >
            {/* Header */}
            <div style={{
              padding: 'var(--space-5) var(--space-6)',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0,
            }}>
              <h2 style={{ fontFamily: 'var(--font-editorial)', fontSize: 'var(--text-lg)', fontWeight: 400 }}>
                {view === 'cart' ? 'Your Cart' : 'Checkout'}
              </h2>
              <button
                type="button"
                className="ghost"
                onClick={handleClose}
                style={{ padding: '6px', borderRadius: 'var(--radius-full)' }}
                aria-label="Close cart"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-5) var(--space-6)' }}>
              {view === 'cart' ? (
                items.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 'var(--space-9) 0' }}>
                    <p style={{ fontFamily: 'var(--font-editorial)', fontSize: 'var(--text-lg)', marginBottom: 'var(--space-3)', color: 'var(--text-secondary)' }}>
                      Your cart is empty
                    </p>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                      Browse the collection and add pieces to get started.
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                    {items.map(item => (
                      <div key={item.item_id} style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
                        {/* Thumbnail */}
                        <div style={{ width: 72, height: 90, borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: 'var(--bg-surface)', flexShrink: 0 }}>
                          {item.image_url ? (
                            <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ width: '100%', height: '100%', background: 'var(--bg-surface)' }} />
                          )}
                        </div>

                        {/* Details */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontFamily: 'var(--font-editorial)', fontSize: 'var(--text-base)', marginBottom: 'var(--space-1)', lineHeight: 1.3 }}>
                            {item.name}
                          </p>
                          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
                            {formatPrice(item.price_minor, item.currency)}
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                            <QtyControl
                              qty={item.qty}
                              onDecrement={() => updateQty(item.item_id, item.qty - 1)}
                              onIncrement={() => updateQty(item.item_id, item.qty + 1)}
                            />
                            <button
                              type="button"
                              className="ghost"
                              onClick={() => removeItem(item.item_id)}
                              style={{ padding: '4px 8px', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}
                            >
                              Remove
                            </button>
                          </div>
                        </div>

                        {/* Line total */}
                        <p style={{ fontSize: 'var(--text-sm)', fontWeight: 500, flexShrink: 0 }}>
                          {formatPrice(item.price_minor * item.qty, item.currency)}
                        </p>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                <CheckoutForm onBack={() => setView('cart')} />
              )}
            </div>

            {/* Footer — cart view only */}
            {view === 'cart' && items.length > 0 && (
              <div style={{
                padding: 'var(--space-5) var(--space-6)',
                borderTop: '1px solid var(--border-color)',
                flexShrink: 0,
                background: 'var(--bg-primary)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)' }}>Subtotal</span>
                  <span style={{ fontWeight: 500, fontSize: 'var(--text-base)' }}>
                    {formatPrice(totalMinor, items[0]?.currency || 'GHS')}
                  </span>
                </div>
                <button onClick={() => setView('checkout')} style={{ width: '100%', padding: '14px', fontSize: 'var(--text-base)' }}>
                  Proceed to Checkout
                </button>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textAlign: 'center', marginTop: 'var(--space-3)' }}>
                  Order placed via WhatsApp · No payment required now
                </p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
